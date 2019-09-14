import * as express from 'express';
import { Storage } from '../../storage';

export abstract class Controller {

  constructor(
    protected path: string,
    protected app: express.Application,
    protected db: Storage
  ) { }

  public abstract init(): void;

}
