import { SelectPrompt, SelectOptions } from './select-prompt';
import { GameMessage } from '../../game-message';
import { State } from '../state/state';

describe('SelectPrompt', () => {
  let playerId: number;
  let state: State;
  let values: string[];

  beforeEach(() => {
    playerId = 1;
    state = new State();
    values = ['Option 1', 'Option 2', 'Option 3'];
  });

  it('should initialize with correct type and message', () => {
    const message = GameMessage.CHOOSE_NEW_ACTIVE_POKEMON;
    const prompt = new SelectPrompt(playerId, message, values);
    
    expect(prompt.type).toBe('Select');
    expect(prompt.playerId).toBe(playerId);
    expect(prompt.message).toBe(message);
    expect(prompt.values).toEqual(values);
    expect(prompt.result).toBeUndefined();
  });

  it('should use default options when none provided', () => {
    const prompt = new SelectPrompt(playerId, GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, values);
    
    expect(prompt.options).toEqual({
      allowCancel: true,
      defaultValue: 0
    });
  });

  it('should override default options with provided values', () => {
    const options: Partial<SelectOptions> = {
      allowCancel: false,
      defaultValue: 2
    };
    const prompt = new SelectPrompt(playerId, GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, values, options);
    
    expect(prompt.options).toEqual({
      allowCancel: false,
      defaultValue: 2
    });
  });

  it('should partially override default options', () => {
    const options: Partial<SelectOptions> = {
      allowCancel: false
    };
    const prompt = new SelectPrompt(playerId, GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, values, options);
    
    expect(prompt.options).toEqual({
      allowCancel: false,
      defaultValue: 0
    });
  });

  describe('decode', () => {
    let prompt: SelectPrompt;

    beforeEach(() => {
      prompt = new SelectPrompt(playerId, GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, values);
    });

    it('should decode valid number index', () => {
      expect(prompt.decode(1, state)).toBe(1);
    });
  });

  describe('validate', () => {
    it('should validate index within range when cancelable', () => {
      const prompt = new SelectPrompt(playerId, GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, values);
      
      expect(prompt.validate(0, state)).toBe(true);
      expect(prompt.validate(1, state)).toBe(true);
      expect(prompt.validate(2, state)).toBe(true);
      expect(prompt.validate(null, state)).toBe(true);
    });
  });

});