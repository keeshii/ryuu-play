import { Logger } from './logger';
import { config } from '../config';

describe('Logger', () => {
  let logger: Logger;
  let originalConfig: typeof config.core;

  beforeEach(() => {
    originalConfig = config.core;
    config.core = { ...config.core, debug: true };
    logger = new Logger();
  });

  afterEach(() => {
    config.core = originalConfig
  });

  describe('log', () => {
    it('should log message when debug is true', () => {
      const message = 'test message';
      spyOn(console, 'log');
      logger.log(message);
      expect(console.log).toHaveBeenCalledWith(message);
    });

    it('should not log message when debug is false', () => {
      config.core = { ...config.core, debug: false };
      const message = 'test message';
      spyOn(console, 'log');
      logger.log(message);
      expect(console.log).not.toHaveBeenCalled();
    });
  });
});