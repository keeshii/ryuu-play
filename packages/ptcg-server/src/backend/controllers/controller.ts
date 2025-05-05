import { Application } from 'express';
import { Core } from '../../game/core/core';
import { Storage, User } from '../../storage';
import { UserInfo } from '../interfaces/core.interface';

export interface ControllerClass {
  new(
    path: string,
    app: Application,
    db: Storage,
    core: Core
  ): Controller;
}

export abstract class Controller {

  constructor(
    protected path: string,
    protected app: Application,
    protected db: Storage,
    protected core: Core
  ) { }

  public init(): void {}

  protected buildUserInfo(user: User): UserInfo {
    const connected = this.core.clients
      .some(c => c.user.id === user.id);

    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      ranking: user.ranking,
      rank: user.getRank(),
      registered: user.registered,
      lastSeen: user.lastSeen,
      lastRankingChange: user.lastRankingChange,
      avatarFile: user.avatarFile,
      connected
    };
  }

  protected escapeLikeString(raw: string, escapeChar = '\\'): string {
    return raw.replace(/[\\%_]/g, match => escapeChar + match);
  }
}

export function Get(path: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const init = target.init;
    target.init = function() {
      init.call(this);
      this.app.get(`${this.path}${path}`, descriptor.value.bind(this));
    };
  };
}

export function Post(path: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const init = target.init;
    target.init = function() {
      init.call(this);
      this.app.post(`${this.path}${path}`, descriptor.value.bind(this));
    };
  };
}
