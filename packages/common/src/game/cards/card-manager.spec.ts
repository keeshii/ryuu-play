import { CardsInfo } from '../../interfaces';
import { Card, Rules, SuperType } from '../../store';
import { CardManager } from './card-manager';

describe('CardManager', () => {

  let service: CardManager;
  let set1: Card[];
  let set2: Card[];

  class ExampleCard extends Card {
    public set = 'TEST';
    public superType = SuperType.ENERGY;
    public fullName: string;
    public name: string;
    constructor(name: string) {
      super();
      this.fullName = name + ' ' + this.set;
      this.name = name;
    }
  }

  beforeEach(() => {
    service = new CardManager();
    set1 = [
      new ExampleCard('Water'),
      new ExampleCard('Fire')
    ];
    set2 = [
      new ExampleCard('Grass'),
      new ExampleCard('Psychic')
    ];
  });

  it('Should return the same instance', () => {
    const instance1 = CardManager.getInstance();
    const instance2 = CardManager.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('Should define sets', () => {
    service.defineSet(set1);
    service.defineSet(set2);
    expect(service.getAllCards()).toEqual([...set1, ...set2]);
    expect(service.getAllFormats()).toEqual([]);
  });

  it('Should throw error when define the same card multiple times', () => {
    expect(() => {
      service.defineSet([new ExampleCard('Water'), new ExampleCard('Water')]);
    }).toThrowError('Multiple cards with the same name: Water TEST');
  });

  it('Should define format', () => {
    service.defineFormat('Format 1', [set1, set2]);
    service.defineFormat('Format 2', [set1], new Rules({ firstTurnDrawCard: false }));

    expect(service.getAllCards()).toEqual([...set1, ...set2]);
    expect(service.getAllFormats()).toEqual([{
      name: 'Format 1',
      cards: [...set1, ...set2],
      ranges: [[0, 3]],
      rules: new Rules()
    }, {
      name: 'Format 2',
      cards: [...set1],
      ranges: [[0, 1]],
      rules: new Rules({ firstTurnDrawCard: false })
    }]);
  });

  it('Should throw error when define more than one format with same name', () => {
    expect(() => {
      service.defineFormat('Format', []);
      service.defineFormat('Format', []);
    }).toThrowError('Multiple formats with the same name: Format');
  });

  it('Should throw error when define the same card multiple time in the format', () => {
    expect(() => {
      service.defineFormat('Format 1 ', [[new ExampleCard('Water')]]);
      service.defineFormat('Format 2 ', [[new ExampleCard('Water')]]);
    }).toThrowError('Multiple cards with the same name: Water TEST');
  });

  it('Should throw error when the same card added several times in one format', () => {
    const card = new ExampleCard('Water');
    expect(() => {
      service.defineFormat('Format', [[card, card]]);
    }).toThrowError('Card added more than once to the format:Water TEST, Format');
  });

  it('Should load cardsInfo', () => {
    const cards: Card[] = [...set1, ...set2];
    const cardsInfo: CardsInfo = {
      cardsTotal: cards.length,
      formats: [{
        name: 'Format 1',
        ranges: [[0, 3]],
        rules: new Rules()
      },{
        name: 'Format 2',
        ranges: [[2, 3]],
        rules: new Rules()
      }],
      hash: ''
    };
    service.loadCardsInfo(cardsInfo, cards);
    expect(service.getAllCards()).toEqual([...set1, ...set2]);
    expect(service.getAllFormats()).toEqual([{
      name: 'Format 1',
      cards: [...set1, ...set2],
      ranges: [[0, 3]],
      rules: new Rules()
    }, {
      name: 'Format 2',
      cards: [...set2],
      ranges: [[2, 3]],
      rules: new Rules()
    }]);
  });

  it('Should find card by name and return deepClone', () => {
    const card = new ExampleCard('Water');
    service.defineSet([card]);
    expect(service.getCardByName('Water TEST')).toEqual(card);
    expect(service.getCardByName('Water TEST')).not.toBe(card);
  });

  it('Should check if card is defined', () => {
    const card = new ExampleCard('Water');
    service.defineSet([card]);
    expect(service.isCardDefined('Water TEST')).toEqual(true);
    expect(service.isCardDefined('Fire TEST')).toEqual(false);
  });

  it('Should return formats for given card', () => {
    service.defineFormat('Format 1', [set1, set2]);
    service.defineFormat('Format 2', [set1]);
    const formats = service.getAllFormats();
    expect(service.getCardFormats(set1[0].fullName)).toEqual([formats[0], formats[1]]);
    expect(service.getCardFormats(set2[0].fullName)).toEqual([formats[0]]);
    expect(service.getCardFormats('INVALID')).toEqual([]);
  });
});
