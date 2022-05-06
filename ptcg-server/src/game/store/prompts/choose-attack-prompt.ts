import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
import { State } from '../state/state';
import { PokemonCard } from '../card/pokemon-card';
import { Attack } from '../card/pokemon-types';

export const ChooseAttackPromptType = 'Choose attack';

export interface ChooseAttackOptions {
  allowCancel: boolean;
  blockedMessage: GameMessage;
  blocked: { index: number; attack: string }[];
}

export type ChooseAttackResultType = {index: number, attack: string};

export class ChooseAttackPrompt extends Prompt<Attack> {

  readonly type: string = ChooseAttackPromptType;

  public options: ChooseAttackOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
    public cards: PokemonCard[],
    options?: Partial<ChooseAttackOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      allowCancel: false,
      blockedMessage: GameMessage.NOT_ENOUGH_ENERGY,
      blocked: []
    }, options);
  }

  public decode(result: ChooseAttackResultType | null, state: State): Attack | null {
    if (result === null) {
      return result;  // operation cancelled
    }
    const index = result.index;
    if (index < 0 || index >= this.cards.length) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    const card = this.cards[index];
    const attack = card.attacks.find(a => a.name === result.attack);
    if (attack === undefined) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    return attack;
  }

  public validate(result: Attack | null): boolean {
    if (result === null) {
      return this.options.allowCancel;  // operation cancelled
    }

    const blocked = this.options.blocked.map(b => {
      const card = this.cards[b.index];
      if (card && card.attacks) {
        return card.attacks.find(a => a.name === b.attack);
      }
    });

    if (blocked.includes(result)) {
      return false;
    }

    return this.cards.some(c => c.attacks.includes(result));
  }

}
