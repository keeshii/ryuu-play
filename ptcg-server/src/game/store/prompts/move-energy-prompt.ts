import { Card } from '../card/card';
import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
import { PlayerType, SlotType, CardTarget } from '../actions/play-card-action';
import { State } from '../state/state';
import { StateUtils } from '../state-utils';
import { FilterType } from './choose-cards-prompt';

export const MoveEnergyPromptType = 'Move energy';

export type MoveEnergyResultType = {from: CardTarget, to: CardTarget, index: number}[];

export interface CardTransfer {
  from: CardTarget;
  to: CardTarget;
  card: Card;
}

export interface MoveEnergyOptions {
  allowCancel: boolean;
  min: number;
  max: number | undefined;
  blockedFrom: CardTarget[];
  blockedTo: CardTarget[];
  blockedMap: { source: CardTarget, blocked: number[] }[];
}

export class MoveEnergyPrompt extends Prompt<CardTransfer[]> {

  readonly type: string = MoveEnergyPromptType;

  public options: MoveEnergyOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
    public playerType: PlayerType,
    public slots: SlotType[],
    public filter: FilterType,
    options?: Partial<MoveEnergyOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      allowCancel: true,
      min: 0,
      max: undefined,
      blockedFrom: [],
      blockedTo: [],
      blockedMap: [],
    }, options);
  }

  public decode(result: MoveEnergyResultType | null, state: State): CardTransfer[] | null {
    if (result === null) {
      return result;  // operation cancelled
    }
    const player = state.players.find(p => p.id === this.playerId);
    if (player === undefined) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    const transfers: CardTransfer[] = [];
    result.forEach(t => {
      const cardList = StateUtils.getTarget(state, player, t.from);
      const card = cardList.cards[t.index];
      transfers.push({ from: t.from, to: t.to, card });
    });
    return transfers;
  }

  public validate(result: CardTransfer[] | null): boolean {
    if (result === null) {
      return this.options.allowCancel;  // operation cancelled
    }
    return result.every(r => r.card !== undefined);
  }

}
