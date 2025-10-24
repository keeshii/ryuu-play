import { CoinFlipPrompt } from './coin-flip-prompt';
import { GameMessage } from '../../game-message';
import { State } from '../state/state';

describe('CoinFlipPrompt', () => {
  let playerId: number;
  let state: State;

  beforeEach(() => {
    playerId = 1;
    state = new State();
  });

  it('should initialize with correct type and message', () => {
    const message = GameMessage.FLIP_ASLEEP;
    const prompt = new CoinFlipPrompt(playerId, message);
    
    expect(prompt.type).toBe('Coin flip');
    expect(prompt.playerId).toBe(playerId);
    expect(prompt.message).toBe(message);
    expect(prompt.result).toBeUndefined();
  });

  it('should decode boolean result correctly', () => {
    const prompt = new CoinFlipPrompt(playerId, GameMessage.FLIP_BURNED);
    
    expect(prompt.decode(true, state)).toBe(true);
    expect(prompt.decode(false, state)).toBe(false);
  });

  it('should validate boolean result as true', () => {
    const prompt = new CoinFlipPrompt(playerId, GameMessage.FLIP_CONFUSION);
    
    expect(prompt.validate(true, state)).toBe(true);
    expect(prompt.validate(false, state)).toBe(true);
  });

});