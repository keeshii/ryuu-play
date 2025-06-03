import { GameMessage } from './game-message';
import { GamePhase, Player, Prompt, Require, resolveEffect, ResolvePromptAction, State, Store, SuperType, TrainerCard, TrainerEffect } from './store';
import { Card } from './store/card/card';
import { match } from './utils';

function throwError(message?: string): never {
  throw new Error(message);
}

function makeTestCards(count: number): Card[] {
  const cards: Card[] = Array(count);
  for (let i = 0; i < count; i++) {
    cards[i] = new TestCard(i);
  }
  return cards;
}

// A card with no types or abilities, used in tests.
class TestCard extends Card {
  constructor(
    public id: any,
  ) {
    super();
  }
  
  public set: string = 'TEST';
  public superType: SuperType = SuperType.NONE;

  get fullName(): string {
    return `Test Card ${this.id}`;
  }

  get name(): string {
    return `Test Card ${this.id}`;
  }
}

const nullStoreHandler = {
  onStateChange: (state: State) => {}
};

class TestHarness {
  public store: Store;
  public state: State;
  public require: Require;
  
  constructor({
    player = {},
    opponent = {}
  } : {player?: Partial<Player>, opponent?: Partial<Player>} = {}) {
    this.store = new Store(nullStoreHandler);
    this.state = this.store.state;
    this.state.phase = GamePhase.PLAYER_TURN;
    
    const players = [Object.assign(new Player(), player), Object.assign(new Player(), opponent)];
    if (players[0].id === players[1].id) {
      players[1].id = players[0].id + 1; // Ensure different IDs
    }
    this.state.players = players;
    
    this.require = new Require({
      activePlayer: this.state.players[0],
      state: this.state,
      fail: throwError,
    });
  }

  public get players() {
    return this.state.players.map(player => new TestHarnessPlayer(this, player));
  }
}

class TestHarnessPlayer {
  constructor(
    private readonly harness: TestHarness,
    public readonly player: Player
  ) {}

  public playsTrainer(card: TrainerCard): State {
    const effect = new TrainerEffect(this.player, card);
    return resolveEffect(this.harness.store, this.harness.state, effect, throwError);
  }

  public getsPrompt({withText, withOptions, withCards} : {
    withText?: GameMessage,
    withOptions?: any,
    withCards?: Card[],
  }) {
    const prompts = this.harness.state.prompts;
    const prompt = prompts.find(p => p.result === undefined);
    if (prompt === undefined) {
      throw new Error(`Expected prompt with message "${withText}" but no unresolved prompts were found.`);
    }
    const actualMessage = (prompt as any).message;
    if (withText !== actualMessage) {
      throw new Error(`Expected prompt with message "${withText}" but found "${actualMessage}".`);
    }
    const actualOptions = (prompt as any).options;
    if (withOptions !== undefined && !match(actualOptions, withOptions)) {
      throw new Error(`Expected prompt with options matching ${JSON.stringify(withOptions)} but found ${JSON.stringify(actualOptions)}.`);
    }
    if (prompt.playerId !== this.player.id) {
      throw new Error(`Expected prompt for player ${this.player.id} but found for player ${prompt.playerId}.`);
    }
    if (withCards !== undefined) {
      const actualCards : Card[] = (prompt as any).cards.cards;
      const choicesMatch = actualCards.length === withCards.length &&
        actualCards.every((card, index) => card === withCards[index]);
      if (!choicesMatch) {
        throw new Error(`Expected prompt with choices matching ${JSON.stringify(withCards.map(v => v.fullName))} but found ${JSON.stringify(actualCards.map(v => v.fullName))}.`);
      }
    }
    return new TestHarnessPrompt(this.harness, prompt);
  }

  public flipsCoinAndGetsHeads() {
    return this.flipsCoinAndGets(true);
  }

  public flipsCoinAndGetsTails() {
    return this.flipsCoinAndGets(false);
  }

  private flipsCoinAndGets(heads: boolean): State {
    const prompts = this.harness.state.prompts;
    const prompt = prompts.find(p => p.result === undefined);
    if (prompt === undefined) {
      throw new Error('Expected coin flip prompt but no unresolved prompts were found.');
    }
    if (prompt.type !== 'Coin flip') {
      throw new Error(`Expected coin flip prompt but found prompt of type "${prompt.type}".`);
    }
    const coinFlip = this.harness.store.dispatch(new ResolvePromptAction(prompt.id, heads));
    if (coinFlip === undefined) {
      throw new Error('Expected coin flip result but got undefined.');
    }
    return coinFlip;
  }

  // Asserts that there's a pending ShuffleDeck prompt and resolves it by reversing the order of the cards.
  public shufflesDeck(): State {
    const prompts = this.harness.state.prompts;
    const prompt = prompts.find(p => p.result === undefined);
    if (prompt === undefined) {
      throw new Error('Expected shuffle deck prompt but no unresolved prompts were found.');
    }
    if (prompt.type !== 'Shuffle deck') {
      throw new Error(`Expected shuffle deck prompt but found prompt of type "${prompt.type}".`);
    }

    const deckSize = this.player.deck.cards.length;
    const shuffleResult = Array.from({ length: deckSize }, (_, i) => deckSize-i-1);
    const coinFlip = this.harness.store.dispatch(new ResolvePromptAction(prompt.id, shuffleResult));
    if (coinFlip === undefined) {
      throw new Error('Expected coin flip result but got undefined.');
    }
    return coinFlip;
  }
}

class TestHarnessPrompt<T> {
  constructor(
    private readonly harness: TestHarness,
    private readonly prompt: Prompt<T>,
  ) {}

  public andChooses(choice: T): State {
    return this.harness.store.dispatch(new ResolvePromptAction(this.prompt.id, choice));
  }
}

export const TestUtils = {
  TestCard,
  TestHarness,
  makeTestCards,
};