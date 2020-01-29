import { Request, Response } from 'express';
import { CardManager } from '../../game';
import { Controller, Get } from './controller';
import { config } from '../../config';

export class Cards extends Controller {

  @Get('/all')
  public async onAll(req: Request, res: Response) {
    const cardManager = CardManager.getInstance();
    const cards = cardManager.getAllCards();
    const scansUrl = config.sets.scansUrl;
    res.send({ok: true, cards, scansUrl});
  }

}
