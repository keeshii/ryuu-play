import { Player, State, Action, ResolvePromptAction, Prompt, Card, CardList } from '../../game';
import { PromptResolver } from './prompt-resolver';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';


export class ChooseCardsPromptResolver extends PromptResolver {

  public resolvePrompt(state: State, player: Player, prompt: Prompt<any>): Action | undefined {
    if (prompt instanceof ChooseCardsPrompt) {
      let result: Card[] | null = this.buildCardsToChoose(state, prompt);
      result = this.removeInvalidCards(prompt, result);
      if (result.length > prompt.options.max) {
        result.length = prompt.options.max;
      }
      if (result.length < prompt.options.min) {
        result = null;
      }
      return new ResolvePromptAction(prompt.id, result);
    }
  }

  private removeInvalidCards(prompt: ChooseCardsPrompt, cards: Card[]): Card[] {
    const result: Card[] = [];

    // temporary remove min restriction for this prompt
    const minCopy = prompt.options.min;
    prompt.options.min = 0;

    // Add card by card to the results and check if it is still valid
    for (const card of cards) {
      if (prompt.validate([...result, card])) {
        result.push(card);
      }
    }

    prompt.options.min = minCopy;
    return result;
  }

  private buildCardsToChoose(state: State, prompt: ChooseCardsPrompt): Card[] {
    const cardList = new CardList();

    cardList.cards = prompt.cards.cards.filter((card, index) => {
      return !prompt.options.blocked.includes(index);
    });

    const cards = cardList.filter(prompt.filter).map(card => {
      const score = this.stateScore.getCardScore(state, prompt.playerId, card);
      return { card, score };
    });

    cards.sort((a, b) => b.score - a.score);
    return cards.map(c => c.card);
  }

}
