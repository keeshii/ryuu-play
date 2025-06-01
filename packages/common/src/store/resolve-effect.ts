import { GameError } from '../game-error';
import { GameMessage } from '../game-message';
import { TrainerType } from './card/card-types';
import { Effect } from './effects/effect';
import { TrainerEffect } from './effects/play-card-effects';
import { State } from './state/state';
import { StoreLike } from './store-like';
import { PlayerType, SlotType } from './actions/play-card-action';
import { Card } from './card/card';
import { ChooseCardsOptions, ChooseCardsPrompt, FilterType } from './prompts/choose-cards-prompt';
import { ChoosePokemonOptions, ChoosePokemonPrompt } from './prompts/choose-pokemon-prompt';
import { CoinFlipPrompt } from './prompts/coin-flip-prompt';
import { ShuffleDeckPrompt } from './prompts/shuffle-prompt';
import { Require } from './requirement';
import { StateUtils } from './state-utils';
import { CardList } from './state/card-list';
import { Player } from './state/player';
import { PokemonCardList } from './state/pokemon-card-list';
import { getValidPokemonTargets, SelectPokemonArgs } from './target-utils';

// SelectArgs defines the criteria for selecting cards from a zone.
type SelectCardArgs = {atLeast?: number, atMost?: number, like?: FilterType}

// PlayerEffect represents an effect that has a controller, such as TrainerEffect.
type PlayerEffect = {
  player: Player;
}

// A sentinel value that can be thrown to cancel an action.
const ActionCanceled = {};

// The most important function in this package.
// It resolves the effect of a card, waiting for all prompts to resolve before moving the card to the appropriate zone.
export function resolveEffect(store: StoreLike, state: State, effect: Effect, fail: (message?: string) => void = throwCantPlay): State {
  if (effect instanceof TrainerEffect) {
    const source = effect.trainerCard;
    let generator: Generator<State, State> = function*(){throw new Error();}();
    const next = () => generator.next();
    const act = new Resolver(effect, state, source, store, next, fail);
    generator = function*() {
      try {
        yield* source.onPlay(act);
      } catch (error) {
        if (error === ActionCanceled) {
          return state;
        } else {
          throw error;
        }
      }

      if (effect.player.hand.cards.includes(effect.trainerCard)) {
        const isSupporter = effect.trainerCard.trainerType === TrainerType.SUPPORTER;
        const target = isSupporter ? effect.player.supporter : effect.player.discard;
        effect.player.hand.moveCardTo(effect.trainerCard, target);
      }
      return state;
    }();
    return generator.next().value;
  }
  return state;
}

function throwCantPlay(message?: string) {
  throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
}

export class Resolver {
  constructor(
    public readonly effect: PlayerEffect,
    public readonly state: State,
    public readonly effectSource: Card,
    public readonly store: StoreLike,
    public readonly next: Function,
    public readonly fail: (message?: string) => void,
  ) {
    this.require = new Require({
      activePlayer: this.state.players[0],
      state: this.state,
      effectSource: this.effectSource,
      fail: fail,
    });
  }

  // Track whether the operation has had any side effects that would prevent it from being rolled back,
  // such as revealing hidden information, flipping coins, or moving cards.
  public allowCancel = true;

  public readonly require: Require;

  private readonly excluded: Card[] = [this.effectSource];

  public readonly player = new ResolveForPlayer(this, this.effect.player);
  
  public get opponent() {
    return new ResolveForPlayer(this, StateUtils.getOpponent(this.state, this.effect.player));
  }

  public *choosesAndMoves(player: Player, from: CardList, to: CardList, message: GameMessage, query?: FilterType, args?: Partial<ChooseCardsOptions>): Generator<State, State> {
    query = query || {};
    const choices = from.filter(query).filter(card => !this.excluded.includes(card));
    const min = args?.min || 1;
    if (choices.length < min) {
      throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    }

    const choiceList = new CardList();
    choiceList.cards = choices;

    let chosenCards: Card[] = [];
    yield this.store.prompt(
      this.state,
      new ChooseCardsPrompt(
        player.id,
        message,  
        choiceList,
        query,
        { ...args, allowCancel: this.allowCancel },
      ),
      selected => {
        chosenCards = selected || [];
        this.allowCancel = false;
        this.excluded.push(...chosenCards); // prevent choosing the same card again
        this.next();
      }
    );

    // Operation canceled by the user
    if (chosenCards.length === 0) {
      throw ActionCanceled;
    }

    from.moveCardsTo(chosenCards, to);
    return this.state;
  }
}

class ResolveForPlayer {
  constructor(
    public readonly act: Resolver,
    public readonly player: Player,
  ) {}

  public draws(count: number): State {
    this.player.deck.moveTo(this.player.hand, count);
    return this.act.state;
  }

  public drawsUntil(count: number): State {
    const cardsInHand = this.player.hand.cards.filter(card => card !== this.act.effectSource);
    const cardsToDraw = Math.max(0, count - cardsInHand.length);
    this.player.deck.moveTo(this.player.hand, cardsToDraw);
    return this.act.state;
  }

  public discards(count: number, like?: Partial<Card>): ResolveMoveToZone;
  public discards({atLeast, atMost, like} : SelectCardArgs): ResolveMoveToZone;
  public discards(countOrArgs: number | SelectCardArgs, like?: Partial<Card>): ResolveMoveToZone {
    if (typeof countOrArgs === 'number') {
      return new ResolveMoveToZone(this.act, this.player, SlotType.DISCARD, this.player.discard, { atLeast: countOrArgs, atMost: countOrArgs, like });
    }
    return new ResolveMoveToZone(this.act, this.player, SlotType.DISCARD, this.player.discard, countOrArgs);
  }

  public movesToHand(count: number, like?: Partial<Card>): ResolveMoveToZone;
  public movesToHand({atLeast, atMost, like} : SelectCardArgs): ResolveMoveToZone;
  public movesToHand(countOrArgs: number | SelectCardArgs, like?: Partial<Card>): ResolveMoveToZone {
    if (typeof countOrArgs === 'number') {
      return new ResolveMoveToZone(this.act, this.player, SlotType.HAND, this.player.hand, { atLeast: countOrArgs, atMost: countOrArgs, like });
    }
    return new ResolveMoveToZone(this.act, this.player, SlotType.HAND, this.player.hand, countOrArgs);
  }

  public *flipsCoin(): Generator<State, boolean> {
    let coinResult: boolean = false;
    yield this.act.store.prompt(
      this.act.state,
      new CoinFlipPrompt(this.player.id, GameMessage.COIN_FLIP),
      result => {
        this.act.allowCancel = false;
        coinResult = result;
        this.act.next();
      }
    );
    return coinResult;
  }

  public choosesPokemon(targetRequirement: SelectPokemonArgs, options: Partial<ChoosePokemonOptions> = {}) {
    return new ResolvePokemonCardList(
      this.act,
      this.player,
      targetRequirement
    );
  }
}

class ResolveMoveToZone {
  constructor(
    public readonly act: Resolver,
    public readonly player: Player,
    public readonly slotType: SlotType, 
    public readonly to: CardList,
    public readonly args: SelectCardArgs,
  ) {}

  public *fromHand(): Generator<State, State> {
    const gameMessage = GameMessage.CHOOSE_CARD_TO_DISCARD;
    return yield* this.act.choosesAndMoves(this.player, this.player.hand, this.to, gameMessage, this.args.like, {min: this.args.atLeast, max: this.args.atMost});
  }

  public *fromDeck(): Generator<State, State> {
    const gameMessage = GameMessage.CHOOSE_CARD_TO_HAND;
    const newState = yield* this.act.choosesAndMoves(this.player, this.player.deck, this.to, gameMessage, this.args.like, {min: this.args.atLeast, max: this.args.atMost});
    return this.act.store.prompt(newState, new ShuffleDeckPrompt(this.player.id), order => {
      this.player.deck.applyOrder(order);
    });
  }

  public *fromDiscard(): Generator<State, State> {
    const gameMessage = GameMessage.CHOOSE_CARD_TO_HAND;
    return yield* this.act.choosesAndMoves(this.player, this.player.discard, this.to, gameMessage, this.args.like, {min: this.args.atLeast, max: this.args.atMost});
  }
}

class ResolvePokemonCardList {
  constructor(
    public readonly act: Resolver,
    public readonly player: Player,
    public readonly pokemonRequirements: SelectPokemonArgs,
  ) {}

  public andDiscards(count: number, like?: Partial<Card>): Generator<State, State>;
  public andDiscards({atLeast, atMost, like} : SelectCardArgs): Generator<State, State>;
  public *andDiscards(countOrArgs: number | SelectCardArgs, like: FilterType = {}): Generator<State, State> {
    let atLeast: number | undefined;
    let atMost: number | undefined;
    if (typeof countOrArgs === 'number') {
      atLeast = countOrArgs;
      atMost = countOrArgs;
    } else {
      ({ atLeast, atMost, like = {} } = countOrArgs);
    }
    const { blocked } = getValidPokemonTargets(this.act.state, this.player, this.pokemonRequirements);
    let chosenPokemon: PokemonCardList[] = [];
    yield this.act.store.prompt(
      this.act.state,
      new ChoosePokemonPrompt(
        this.player.id,
        GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
        this.pokemonRequirements.playerType || PlayerType.ANY,
        this.pokemonRequirements.slots || [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: this.act.allowCancel, blocked }
      ),
      selected => {
        this.act.allowCancel = false;
        chosenPokemon = selected || [];
        this.act.next();
      }
    );

    if (chosenPokemon.length === 0) {
      throw ActionCanceled;
    }

    const opponent = StateUtils.getOpponent(this.act.state, this.player);
    let chosenPokemonController = opponent;
    this.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
      if(cardList === chosenPokemon[0]) {
        chosenPokemonController = this.player;
      }
    });

    let cards: Card[] = [];
    yield this.act.store.prompt(
      this.act.state,
      new ChooseCardsPrompt(
        this.player.id,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        chosenPokemon[0],
        like,
        { min: atLeast, max: atMost, allowCancel: false }
      ),
      selected => {
        cards = selected;
        this.act.next();
      }
    );

    chosenPokemon[0].moveCardsTo(cards, chosenPokemonController.discard);
    return this.act.state;
  }
}

