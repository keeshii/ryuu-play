import { ShowCardsPrompt, ShowCardsOptions } from './show-cards-prompt';
import { GameMessage } from '../../game-message';
import { State } from '../state/state';
import { PokemonCard } from '../card/pokemon-card';

describe('ShowCardsPrompt', () => {
  let playerId: number;
  let state: State;
  let cards: PokemonCard[];

  class TestPokemonCard extends PokemonCard {
    public name = 'Test Pokemon';
    public set = 'TEST';
    public fullName = 'Test Pokemon';
    public id = 1;
    public attacks = [];
    public powers = [];
    public resistance = [];
    public tags = [];

    constructor() {
      super();
      this.hp = 100;
    }
  }

  beforeEach(() => {
    playerId = 1;
    state = new State();
    const card = new TestPokemonCard();
    cards = [card];
  });

  it('should initialize with correct type and message', () => {
    const message = GameMessage.CHOOSE_CARD_TO_HAND;
    const prompt = new ShowCardsPrompt(playerId, message, cards);
    
    expect(prompt.type).toBe('Show cards');
    expect(prompt.playerId).toBe(playerId);
    expect(prompt.message).toBe(message);
    expect(prompt.cards).toBe(cards);
    expect(prompt.result).toBeUndefined();
  });

  it('should use default options when none provided', () => {
    const prompt = new ShowCardsPrompt(playerId, GameMessage.CHOOSE_CARD_TO_HAND, cards);
    
    expect(prompt.options).toEqual({
      allowCancel: false
    });
  });

  it('should override default options with provided values', () => {
    const options: Partial<ShowCardsOptions> = {
      allowCancel: true
    };

    const prompt = new ShowCardsPrompt(playerId, GameMessage.CHOOSE_CARD_TO_HAND, cards, options);
    
    expect(prompt.options).toEqual({
      allowCancel: true
    });
  });

  describe('decode', () => {
    let prompt: ShowCardsPrompt;

    beforeEach(() => {
      prompt = new ShowCardsPrompt(playerId, GameMessage.CHOOSE_CARD_TO_HAND, cards);
    });

    it('should decode true as true', () => {
      expect(prompt.decode(true, state)).toBe(true);
    });
  });

  describe('validate', () => {
    it('should validate true when cancelable', () => {
      const options: Partial<ShowCardsOptions> = { allowCancel: true };
      const prompt = new ShowCardsPrompt(playerId, GameMessage.CHOOSE_CARD_TO_HAND, cards, options);
      
      expect(prompt.validate(true, state)).toBe(true);
      expect(prompt.validate(null, state)).toBe(true);
    });
  });

});