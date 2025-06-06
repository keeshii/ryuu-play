import { Prompt } from './prompt';
import { PlayerType, SlotType, CardTarget } from '../actions/play-card-action';
import { State } from '../state/state';
import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { StateUtils } from '../state-utils';
import { PokemonSlot } from '../state/pokemon-slot';

export const ChoosePokemonPromptType = 'Choose pokemon';

export interface ChoosePokemonOptions {
  min: number;
  max: number;
  allowCancel: boolean;
  blocked: CardTarget[];
}

export class ChoosePokemonPrompt extends Prompt<PokemonSlot[]> {

  readonly type: string = ChoosePokemonPromptType;

  public options: ChoosePokemonOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
    public playerType: PlayerType,
    public slots: SlotType[],
    options?: Partial<ChoosePokemonOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      min: 1,
      max: 1,
      allowCancel: true,
      blocked: []
    }, options);
  }

  public decode(result: CardTarget[] | null, state: State): PokemonSlot[] | null {
    if (result === null) {
      return result;  // operation cancelled
    }
    const player = state.players.find(p => p.id === this.playerId);
    const opponent = state.players.find(p => p.id !== this.playerId);
    if (player === undefined || opponent === undefined) {
      throw new GameError(GameMessage.INVALID_PROMPT_RESULT);
    }
    return result.map(target => {
      const p = target.player === PlayerType.BOTTOM_PLAYER ? player : opponent;
      return target.slot === SlotType.ACTIVE ? p.active : p.bench[target.index];
    });
  }

  public validate(result: PokemonSlot[] | null, state: State): boolean {
    if (result === null) {
      return this.options.allowCancel;
    }
    if (result.length < this.options.min || result.length > this.options.max) {
      return false;
    }
    if (result.some(cardList => cardList.pokemons.cards.length === 0)) {
      return false;
    }
    const player = state.players.find(p => p.id === this.playerId);
    if (player === undefined) {
      return false;
    }
    const blocked = this.options.blocked.map(b => StateUtils.getTarget(state, player, b));
    if (result.some(r => blocked.includes(r))) {
      return false;
    }
    return true;
  }

}
