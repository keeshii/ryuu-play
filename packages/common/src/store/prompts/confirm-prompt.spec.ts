import { ConfirmPrompt } from './confirm-prompt';
import { GameMessage } from '../../game-message';
import { State } from '../state/state';

describe('ConfirmPrompt', () => {
  let playerId: number;
  let state: State;

  beforeEach(() => {
    playerId = 1;
    state = new State();
  });

  it('should initialize with correct type and message', () => {
    const message = GameMessage.CHOOSE_ENERGIES_TO_DISCARD;
    const prompt = new ConfirmPrompt(playerId, message);
    
    expect(prompt.type).toBe('Confirm');
    expect(prompt.playerId).toBe(playerId);
    expect(prompt.message).toBe(message);
    expect(prompt.result).toBeUndefined();
  });

  it('should decode boolean result correctly', () => {
    const prompt = new ConfirmPrompt(playerId, GameMessage.CHOOSE_CARD_TO_DISCARD);
    
    expect(prompt.decode(true, state)).toBe(true);
    expect(prompt.decode(false, state)).toBe(false);
  });

  it('should validate boolean result as true', () => {
    const prompt = new ConfirmPrompt(playerId, GameMessage.CHOOSE_CARD_TO_HAND);
    
    expect(prompt.validate(true, state)).toBe(true);
    expect(prompt.validate(false, state)).toBe(true);
  });

});