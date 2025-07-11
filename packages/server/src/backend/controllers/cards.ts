import { Request, Response } from 'express';
import { Card, CardManager, CardsInfo } from '@ptcg/common';
import { Controller, Get } from './controller';
import { Md5 } from '../../utils';
import { config } from '../../config';

export class Cards extends Controller {

  private cardsInfo?: CardsInfo;

  @Get('/get/:page')
  public async onGet(req: Request, res: Response) {
    const page: number = parseInt(req.params.page, 10);
    const cards = this.buildCardsPage(page);
    res.send({ok: true, cards});
  }

  @Get('/info')
  public async onInfo(req: Request, res: Response) {
    if (!this.cardsInfo) {
      this.cardsInfo = this.buildCardsInfo();
    }
    res.send({ok: true, cardsInfo: this.cardsInfo });
  }

  private buildCardsPage(page: number): Card[] {
    const cardManager = CardManager.getInstance();
    const allCards = cardManager.getAllCards();
    const pageSize = config.backend.cardsPerRequest;
    
    const start = page * pageSize;
    if (start >= allCards.length) {
      return [];
    }

    const end = Math.min(start + pageSize, allCards.length);
    return allCards.slice(start, end);
  }

  private buildCardsInfo(): CardsInfo {
    const cardManager = CardManager.getInstance();
    const cards = cardManager.getAllCards();
    const formats = cardManager.getAllFormats();
 
    const cardsInfo: CardsInfo = {
      cardsTotal: cards.length,
      formats: formats.map(f => ({
        name: f.name,
        ranges: f.ranges,
        rules: f.rules
      })),
      hash: ''
    };

    const hash = Md5.init(JSON.stringify([cardsInfo, cards]));
    cardsInfo.hash = hash;
    return cardsInfo;
  }
}
