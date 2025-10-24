import { StateSerializer } from './state-serializer';
import { State } from '../store/state/state';
import { Card } from '../store/card/card';
import { SuperType } from '../store/card/card-types';
import { GamePhase, GameWinner } from '../store/state/state';
import { Rules } from '../store/state/rules';
import { Player } from '../store/state/player';


class TestCard extends Card {
  id = 0;
  set = 'TEST';
  superType = SuperType.POKEMON;
  fullName = 'Test Card';
  name = 'Test';
}

describe('StateSerializer', () => {
  let serializer: StateSerializer;
  let state: State;
  let testCard: TestCard;

  beforeEach(() => {
    serializer = new StateSerializer();
    state = new State();
    testCard = new TestCard();
    StateSerializer.setKnownCards([testCard]);
  });

  describe('serialize', () => {
    it('should serialize an empty state', () => {
      const serialized = serializer.serialize(state);
      expect(typeof serialized).toBe('string');
      
      const deserialized = serializer.deserialize(serialized);
      expect(deserialized).toBeTruthy();
      expect(deserialized.phase).toBe(GamePhase.WAITING_FOR_PLAYERS);
      expect(deserialized.winner).toBe(GameWinner.NONE);
      expect(deserialized.players).toEqual([]);
    });

    it('should serialize state with players', () => {
      const player = new Player();
      player.id = 1;
      state.players.push(player);

      const serialized = serializer.serialize(state);
      const deserialized = serializer.deserialize(serialized);

      expect(deserialized.players.length).toBe(1);
      expect(deserialized.players[0].id).toBe(1);
    });

    it('should serialize state with rules', () => {
      state.rules = new Rules();
      state.rules.formatName = 'TestFormat';

      const serialized = serializer.serialize(state);
      const deserialized = serializer.deserialize(serialized);

      expect(deserialized.rules.formatName).toBe('TestFormat');
    });

    it('should handle circular references', () => {
      const player = new Player();
      player.id = 1;
      state.players.push(player);
      // Create circular reference
      (state as any).playerRef = player;

      const serialized = serializer.serialize(state);
      const deserialized = serializer.deserialize(serialized);

      expect(deserialized.players[0]).toBe((deserialized as any).playerRef);
    });
  });

  describe('deserialize', () => {
    it('should throw error for unknown type', () => {
      const invalidState = JSON.stringify({
        _type: 'UnknownType',
        value: 'test'
      });

      expect(() => serializer.deserialize(invalidState))
        .toThrow();
    });

    it('should preserve primitive values', () => {
      state.turn = 5;
      state.activePlayer = 1;

      const serialized = serializer.serialize(state);
      const deserialized = serializer.deserialize(serialized);

      expect(deserialized.turn).toBe(5);
      expect(deserialized.activePlayer).toBe(1);
    });

    it('should preserve arrays', () => {
      state.cardNames = ['Test Card'];

      const serialized = serializer.serialize(state);
      const deserialized = serializer.deserialize(serialized);

      expect(deserialized.cardNames).toEqual(['Test Card']);
    });

    it('should handle nested objects', () => {
      const player = new Player();
      player.id = 1;
      state.players.push(player);
      state.cardNames = ['Test Card'];

      player.deck.cards = [testCard];

      const serialized = serializer.serialize(state);
      const deserialized = serializer.deserialize(serialized);

      expect(deserialized.players[0].deck.cards.length).toBe(1);
      expect(deserialized.players[0].deck.cards[0].name).toBe('Test');
    });
  });
});