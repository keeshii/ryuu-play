
export class CardManager {

  private static instance: CardManager;

  private cards: string[] = [];

  public static getInstance(): CardManager {
    if (!CardManager.instance) {
      CardManager.instance = new CardManager();
    }

    return CardManager.instance;
  }

  public defineCard(card: string): void {
    this.cards.push(card);
  }

}
