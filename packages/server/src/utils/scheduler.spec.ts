import { Scheduler } from './scheduler';
import { config } from '../config';

describe('Scheduler', () => {
  let scheduler: Scheduler;
  let callbackCalled: number;
  let callback: Function;
  let originalConfig: typeof config.core;

  beforeEach(() => {
    jasmine.clock().install();
    scheduler = Scheduler.getInstance();
    callbackCalled = 0;
    originalConfig = config.core;
    callback = () => {
      callbackCalled++;
    };
  });

  afterEach(() => {
    config.core = originalConfig;
    scheduler.stop(callback);
    jasmine.clock().uninstall();
  });

  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = Scheduler.getInstance();
      const instance2 = Scheduler.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('run', () => {
    it('should not schedule job when counter is 0', () => {
      scheduler.run(callback, 0);
      
      // Wait a bit longer than the scheduler interval
      jasmine.clock().tick(config.core.schedulerInterval * 2);
      expect(callbackCalled).toBe(0);
    });

    it('should run job after specified intervals', () => {
      // Mock shorter scheduler interval for testing
      config.core = { ...config.core, schedulerInterval: 100, schedulerStartNextHour: false };
      
      scheduler.run(callback, 2);

      // First interval - counter not reached yet
      jasmine.clock().tick(config.core.schedulerInterval);
      expect(callbackCalled).toBe(0);

      // Second interval - counter reached, callback should be called
      jasmine.clock().tick(config.core.schedulerInterval);
      expect(callbackCalled).toBe(1);
    });
  });

  describe('stop', () => {
    it('should stop specific job without affecting others', () => {
      let callback2Called = 0;
      const callback2 = () => {
        callback2Called++;
      };

      // Mock shorter scheduler interval for testing
      config.core = { ...config.core, schedulerInterval: 100, schedulerStartNextHour: false };

      scheduler.run(callback, 1);
      scheduler.run(callback2, 1);

      // Give some time for jobs to run
      jasmine.clock().tick(config.core.schedulerInterval * 2);
      
      const initialCallback1Count = callbackCalled;
      const initialCallback2Count = callback2Called;
      
      scheduler.stop(callback);

      // Advance time and check only callback2 continues running
      jasmine.clock().tick(config.core.schedulerInterval * 2);

      expect(callbackCalled).toBe(initialCallback1Count); // Should not have increased
      expect(callback2Called).toBeGreaterThan(initialCallback2Count); // Should have increased

      scheduler.stop(callback2);
    });
  });
});