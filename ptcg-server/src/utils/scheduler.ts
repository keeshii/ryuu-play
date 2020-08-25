
export class Scheduler {

  private readonly runInterval: number = 60 * 60 * 1000; // one hour
  private static instance: Scheduler = new Scheduler();
  private jobs: Function[] = [];
  private timeoutRef: NodeJS.Timeout | undefined;

  public static getInstance(): Scheduler {
    return Scheduler.instance;
  }

  public run(job: Function): void {
    this.jobs.push(job);

    if (this.timeoutRef === undefined) {
      this.timeoutRef = setInterval(() => {
        this.jobs.forEach(job => job());
      }, this.runInterval);
    }
  }

  public stop(job: Function): void {
    const index = this.jobs.indexOf(job);
    if (index !== -1) {
      this.jobs.splice(index, 1);
      if (this.jobs.length === 0 && this.timeoutRef !== undefined) {
        clearInterval(this.timeoutRef);
        this.timeoutRef = undefined;
      }
    }
  }

}
