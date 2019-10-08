import { Card } from "./card";

export class CardList {

  public cards: Card[] = [];

  public isPublic: boolean = false;

  public isSecret: boolean = false;

  public static fromList(names: string[]): CardList {
    const cardList = new CardList();
    cardList.cards = names.map(name => new Card(name));
    return cardList;
  }

  public moveTo(destination: CardList, count?: number): void {
    if (count === undefined) {
      count = destination.cards.length;
    }

    count = Math.min(count, this.cards.length);
    const cards = this.cards.splice(0, count);
    destination.cards.push(...cards);
  }

  public moveCardsTo(cards: Card[], destination: CardList): void {
    for (let i = 0; i < cards.length; i++) {
      const index = this.cards.indexOf(cards[i]);
      if (index !== -1) {
        const card = this.cards.splice(index, 1);
        destination.cards.push(card[0]);
      }
    }
  }

  public moveCardTo(card: Card, destination: CardList): void {
    this.moveCardsTo([card], destination);
  }

  public top(count: number = 1): Card[] {
    count = Math.min(count, this.cards.length);
    return this.cards.slice(0, count);
  }

  public countCards(cardName: string) {
    this.cards.filter(c => c.name === cardName).length;
  }

}
