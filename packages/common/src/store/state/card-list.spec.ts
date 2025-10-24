import { CardList } from './card-list';
import { Card } from '../card/card';
import { CardManager } from '../../game/cards/card-manager';
import { SuperType } from '../card/card-types';
import { State } from './state';
import { Rules } from './rules';

class TestCard extends Card {
  set = 'TEST';
  superType = SuperType.TRAINER;
  fullName = 'Test Card';
  name = 'Test';
  id = 1;
  tags = [];

  reduceEffect() {
    const state = new State();
    state.cardNames = [];
    state.logs = [];
    state.rules = new Rules();
    state.prompts = [];
    return state;
  }
}

describe('CardList', () => {
  let cardList: CardList<TestCard>;
  let card1: TestCard;
  let card2: TestCard;
  let card3: TestCard;

  beforeEach(() => {
    cardList = new CardList<TestCard>();
    card1 = new TestCard();
    card2 = new TestCard();
    card3 = new TestCard();
  });

  it('should initialize with default values', () => {
    expect(cardList.cards).toEqual([]);
    expect(cardList.isPublic).toBe(false);
    expect(cardList.isSecret).toBe(false);
  });

  describe('fromList', () => {
    beforeEach(() => {
      spyOn(CardManager, 'getInstance').and.returnValue({
        getCardByName: (name: string) => {
          if (name === 'Test') {
            return new TestCard();
          }
          return undefined;
        }
      } as CardManager);
    });

    it('should create CardList from card names', () => {
      const list = CardList.fromList(['Test', 'Test']);
      expect(list.cards.length).toBe(2);
      expect(list.cards[0].name).toBe('Test');
      expect(list.cards[1].name).toBe('Test');
    });

    it('should throw error for unknown card', () => {
      expect(() => CardList.fromList(['Unknown']))
        .toThrow();
    });
  });

  describe('applyOrder', () => {
    beforeEach(() => {
      cardList.cards = [card1, card2, card3];
    });

    it('should reorder cards according to provided order', () => {
      cardList.applyOrder([2, 0, 1]);
      expect(cardList.cards).toEqual([card3, card1, card2]);
    });

    it('should not reorder when order length does not match', () => {
      cardList.applyOrder([1, 0]);
      expect(cardList.cards).toEqual([card1, card2, card3]);
    });

    it('should not reorder when order is invalid', () => {
      cardList.applyOrder([0, 0, 2]);
      expect(cardList.cards).toEqual([card1, card2, card3]);
    });
  });

  describe('moveTo', () => {
    let destination: CardList<TestCard>;

    beforeEach(() => {
      destination = new CardList<TestCard>();
      cardList.cards = [card1, card2, card3];
    });

    it('should move all cards by default', () => {
      cardList.moveTo(destination);
      expect(cardList.cards).toEqual([]);
      expect(destination.cards).toEqual([card1, card2, card3]);
    });

    it('should move specified number of cards', () => {
      cardList.moveTo(destination, 2);
      expect(cardList.cards).toEqual([card3]);
      expect(destination.cards).toEqual([card1, card2]);
    });

    it('should handle count larger than available cards', () => {
      cardList.moveTo(destination, 5);
      expect(cardList.cards).toEqual([]);
      expect(destination.cards).toEqual([card1, card2, card3]);
    });
  });

  describe('moveCardsTo', () => {
    let destination: CardList<TestCard>;

    beforeEach(() => {
      destination = new CardList<TestCard>();
      cardList.cards = [card1, card2, card3];
    });

    it('should move specific cards', () => {
      cardList.moveCardsTo([card1, card3], destination);
      expect(cardList.cards).toEqual([card2]);
      expect(destination.cards).toEqual([card1, card3]);
    });

    it('should ignore cards not in list', () => {
      const card4 = new TestCard();
      cardList.moveCardsTo([card1, card4], destination);
      expect(cardList.cards).toEqual([card2, card3]);
      expect(destination.cards).toEqual([card1]);
    });
  });

  describe('moveToTop', () => {
    let destination: CardList<TestCard>;

    beforeEach(() => {
      destination = new CardList<TestCard>();
      destination.cards = [card3];
      cardList.cards = [card1, card2];
    });

    it('should move cards to the top of destination', () => {
      cardList.moveToTop(destination);
      expect(cardList.cards).toEqual([]);
      expect(destination.cards).toEqual([card1, card2, card3]);
    });

    it('should move specified number of cards to top', () => {
      cardList.moveToTop(destination, 1);
      expect(cardList.cards).toEqual([card2]);
      expect(destination.cards).toEqual([card1, card3]);
    });
  });

  describe('moveCardsToTop', () => {
    let destination: CardList<TestCard>;

    beforeEach(() => {
      destination = new CardList<TestCard>();
      destination.cards = [card3];
      cardList.cards = [card1, card2];
    });

    it('should move specific cards to top', () => {
      cardList.moveCardsToTop([card2, card1], destination);
      expect(cardList.cards).toEqual([]);
      expect(destination.cards).toEqual([card1, card2, card3]);
    });

    it('should ignore cards not in list', () => {
      const card4 = new TestCard();
      cardList.moveCardsToTop([card1, card4], destination);
      expect(cardList.cards).toEqual([card2]);
      expect(destination.cards).toEqual([card1, card3]);
    });
  });

  describe('top', () => {
    beforeEach(() => {
      cardList.cards = [card1, card2, card3];
    });

    it('should return top card by default', () => {
      expect(cardList.top()).toEqual([card1]);
    });

    it('should return specified number of top cards', () => {
      expect(cardList.top(2)).toEqual([card1, card2]);
    });

    it('should handle count larger than available cards', () => {
      expect(cardList.top(5)).toEqual([card1, card2, card3]);
    });

    it('should not modify original list', () => {
      const topCards = cardList.top(2);
      expect(cardList.cards).toEqual([card1, card2, card3]);
      expect(topCards).not.toBe(cardList.cards);
    });
  });
});