export class Deck {

  constructor(public cards: string[] = []) { }

  public insert(card: string, quantity: number = 1): void {
    for (let i = 0; i < quantity; i++) {
      this.cards.push(card);
    }
  }

  public isValid(): boolean {
    const deckSize = 60;
    return this.cards.length === deckSize;
  }

}
