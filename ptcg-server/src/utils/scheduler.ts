import { config } from '../config';

export class Scheduler {

  private static instance: Scheduler = new Scheduler();
  private initialized: boolean;
  private jobs: { callback: Function, counter: number, value: number }[] = [];
  private timeoutRef: NodeJS.Timeout | undefined;

  constructor() {
    if (!config.core.schedulerStartNextHour) {
      this.initialized = true;
      return;
    }
    this.initialized = false;

    // wait with the initialization till next hour
    const msInHour = 60 * 60 * 1000;
    const msToNextHour = msInHour - new Date().getTime() % msInHour;
    setTimeout(() => {
      this.initialized = true;
      this.startTimer();
    }, msToNextHour);
  }

  public static getInstance(): Scheduler {
    return Scheduler.instance;
  }

  public run(callback: Function, counter: number = 1): void {
    // Job disabled in the config file, do not add it to scheduler
    if (counter === 0) {
      return;
    }

    this.jobs.push({ counter, callback, value: 0 });

    if (this.initialized) {
      this.startTimer();
    }
  }

  private startTimer(): void {
    if (this.jobs.length === 0 || this.timeoutRef !== undefined) {
      return;
    }
    this.timeoutRef = setInterval(() => {
      this.jobs.forEach(job => {
        job.value += 1;
        if (job.value >= job.counter) {
          job.value = 0;
          job.callback();
        }
      });
    }, config.core.schedulerInterval);
  }

  public stop(callback: Function): void {
    const index = this.jobs.findIndex(job => job.callback === callback);
    if (index !== -1) {
      this.jobs.splice(index, 1);
      if (this.jobs.length === 0 && this.timeoutRef !== undefined) {
        clearInterval(this.timeoutRef);
        this.timeoutRef = undefined;
      }
    }
  }

}
