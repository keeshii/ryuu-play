import { AlertPrompt } from './alert-prompt';
import { GameMessage } from '../../game-message';
import { State } from '../state/state';

describe('AlertPrompt', () => {
  let playerId: number;
  let state: State;

  beforeEach(() => {
    playerId = 1;
    state = new State();
  });

  it('should initialize with correct type and message', () => {
    const message = GameMessage.BLOCKED_BY_ABILITY;
    const prompt = new AlertPrompt(playerId, message);
    
    expect(prompt.type).toBe('Alert');
    expect(prompt.playerId).toBe(playerId);
    expect(prompt.message).toBe(message);
    expect(prompt.result).toBeUndefined();
  });

  it('should decode only true as true', () => {
    const prompt = new AlertPrompt(playerId, GameMessage.BLOCKED_BY_EFFECT);
    
    expect(prompt.decode(true, state)).toBe(true);
    expect(prompt.decode(false, state)).toBe(false);
    expect(prompt.decode(null, state)).toBe(null);
  });

  it('should validate only true result as true', () => {
    const prompt = new AlertPrompt(playerId, GameMessage.CANNOT_USE_POWER);
    
    expect(prompt.validate(true, state)).toBe(true);
    expect(prompt.validate(null, state)).toBe(true);
  });

});