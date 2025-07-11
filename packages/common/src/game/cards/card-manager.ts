import { CardsInfo } from '../../interfaces';
import { Card, Rules } from '../../store';
import { deepClone } from '../../utils';
import { Format } from './format.interface';

export class CardManager {

  private static instance: CardManager;

  private cards: Card[] = [];

  private formats: Format[] = [];

  private cardIndex: { [name: string]: number } = {};

  private cardFormats: { [name: string]: Format[] } = {};

  public static getInstance(): CardManager {
    if (!CardManager.instance) {
      CardManager.instance = new CardManager();
    }
    return CardManager.instance;
  }

  public defineFormat(name: string, sets: Array<Card[]>, rules?: Rules) {
    if (this.formats.some(f => f.name === name)) {
      throw new Error('Multiple formats with the same name: ' + name);
    }

    const format: Format = {
      name,
      cards: [],
      ranges: [],
      rules: rules || new Rules()
    };

    for (const set of sets) {
      for (const card of set) {

        let index = this.cardIndex[card.fullName];
        if (index !== undefined && this.cards[index] !== card) {
          throw new Error('Multiple cards with the same name: ' + card.fullName);
        }

        if (format.cards.indexOf(card) !== -1) {
          throw new Error('Card added more than once to the format:' + card.fullName + ', ' + name);
        }

        if (index === undefined) {
          index = this.cards.length;
          this.cardIndex[card.fullName] = index;
          this.cardFormats[card.fullName] = [];
          this.cards.push(card);
        }

        this.cardFormats[card.fullName].push(format);
        format.cards.push(card);
      }
    }

    this.formats.push(format);
    this.rebuildCardRanges(format);
  }

  public defineSet(set: Card[]): void {
    for (const card of set) {

      let index = this.cardIndex[card.fullName];
      if (index !== undefined && this.cards[index] !== card) {
        throw new Error('Multiple cards with the same name: ' + card.fullName);
      }

      if (index === undefined) {
        index = this.cards.length;
        this.cardIndex[card.fullName] = index;
        this.cardFormats[card.fullName] = [];
        this.cards.push(card);
      }
    }
  }

  public loadCardsInfo(cardsInfo: CardsInfo, cards: Card[]) {
    this.cardIndex = {};
    this.cardFormats = {};

    this.cards = cards;
    for (let i = 0; i < this.cards.length; i++) {
      this.cardIndex[this.cards[i].fullName] = i;
      this.cardFormats[this.cards[i].fullName] = [];
    }

    this.formats = cardsInfo.formats.map(f => ({
      name: f.name,
      cards: [],
      ranges: f.ranges,
      rules: new Rules(f.rules)
    }));

    for (const format of this.formats) {
      for (const range of format.ranges) {
        for (let i = range[0]; i <= range[1]; i++) {
          format.cards.push(this.cards[i]);
          this.cardFormats[this.cards[i].fullName].push(format);
        }
      }
    }
  }

  public getCardByName(name: string): Card | undefined {
    const index = this.cardIndex[name];
    if (index !== undefined) {
      return deepClone(this.cards[index]);
    }
  }

  public isCardDefined(name: string): boolean {
    return this.cardIndex[name] !== undefined;
  }

  public getCardFormats(name: string): Format[] {
    return this.cardFormats[name] || [];
  }

  public getAllCards(): Card[] {
    return this.cards;
  }

  public getAllFormats(): Format[] {
    return this.formats;
  }

  private rebuildCardRanges(format: Format) {
    const indexes = format.cards.map(c => this.cardIndex[c.fullName]);
    indexes.sort((a, b) => a - b);

    const ranges: [number, number][] = [];
    let pos = 0;

    while (pos < indexes.length) {
      const range: [number, number] = [indexes[pos], indexes[pos]];
      while (pos + 1 < indexes.length && indexes[pos + 1] === indexes[pos] + 1) {
        pos += 1;
        range[1] = indexes[pos];
      }
      ranges.push(range);
      pos += 1;
    }

    format.ranges = ranges;
  }

}
