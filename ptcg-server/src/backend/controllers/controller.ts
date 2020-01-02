import * as express from 'express';
import { Core } from '../../game/core/core';
import { Storage } from '../../storage';

export interface ControllerClass {
  new(
    path: string,
    app: express.Application,
    db: Storage,
    core: Core
  ): Controller;
}

export abstract class Controller {

  constructor(
    protected path: string,
    protected app: express.Application,
    protected db: Storage,
    protected core: Core
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
