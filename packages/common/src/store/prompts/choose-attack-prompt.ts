import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
import { State } from '../state/state';
import { PokemonCard } from '../card/pokemon-card';
import { Attack, Power } from '../card/pokemon-types';

export const ChooseAttackPromptType = 'Choose attack';

export interface ChooseAttackOptions {
  allowCancel: boolean;
  enableAbility: {
    useWhenInPlay?: boolean;
    useFromHand?: boolean;
    useFromDiscard?: boolean;
  };
  enableAttack: boolean;
  blockedMessage: GameMessage;
  blocked: { index: number; name: string }[];
}

export type ChooseAttackResultType = { index: number, name: string };

export class ChooseAttackPrompt extends Prompt<Attack | Power> {

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
      enableAbility: {},
      enableAttack: true,
      blockedMessage: GameMessage.NOT_ENOUGH_ENERGY,
      blocked: []
    }, options);
  }

  public decode(result: ChooseAttackResultType | null, state: State): Attack | Power | null {
    if (result === null) {
      return result;  // operation cancelled
    }

    const index = result.index;
    if (index < 0 || index >= this.cards.length) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }

    const card = this.cards[index];
    const items: (Attack | Power)[] = [];

    if (this.options.enableAbility.useWhenInPlay) {
      items.push(...card.powers.filter(p => p.useWhenInPlay));
    }

    if (this.options.enableAbility.useFromHand) {
      items.push(...card.powers.filter(p => p.useFromHand));
    }

    if (this.options.enableAbility.useFromDiscard) {
      items.push(...card.powers.filter(p => p.useFromDiscard));
    }

    if (this.options.enableAttack) {
      items.push(...card.attacks);
    }

    const attackOrPower = items.find(a => a.name === result.name);
    if (attackOrPower === undefined) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }

    return attackOrPower;
  }

  public validate(result: Attack | null): boolean {
    if (result === null) {
      return this.options.allowCancel;  // operation cancelled
    }

    const blocked = this.options.blocked.map(b => {
      const card = this.cards[b.index];
      if (card) {
        const items = [...card.powers, ...card.attacks];
        return items.find(a => a.name === b.name);
      }
    });

    if (blocked.includes(result)) {
      return false;
    }

    return this.cards.some(c => c.attacks.includes(result));
  }

}
