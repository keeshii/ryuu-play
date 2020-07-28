import { Card } from "../card/card";
import { Prompt } from "./prompt";

export class ShowCardsPrompt extends Prompt<void> {

  readonly type: string = 'Show cards'

  constructor(playerId: number, public message: string, public cards: Card[]) {
    super(playerId);
  }

}
