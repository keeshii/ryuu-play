import { config } from '../../config';

interface RateLimitItem {
  ip: string;
  count: number;
  lastRequest: number;
}

export class RateLimit {

  private items: RateLimitItem[] = [];
  private static instance: RateLimit = new RateLimit();

  public static getInstance(): RateLimit {
    return RateLimit.instance;
  }

  public isLimitExceeded(ip: string): boolean {
    this.deleteExpired();

    const rateLimit = this.items.find(i => i.ip === ip);
    if (rateLimit === undefined) {
      return false;
    }

    if (rateLimit.count < config.backend.rateLimitCount) {
      return false;
    }

    return true;
  }

  public increment(ip: string) {
    let rateLimit = this.items.find(i => i.ip === ip);

    if (rateLimit === undefined) {
      rateLimit = { ip, lastRequest: 0, count: 0 };
      this.items.push(rateLimit);
    }

    rateLimit.lastRequest = Date.now();
    rateLimit.count += 1;
  }

  private deleteExpired(): void {
    const expire = Date.now() - config.backend.rateLimitTime;
    this.items = this.items.filter(i => i.lastRequest >= expire);
  }

}
