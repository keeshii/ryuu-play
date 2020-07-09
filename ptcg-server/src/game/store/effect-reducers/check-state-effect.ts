import { Effect } from "../effects/effect";
import { State, GamePhase } from "../state/state";
import { StoreLike } from "../store-like";
import { CheckStateEffect, CheckHpEffect, CheckPrizesCountEffect } from "../effects/check-effects";
import { PokemonCardList } from "../state/pokemon-card-list";
import { ChoosePokemonPrompt } from "../prompts/choose-pokemon-prompt";
import { GameMessage, GameError } from "../../game-error";
import { ChoosePrizePrompt } from "../prompts/choose-prize-prompt";
import {CardList} from "../state/card-list";

function discardKoPokemons(store: StoreLike, state: State): [number, number] {
  const prizesToTake: [number, number] = [0, 0];

  for (let i = 0; i < state.players.length; i++) {
    const player = state.players[i];
    const targets: PokemonCardList[] = player.bench.slice();
    targets.push(player.active);

    for (const target of targets) {
      const pokemonCard = target.getPokemonCard();
      if (pokemonCard !== undefined) {

        const checkHpEffect = new CheckHpEffect(player, target);
        store.reduceEffect(state, checkHpEffect);

        if (target.damage >= checkHpEffect.hp) {

          const checkPrizesCount = new CheckPrizesCountEffect(player, target);
          state = store.reduceEffect(state, checkPrizesCount);
          prizesToTake[i === 0 ? 1 : 0] += checkPrizesCount.count;

          store.log(state, `${pokemonCard.name} is KO.`);
          target.moveCardsTo(target.cards, player.discard);
          target.damage = 0;
          target.specialConditions = [];
        }
      }
    }
  }

  return prizesToTake;
}

function chooseActivePokemons(state: State): ChoosePokemonPrompt[] {
  const prompts: ChoosePokemonPrompt[] = [];

  for (const player of state.players) {
    const hasActive = player.active.cards.length > 0;
    const hasBenched = player.bench.some(bench => bench.cards.length > 0);
    if (!hasActive && hasBenched) {
      const choose = new ChoosePokemonPrompt(player.id, GameMessage.CHOOSE_NEW_ACTIVE_POKEMON);
      prompts.push(choose);
    }
  }

  return prompts;
}

function choosePrizeCards(state: State, prizesToTake: [number, number]): ChoosePrizePrompt[] {
  const prompts: ChoosePrizePrompt[] = [];

  for (let i = 0; i < state.players.length; i++) {
    const player = state.players[i];
    const prizeLeft = player.prizes.reduce((left, p) => left + p.cards.length, 0);

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

function handlePrompts(
  store: StoreLike, state: State,
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
      selectedPokemon[0].moveTo(player.active);
      const temp = player.active;
      player.active = player.bench[benchIndex];
      player.bench[benchIndex] = temp;
      handlePrompts(store, state, prompts, onComplete);
    }
  });
}

export function checkState(store: StoreLike, state: State, onComplete?: () => void): State {
  const prizesToTake: [number, number] = discardKoPokemons(store, state);
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
      if (completed.every(c => c) && onComplete) {
        onComplete();
      }
    });
  }

  return state;
}

export function checkStateReducer(store: StoreLike, state: State, effect: Effect): State {

  /* Perform complete state check (KO, no active, etc) */
  if (effect instanceof CheckStateEffect) {
    if (state.phase !== GamePhase.PLAYER_TURN && state.phase !== GamePhase.BETWEEN_TURNS) {
      return state;
    }
    if (state.players.length !== 2) {
      return state;
    }

    return checkState(store, state);
  }

  return state;
}
