import { Card } from './card/card';
import { CardList } from './state/card-list';
import { Player } from './state/player';
import { StateUtils } from './state-utils';
import { State } from './state/state';
import { match } from '../utils/utils';
import { PokemonCard } from './card/pokemon-card';

export class Require {

  public readonly activePlayer: Player;
  public readonly state: State;
  public readonly effectSource?: Card;
  public readonly fail: (message?: string) => void;

  constructor({activePlayer, state, effectSource, fail}: {
    activePlayer: Player,
    state: State,
    effectSource?: Card,
    fail: (message?: string) => void,
  }) {
    this.activePlayer = activePlayer;
    this.state = state;
    this.effectSource = effectSource;
    this.fail = fail;
  }

  get player() {
    return new RequirePlayer(this, this.activePlayer, 'player');
  }

  get opponent() {
    return new RequirePlayer(this, StateUtils.getOpponent(this.state, this.activePlayer), 'opponent');
  }

  public check(condition: boolean, message?: string) {
    if(!condition) {
      this.fail(message);
    }
  }

  public noPrompts() {
    const prompts = this.state.prompts;
    const prompt = prompts.find(p => p.result === undefined);
    this.check(prompt === undefined, `Expected no unresolved prompts but found: ${prompt?.type}`);
  }
}

class RequireZone {
  constructor(
    private readonly require: Require,
    public readonly zone: CardList,
    private name: string,
  ) {}

  public isNotEmpty() {
    this.require.check(this.zone.cards.length > 0, `${this.name} unexpectedly empty.`);
  }

  public isEmpty() {
    this.require.check(this.zone.cards.length === 0, `${this.name} unexpectedly not empty.`);
  }

  public doesNotContain(card: Card): void {
    if (this.zone.cards.includes(card)) {
      this.require.fail(`${this.name} unexpectedly contains card: ${card.name}`);
    }
  }

  public isInOrder(order: Card[]): void {
    if (this.zone.cards.length !== order.length) {
      this.require.fail(`${this.name} has a different number of cards than expected. Expected ${order.length}, found ${this.zone.cards.length}.`);
    }
    for (let i = 0; i < order.length; i++) {
      const card = order[i];
      if (this.zone.cards[i] !== card) {
        this.require.fail(`${this.name} has card ${this.zone.cards[i].name} at position ${i}, expected ${card.name}.`);
      }
    }
  }

  public contains(cards: Card[]): void;
  public contains(count: number, like?: Partial<Card>): void;
  public contains({atLeast, atMost, like}: {atLeast?: number, atMost?: number, like?: Partial<Card>}): void;
  public contains(arg0: Card[] | number | {atLeast?: number, atMost?: number, like?: Partial<Card>}, like?: Partial<Card>): void {
    if (typeof arg0 === 'number') {
      const atLeast = arg0;
      const atMost = arg0;
      return this.contains({ atLeast, atMost, like });
    }
    if (Array.isArray(arg0)) {
      const cards = arg0;
      if (!this.zone.cards.every(val => cards.includes(val))) {
        this.require.fail(`${this.name} does not contain all required cards: ${cards.map(card => card.name).join(', ')}`);
      }
      return;
    }
    const { atLeast, atMost } = arg0;
    const cards = like ? this.zone.filter(like) : this.zone.cards;
    const matches = cards.filter(card => card != this.require.effectSource);
    if (atLeast !== undefined && matches.length < atLeast) {
      this.require.fail(`${this.name} does not contain enough cards matching the criteria. Expected at least ${atLeast}, found ${matches.length}.`);
    }
    if (atMost !== undefined && matches.length > atMost) {
      this.require.fail(`${this.name} contains too many cards matching the criteria. Expected at most ${atMost}, found ${matches.length}.`);
    }
    if (atLeast === undefined && atMost === undefined && matches.length === 0) {
      this.require.fail(`${this.name} does not contain any cards matching the criteria.`);
    }
  }
}
class RequirePlayer {
  constructor(
    public readonly require: Require,
    public readonly player: Player,
    private name: string,
  ) {}

  public readonly hand = new RequireZone(this.require, this.player.hand, `${this.name}'s hand`);

  public readonly deck = new RequireZone(this.require, this.player.deck, `${this.name}'s deck`);

  public readonly discard = new RequireZone(this.require, this.player.discard, `${this.name}'s discard pile`);

  public readonly supporter = new RequireZone(this.require, this.player.supporter, `${this.name}'s supporter zone`);

  public readonly activeSpot = new RequireZone(this.require, this.player.active, `${this.name}'s active spot`); 

  public hasPokemon({ atLeast, atMost, like = {}, with: with_ = {}}: {
    atLeast?: number,
    atMost?: number,
    like?: Partial<PokemonCard>
    with?: Partial<Card>
  }) {
    const slots = [this.player.active, ...this.player.bench];
    const matchedSlots = slots.filter(
      pokemon => match(pokemon.getPokemonCard()!, like) && pokemon.cards.some(card => match(card, with_)));
    if (atLeast !== undefined && matchedSlots.length < atLeast) {
      this.require.fail(`${this.name} does not have enough Pokémon matching the criteria. Expected at least ${atLeast}, found ${matchedSlots.length}.`);
    }
    if (atMost !== undefined && matchedSlots.length > atMost) {
      this.require.fail(`${this.name} has too many Pokémon matching the criteria. Expected at most ${atMost}, found ${matchedSlots.length}.`);
    }
    if (atLeast === undefined && atMost === undefined && matchedSlots.length === 0) {
      this.require.fail(`${this.name} does not have any Pokémon matching the criteria.`);
    }
  }
}
