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
import { ShowCardsPrompt } from './prompts/show-cards-prompt';
import { match } from '../utils';

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
    const resolver = new Resolver(effect, state, source, store, next, fail);
    generator = function*() {
      try {
        yield* source.onPlay(resolver);
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

  public *choosesAndMoves(player: Player, from: CardList, to: CardList, message: GameMessage, query: FilterType = {}, args?: Partial<ChooseCardsOptions>): Generator<State, State> {
    const min = args?.min || 1;

    let choices: Card[] = from.cards;
    const blocked: number[] = [];

    if (from === player.deck) {
      // If we're selecting from the deck, we need to display every card in the deck, but block invalid choices.
      from.cards.forEach((card, index) => {
        if (!match(card, query)) {
          blocked.push(index);
        }
      });
    } else {
      // Otherwise, we only show the cards that match the query.
      choices = from.filter(query).filter(card => !this.excluded.includes(card));
      if (choices.length < min) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
    }

    const choiceList = new CardList();
    choiceList.cards = choices;

    // If we're looking at the deck or prizes, information has been gained.
    // This can't be cancelled.
    if (from === player.deck || player.prizes.includes(from)) {
      this.allowCancel = false;
    }

    let chosenCards: Card[] = [];
    yield this.store.prompt(
      this.state,
      new ChooseCardsPrompt(
        player.id,
        message,  
        choiceList,
        query,
        { ...args, allowCancel: this.allowCancel, blocked },
      ),
      selected => {
        chosenCards = selected || [];
        // prevent choosing the same card again in a subsequent prompt.
        // this is most relevant for cards that both discard and retrieve cards from the discard.
        this.excluded.push(...chosenCards);
        this.next();
      }
    );

    // Operation canceled by the user
    if (chosenCards.length === 0 && this.allowCancel) {
      throw ActionCanceled;
    }

    // Cards have moved zones, future prompts will not be able to cancel.
    this.allowCancel = false;

    // If moving from deck to hand and the search had conditions, reveal the chosen cards to the oppoenent.
    if (chosenCards.length > 0 && from === player.deck && to === player.hand && Object.keys(query).length > 0) {
      const opponent = StateUtils.getOpponent(this.state, player);
      yield this.store.prompt(
        this.state,
        new ShowCardsPrompt(
          opponent.id,
          GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
          chosenCards
        ),
        () => this.next()
      );
    }

    from.moveCardsTo(chosenCards, to);
    if (to === player.deck) {
      return this.store.prompt(this.state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
      });
    }
    return this.state;
  }
}

class ResolveForPlayer {
  constructor(
    public readonly resolver: Resolver,
    public readonly player: Player,
  ) {}

  public draws(count: number): State {
    this.player.deck.moveTo(this.player.hand, count);
    return this.resolver.state;
  }

  public drawsUntil(count: number): State {
    const cardsInHand = this.player.hand.cards.filter(card => card !== this.resolver.effectSource);
    const cardsToDraw = Math.max(0, count - cardsInHand.length);
    this.player.deck.moveTo(this.player.hand, cardsToDraw);
    return this.resolver.state;
  }

  public discards(count: number, like?: FilterType): ResolveMoveToZone;
  public discards({atLeast, atMost, like} : SelectCardArgs): ResolveMoveToZone;
  public discards(countOrArgs: number | SelectCardArgs, like?: FilterType): ResolveMoveToZone {
    if (typeof countOrArgs === 'number') {
      return new ResolveMoveToZone(this.resolver, this.player, this.player.discard, { atLeast: countOrArgs, atMost: countOrArgs, like });
    }
    return new ResolveMoveToZone(this.resolver, this.player, this.player.discard, countOrArgs);
  }

  public movesToHand(count: number, like?: FilterType): ResolveMoveToZone;
  public movesToHand({atLeast, atMost, like} : SelectCardArgs): ResolveMoveToZone;
  public movesToHand(countOrArgs: number | SelectCardArgs, like?: FilterType): ResolveMoveToZone {
    if (typeof countOrArgs === 'number') {
      return new ResolveMoveToZone(this.resolver, this.player, this.player.hand, { atLeast: countOrArgs, atMost: countOrArgs, like });
    }
    return new ResolveMoveToZone(this.resolver, this.player, this.player.hand, countOrArgs);
  }

  public shufflesIntoDeck(count: number, like?: FilterType): ResolveMoveToZone;
  public shufflesIntoDeck({atLeast, atMost, like} : SelectCardArgs): ResolveMoveToZone;
  public shufflesIntoDeck(countOrArgs: number | SelectCardArgs, like?: FilterType): ResolveMoveToZone {
    if (typeof countOrArgs === 'number') {
      return new ResolveMoveToZone(this.resolver, this.player, this.player.hand, { atLeast: countOrArgs, atMost: countOrArgs, like });
    }
    return new ResolveMoveToZone(this.resolver, this.player, this.player.hand, countOrArgs);
  }

  public shufflesHandIntoDeck(): void {
    this.player.hand.moveTo(this.player.deck);
  }

  public *flipsCoin(): Generator<State, boolean> {
    let coinResult: boolean = false;
    yield this.resolver.store.prompt(
      this.resolver.state,
      new CoinFlipPrompt(this.player.id, GameMessage.COIN_FLIP),
      result => {
        this.resolver.allowCancel = false;
        coinResult = result;
        this.resolver.next();
      }
    );
    return coinResult;
  }

  public choosesPokemon(targetRequirement: SelectPokemonArgs, options: Partial<ChoosePokemonOptions> = {}) {
    return new ResolvePokemonCardList(
      this.resolver,
      this.player,
      targetRequirement
    );
  }
}

class ResolveMoveToZone {
  constructor(
    public readonly resolver: Resolver,
    public readonly player: Player,
    public readonly to: CardList,
    public readonly args: SelectCardArgs,
  ) {}

  public *fromHand(): Generator<State, State> {
    const gameMessage = GameMessage.CHOOSE_CARD_TO_DISCARD;
    return yield* this.resolver.choosesAndMoves(this.player, this.player.hand, this.to, gameMessage, this.args.like, {min: this.args.atLeast, max: this.args.atMost});
  }

  public *fromDeck(): Generator<State, State> {
    const gameMessage = GameMessage.CHOOSE_CARD_TO_HAND;
    const newState = yield* this.resolver.choosesAndMoves(this.player, this.player.deck, this.to, gameMessage, this.args.like, {min: this.args.atLeast, max: this.args.atMost});
    return this.resolver.store.prompt(newState, new ShuffleDeckPrompt(this.player.id), order => {
      this.player.deck.applyOrder(order);
    });
  }

  public *fromDiscard(): Generator<State, State> {
    const gameMessage = GameMessage.CHOOSE_CARD_TO_HAND;
    return yield* this.resolver.choosesAndMoves(this.player, this.player.discard, this.to, gameMessage, this.args.like, {min: this.args.atLeast, max: this.args.atMost});
  }
}

class ResolvePokemonCardList {
  constructor(
    public readonly resolver: Resolver,
    public readonly player: Player,
    public readonly pokemonRequirements: SelectPokemonArgs,
  ) {}

  public andDiscards(count: number, like?: FilterType): Generator<State, State>;
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
    const { blocked } = getValidPokemonTargets(this.resolver.state, this.player, this.pokemonRequirements);
    let chosenPokemon: PokemonCardList[] = [];
    yield this.resolver.store.prompt(
      this.resolver.state,
      new ChoosePokemonPrompt(
        this.player.id,
        GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
        this.pokemonRequirements.playerType || PlayerType.ANY,
        this.pokemonRequirements.slots || [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: this.resolver.allowCancel, blocked }
      ),
      selected => {
        this.resolver.allowCancel = false;
        chosenPokemon = selected || [];
        this.resolver.next();
      }
    );

    if (chosenPokemon.length === 0) {
      throw ActionCanceled;
    }

    const opponent = StateUtils.getOpponent(this.resolver.state, this.player);
    let chosenPokemonController = opponent;
    this.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
      if(cardList === chosenPokemon[0]) {
        chosenPokemonController = this.player;
      }
    });

    let cards: Card[] = [];
    yield this.resolver.store.prompt(
      this.resolver.state,
      new ChooseCardsPrompt(
        this.player.id,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        chosenPokemon[0],
        like,
        { min: atLeast, max: atMost, allowCancel: false }
      ),
      selected => {
        cards = selected;
        this.resolver.next();
      }
    );

    chosenPokemon[0].moveCardsTo(cards, chosenPokemonController.discard);
    return this.resolver.state;
  }
}

