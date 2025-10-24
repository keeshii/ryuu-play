import { GameError } from './game-error';
import { GameMessage } from './game-message';

describe('GameError', () => {

  it('should create error with message code when no message provided', () => {
    const error = new GameError(GameMessage.BLOCKED_BY_ABILITY);
    expect(error.message).toBe(GameMessage.BLOCKED_BY_ABILITY);
  });

  it('should create error with custom message when provided', () => {
    const customMsg = 'Custom error message';
    const error = new GameError(GameMessage.BLOCKED_BY_ABILITY, customMsg);
    expect(error.message).toBe(customMsg);
  });

});