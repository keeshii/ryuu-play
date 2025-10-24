import { MoveDamagePrompt, MoveDamagePromptType, MoveDamageOptions, DamageTransfer, DamageMap } from './move-damage-prompt';
import { GameMessage } from '../../game-message';
import { State } from '../state/state';
import { Player } from '../state/player';
import { PlayerType, SlotType } from '../actions/play-card-action';
import { GameError } from '../../game-error';
import { PokemonSlot } from '../state/pokemon-slot';

describe('MoveDamagePrompt', () => {
  let playerId: number;
  let state: State;
  let player: Player;
  let slots: SlotType[];
  let maxAllowedDamage: DamageMap[];

  beforeEach(() => {
    playerId = 1;
    state = new State();
    player = new Player();
    player.id = playerId;
    state.players = [player];
    player.bench = [new PokemonSlot()];
    slots = [SlotType.ACTIVE, SlotType.BENCH];
    maxAllowedDamage = [
      { target: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 }, damage: 50 },
      { target: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 }, damage: 30 }
    ];
  });

  it('should initialize with correct type and message', () => {
    const message = GameMessage.CHOOSE_CARD_TO_HAND;
    const prompt = new MoveDamagePrompt(playerId, message, PlayerType.BOTTOM_PLAYER, slots, maxAllowedDamage);
    
    expect(prompt.type).toBe(MoveDamagePromptType);
    expect(prompt.playerId).toBe(playerId);
    expect(prompt.message).toBe(message);
    expect(prompt.playerType).toBe(PlayerType.BOTTOM_PLAYER);
    expect(prompt.slots).toBe(slots);
    expect(prompt.maxAllowedDamage).toBe(maxAllowedDamage);
    expect(prompt.result).toBeUndefined();
  });

  it('should use default options when none provided', () => {
    const prompt = new MoveDamagePrompt(playerId, GameMessage.CHOOSE_CARD_TO_HAND, PlayerType.BOTTOM_PLAYER, slots, maxAllowedDamage);
    
    expect(prompt.options).toEqual({
      allowCancel: true,
      min: 0,
      max: undefined,
      blockedFrom: [],
      blockedTo: []
    });
  });

  it('should override default options with provided values', () => {
    const options: Partial<MoveDamageOptions> = {
      allowCancel: false,
      min: 1,
      max: 2,
      blockedFrom: [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 1 }],
      blockedTo: [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 2 }]
    };

    const prompt = new MoveDamagePrompt(playerId, GameMessage.CHOOSE_CARD_TO_HAND, PlayerType.BOTTOM_PLAYER, slots, maxAllowedDamage, options);
    
    expect(prompt.options).toEqual({
      allowCancel: false,
      min: 1,
      max: 2,
      blockedFrom: [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 1 }],
      blockedTo: [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 2 }]
    });
  });

  describe('decode', () => {
    let prompt: MoveDamagePrompt;

    beforeEach(() => {
      prompt = new MoveDamagePrompt(playerId, GameMessage.CHOOSE_CARD_TO_HAND, PlayerType.BOTTOM_PLAYER, slots, maxAllowedDamage);
    });

    it('should decode valid damage transfers', () => {
      const transfers: DamageTransfer[] = [{
        from: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 },
        to: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 }
      }];

      expect(prompt.decode(transfers, state)).toEqual(transfers);
    });

    it('should return null when cancelled', () => {
      expect(prompt.decode(null, state)).toBeNull();
    });

    it('should throw error when player not found', () => {
      state.players = [];
      const transfers: DamageTransfer[] = [{
        from: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 },
        to: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 }
      }];

      expect(() => prompt.decode(transfers, state)).toThrow(
        new GameError(GameMessage.INVALID_PROMPT_RESULT)
      );
    });
  });

  describe('validate', () => {
    let prompt: MoveDamagePrompt;
    let validTransfer: DamageTransfer;

    beforeEach(() => {
      prompt = new MoveDamagePrompt(playerId, GameMessage.CHOOSE_CARD_TO_HAND, PlayerType.BOTTOM_PLAYER, slots, maxAllowedDamage);
      validTransfer = {
        from: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 },
        to: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 }
      };
    });

    it('should validate when meeting min/max requirements', () => {
      const options: Partial<MoveDamageOptions> = { min: 1, max: 2 };
      prompt = new MoveDamagePrompt(playerId, GameMessage.CHOOSE_CARD_TO_HAND, PlayerType.BOTTOM_PLAYER, slots, maxAllowedDamage, options);
      
      expect(prompt.validate([validTransfer], state)).toBe(true);
      expect(prompt.validate([validTransfer, validTransfer, validTransfer], state)).toBe(false);
      expect(prompt.validate([], state)).toBe(false);
    });

    it('should validate player type constraints', () => {
      prompt = new MoveDamagePrompt(playerId, GameMessage.CHOOSE_CARD_TO_HAND, PlayerType.TOP_PLAYER, slots, maxAllowedDamage);
      const invalidTransfer = {
        from: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 },
        to: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 }
      };
      
      expect(prompt.validate([invalidTransfer], state)).toBe(false);
    });

    it('should validate slot constraints', () => {
      prompt = new MoveDamagePrompt(playerId, GameMessage.CHOOSE_CARD_TO_HAND, PlayerType.BOTTOM_PLAYER, [SlotType.ACTIVE], maxAllowedDamage);
      const invalidTransfer = {
        from: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 },
        to: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 }
      };
      
      expect(prompt.validate([invalidTransfer], state)).toBe(false);
    });

    it('should validate blocked targets', () => {
      const options: Partial<MoveDamageOptions> = {
        blockedFrom: [validTransfer.from],
        blockedTo: []
      };
      prompt = new MoveDamagePrompt(playerId, GameMessage.CHOOSE_CARD_TO_HAND, PlayerType.BOTTOM_PLAYER, slots, maxAllowedDamage, options);
      
      expect(prompt.validate([validTransfer], state)).toBe(false);
    });

    it('should validate when cancelable', () => {
      expect(prompt.validate(null, state)).toBe(true);
    });

    it('should not validate null when not cancelable', () => {
      const options: Partial<MoveDamageOptions> = { allowCancel: false };
      prompt = new MoveDamagePrompt(playerId, GameMessage.CHOOSE_CARD_TO_HAND, PlayerType.BOTTOM_PLAYER, slots, maxAllowedDamage, options);
      
      expect(prompt.validate(null, state)).toBe(false);
    });
  });

});