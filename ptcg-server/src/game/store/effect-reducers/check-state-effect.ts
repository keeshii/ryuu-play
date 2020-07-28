import { State, GamePhase, GameWinner } from "../state/state";
import { StoreLike } from "../store-like";
import { CheckHpEffect } from "../effects/check-effects";
import { PokemonCardList } from "../state/pokemon-card-list";
import { ChoosePokemonPrompt } from "../prompts/choose-pokemon-prompt";
import { GameMessage, GameError } from "../../game-error";
import { ChoosePrizePrompt } from "../prompts/choose-prize-prompt";
import { CardList } from "../state/card-list";
import { PlayerType, SlotType } from "../actions/play-card-action";
import { GameOverPrompt } from "../prompts/game-over-prompt";
import { KnockOutEffect } from "../effects/game-effects";
import { Effect } from "../effects/effect";

interface PokemonItem {
  playerNum: number;
  cardList: PokemonCardList;
}

function findKoPokemons(store: StoreLike, state: State): PokemonItem[] {
  const pokemons: PokemonItem[] = [];

  for (let i = 0; i < state.players.length; i++) {
    const player = state.players[i];
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
      const checkHpEffect = new CheckHpEffect(player, cardList);
      store.reduceEffect(state, checkHpEffect);

      if (cardList.damage >= checkHpEffect.hp) {
        pokemons.push({ playerNum: i, cardList });
      }
    });
  }

  return pokemons;
}

function chooseActivePokemons(state: State): ChoosePokemonPrompt[] {
  const prompts: ChoosePokemonPrompt[] = [];

  for (const player of state.players) {
    const hasActive = player.active.cards.length > 0;
    const hasBenched = player.bench.some(bench => bench.cards.length > 0);
    if (!hasActive && hasBenched) {
      const choose = new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH ],
        { count: 1, allowCancel: false }
      );
      prompts.push(choose);
    }
  }

  return prompts;
}

function choosePrizeCards(state: State, prizesToTake: [number, number]): ChoosePrizePrompt[] {
  const prompts: ChoosePrizePrompt[] = [];

  for (let i = 0; i < state.players.length; i++) {
    const player = state.players[i];
    const prizeLeft = player.getPrizeLeft();

    if (prizesToTake[i] > prizeLeft) {
      prizesToTake[i] = prizeLeft;
    }

    if (prizesToTake[i] > 0) {
      const prompt = new ChoosePrizePrompt(player.id, GameMessage.CHOOSE_PRIZE_CARD, { count: prizesToTake[i] });
      prompts.push(prompt);
    }
  }

  return prompts;
}

export function endGame(store: StoreLike, state: State, winner: GameWinner, onComplete?: () => void): State {

  if (state.players.length !== 2) {
    throw new GameError(GameMessage.ILLEGAL_ACTION);
  }

  if (state.phase !== GamePhase.PLAYER_TURN && state.phase !== GamePhase.BETWEEN_TURNS) {
    throw new GameError(GameMessage.ILLEGAL_ACTION);
  }

  switch (winner) {
    case GameWinner.NONE:
      store.log(state, 'Game finished.');
      break;
    case GameWinner.DRAW:
      store.log(state, 'Game finished. It\'s a draw.');
      break;
    case GameWinner.PLAYER_1:
    case GameWinner.PLAYER_2:
      const winnerName = winner === GameWinner.PLAYER_1
        ? state.players[0].name
        : state.players[1].name;
      store.log(state, `Game finished. Winner ${winnerName}.`);
      break;
  }

  state = store.prompt(state, [
    new GameOverPrompt(state.players[0].id, winner),
    new GameOverPrompt(state.players[1].id, winner),
  ], () => {
    state.winner = winner;
    state.phase = GamePhase.FINISHED;
    if (onComplete !== undefined) {
      onComplete();
    }
  });

  return state;
}

function checkWinner(
  store: StoreLike,
  state: State,
  onComplete?: () => void
): State {
  const points: [number, number] = [0, 0];
  for (let i = 0; i < state.players.length; i++) {
    const player = state.players[i];
    // Player has no active Pokemon, opponent wins.
    if (player.active.cards.length === 0) {
      store.log(state, `${player.name} has no active Pokemon.`);
      points[i === 0 ? 1 : 0]++;
    }
    // Player has no Prize cards left, player wins.
    if (player.prizes.every(p => p.cards.length === 0)) {
      store.log(state, `${player.name} has no more Prize cards left.`);
      points[i]++;
    }
  }

  if (points[0] + points[1] === 0) {
    if (onComplete) {
      onComplete();
    }
    return state;
  }

  let winner = GameWinner.DRAW;
  if (points[0] > points[1]) {
    winner = GameWinner.PLAYER_1;
  } else if (points[1] > points[0]) {
    winner = GameWinner.PLAYER_2;
  }

  state = endGame(store, state, winner, onComplete);
  return state;
}

function handlePrompts(
  store: StoreLike,
  state: State,
  prompts: (ChoosePrizePrompt | ChoosePokemonPrompt)[],
  onComplete: () => void
): State {
  const prompt = prompts.shift();
  if (prompt === undefined) {
    onComplete();
    return state;
  }

  const player = state.players.find(p => p.id === prompt.playerId);
  if (player === undefined) {
    throw new GameError(GameMessage.ILLEGAL_ACTION);
  }

  return store.prompt(state, prompt, (result) => {
    if (prompt instanceof ChoosePrizePrompt) {
      const prizes: CardList[] = result;
      prizes.forEach(prize => prize.moveTo(player.hand));
      handlePrompts(store, state, prompts, onComplete);
    } else if (prompt instanceof ChoosePokemonPrompt) {
      const selectedPokemon = result as PokemonCardList[];
      if (selectedPokemon.length !== 1) {
        throw new GameError(GameMessage.ILLEGAL_ACTION);
      }
      const benchIndex = player.bench.indexOf(selectedPokemon[0]);
      if (benchIndex === -1 || player.active.cards.length > 0) {
        throw new GameError(GameMessage.ILLEGAL_ACTION);
      }
      const temp = player.active;
      player.active = player.bench[benchIndex];
      player.bench[benchIndex] = temp;
      handlePrompts(store, state, prompts, onComplete);
    }
  });
}

function* executeCheckState(next: Function, store: StoreLike, state: State,
  onComplete?: () => void): IterableIterator<State> {

  const prizesToTake: [number, number] = [0, 0];

  const pokemonsToDiscard = findKoPokemons(store, state);
  for (const item of pokemonsToDiscard) {
    const player = state.players[item.playerNum];
    const knockOutEffect = new KnockOutEffect(player, item.cardList);
    state = store.reduceEffect(state, knockOutEffect);

    yield store.waitPrompt(state, () => {
      next();
    })

    if (knockOutEffect.preventDefault === false) {
      const opponentNum = item.playerNum === 0 ? 1 : 0
      prizesToTake[opponentNum] += knockOutEffect.prizeCount;
    }
  }

  const prompts: (ChoosePrizePrompt | ChoosePokemonPrompt)[] = [
    ...choosePrizeCards(state, prizesToTake),
    ...chooseActivePokemons(state)
  ];

  const completed: [boolean, boolean] = [false, false];
  for (let i = 0; i < state.players.length; i++) {
    const player = state.players[i];
    const playerPrompts = prompts.filter(p => p.playerId === player.id);
    state = handlePrompts(store, state, playerPrompts, () => {
      completed[i] = true;
      if (completed.every(c => c)) {
        checkWinner(store, state, onComplete);
      }
    });
  }

  return state;
}

export function checkState(store: StoreLike, state: State, onComplete?: () => void): State {
  if (state.phase !== GamePhase.PLAYER_TURN && state.phase !== GamePhase.BETWEEN_TURNS) {
    if (onComplete !== undefined) {
      onComplete();
    }
    return state;
  }

  let generator: IterableIterator<State>;
  generator = executeCheckState(() => generator.next(), store, state, onComplete);
  return generator.next().value;
}


export function checkStateReducer(store: StoreLike, state: State, effect: Effect): State {
  if (effect instanceof KnockOutEffect) {
    const card = effect.target.getPokemonCard();
    if (card !== undefined) {
      store.log(state, `${card.name} is KO.`);
      effect.target.moveTo(effect.player.discard);
      effect.target.clearEffects();
    }
  }

  return state;
}