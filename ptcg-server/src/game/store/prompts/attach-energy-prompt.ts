import { Card } from "../card/card";
import { GameError, GameMessage } from "../../game-error";
import { Prompt } from "./prompt";
import { PlayerType, SlotType, CardTarget } from "../actions/play-card-action";
import { State } from "../state/state";
import { CardList } from "../state/card-list";
import { FilterType } from "./choose-cards-prompt";

export const AttachEnergyPromptType = 'Attach energy';

export interface AttachEnergyOptions {
  allowCancel: boolean;
  min: number;
  max: number;
  blocked: number[];
  blockedTo: CardTarget[];
}

export type AttachEnergyResultType = {to: CardTarget, index: number}[];

export interface CardAssign {
  to: CardTarget;
  card: Card;
}

export class AttachEnergyPrompt extends Prompt<CardAssign[]> {

  readonly type: string = AttachEnergyPromptType;

  public options: AttachEnergyOptions;

  constructor(
    playerId: number,
    public message: string,
    public cardList: CardList,
    public playerType: PlayerType,
    public slots: SlotType[],
    public filter: FilterType,
    options?: Partial<AttachEnergyOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      allowCancel: true,
      min: 0,
      max: cardList.cards.length,
      blocked: [],
      blockedTo: []
    }, options);
  }

  public decode(result: AttachEnergyResultType | null, state: State): CardAssign[] | null {
    if (result === null) {
      return result;  // operation cancelled
    }
    const player = state.players.find(p => p.id === this.playerId);
    if (player === undefined) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    const transfers: CardAssign[] = [];
    result.forEach(t => {
      const cardList = this.cardList;
      const card = cardList.cards[t.index];
      transfers.push({ to: t.to, card });
    });
    return transfers;
  }

  public validate(result: CardAssign[] | null): boolean {
    if (result === null) {
      return this.options.allowCancel;  // operation cancelled
    }
    if (result.length < this.options.min || result.length > this.options.max) {
      return false;
    }
    return result.every(r => r.card !== undefined);
  }

}
