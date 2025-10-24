import { StateLog } from './state-log';
import { GameLog } from '../../game-message';

describe('StateLog', () => {
  describe('constructor', () => {
    it('should initialize with required message only', () => {
      const log = new StateLog(GameLog.LOG_GAME_FINISHED);
      expect(log.id).toBe(0);
      expect(log.client).toBe(0);
      expect(log.params).toEqual({});
      expect(log.message).toBe(GameLog.LOG_GAME_FINISHED);
    });

    it('should initialize with message and params', () => {
      const params = { cardName: 'Test Card', playerId: 1 };
      const log = new StateLog(GameLog.LOG_PLAYER_PLAYS_ITEM, params);
      expect(log.id).toBe(0);
      expect(log.client).toBe(0);
      expect(log.params).toEqual(params);
      expect(log.message).toBe(GameLog.LOG_PLAYER_PLAYS_ITEM);
    });

    it('should initialize with message, params and client', () => {
      const params = { cardName: 'Test Card', playerId: 1 };
      const log = new StateLog(GameLog.LOG_PLAYER_PLAYS_ITEM, params, 2);
      expect(log.id).toBe(0);
      expect(log.client).toBe(2);
      expect(log.params).toEqual(params);
      expect(log.message).toBe(GameLog.LOG_PLAYER_PLAYS_ITEM);
    });

    it('should handle empty params', () => {
      const log = new StateLog(GameLog.LOG_GAME_FINISHED, {}, 2);
      expect(log.params).toEqual({});
    });

    it('should keep params reference', () => {
      const params = { cardName: 'Test Card', playerId: 1 };
      const log = new StateLog(GameLog.LOG_GAME_FINISHED, params);
      expect(log.params).toBe(params);
    });
  });
});