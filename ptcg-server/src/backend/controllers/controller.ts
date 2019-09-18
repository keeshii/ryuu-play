import * as express from 'express';
import { Storage } from '../../storage';

export abstract class Controller {

  constructor(
    protected path: string,
    protected app: express.Application,
    protected db: Storage
  ) { }

  public init(): void {};

}

export function Get(path: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const init = target.init;
    target.init = function() {
      init.call(this);
      this.app.get(`${this.path}${path}`, descriptor.value.bind(this));
    }
  }
}

export function Post(path: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const init = target.init;
    target.init = function() {
      init.call(this);
      this.app.post(`${this.path}${path}`, descriptor.value.bind(this));
    }
  }
}
