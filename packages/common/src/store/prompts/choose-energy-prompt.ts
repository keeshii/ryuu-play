import { CardType } from '../card/card-types';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
import { StateUtils } from '../state-utils';
import { EnergyCard } from '../card/energy-card';

export const ChooseEnergyPromptType = 'Choose energy';

export interface ChooseEnergyOptions {
  allowCancel: boolean;
}

export interface EnergyMap {
  card: EnergyCard;
  provides: CardType[];
  provideAmount: number;
}

export class ChooseEnergyPrompt extends Prompt<EnergyMap[]> {

  readonly type: string = ChooseEnergyPromptType;

  public options: ChooseEnergyOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
    public energy: EnergyMap[],
    public cost: CardType[],
    options?: Partial<ChooseEnergyOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      allowCancel: true
    }, options);

    if (this.options.allowCancel === false) {
      this.cost = this.getCostThatCanBePaid();
    }
  }

  public decode(result: number[] | null): EnergyMap[] | null {
    if (result === null) {
      return null;
    }
    const energy: EnergyMap[] = this.energy;
    return result.map(index => energy[index]);
  }

  public validate(result: EnergyMap[] | null): boolean {
    if (result === null) {
      return this.options.allowCancel;
    }
    if (!StateUtils.checkExactEnergy(result, this.cost)) {
      return false;
    }
    return true;
  }

  private getCostThatCanBePaid(): CardType[] {
    // NOTE: This is greedy, not perfect algorithm, but should be OK for this prompt
    const result: CardType[] = this.cost.slice();
    const costs: CardType[] = this.cost.filter(c => c !== CardType.COLORLESS);
    const colorlessCount = result.length - costs.length;

    const units: CardType[][] = [];
    // Expand each EnergyMap into individual energy units according to provideAmount
    this.energy.forEach(e => {
      for (let i = 0; i < e.provideAmount; i++) {
        units.push(e.provides);
      }
    });

    // First try to use the energies that are providing less energy types
    units.sort((a, b) => a.length - b.length);

    while (costs.length > 0 && units.length > 0) {
      const cost = costs[0];
      const index = units.findIndex(u => u.includes(cost));

      if (index !== -1) {
        // Energy can be paid, so remove that energy from the provides
        units.splice(index, 1);
        costs.shift();

      } else {
        // Impossible to pay for this cost
        costs.shift();
        const costToDelete = result.indexOf(cost);
        if (costToDelete !== -1) {
          result.splice(costToDelete, 1);
        }
      }
    }

    const energyLeft = units.length;
    const colorlessToDelete = Math.max(0, colorlessCount - energyLeft);
    for (let i = 0; i < colorlessToDelete; i++) {
      const costToDelete = result.indexOf(CardType.COLORLESS);
      if (costToDelete !== -1) {
        result.splice(costToDelete, 1);
      }
    }

    return result;
  }

}
