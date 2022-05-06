import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';

export interface SelectOptions {
  allowCancel: boolean;
  defaultValue: number;
}

export class SelectPrompt extends Prompt<number> {

  readonly type: string = 'Select';

  public options: SelectOptions;

  constructor(
    playerId: number,
    public message: GameMessage,
    public values: string[],
    options?: Partial<SelectOptions>
  ) {
    super(playerId);

    // Default options
    this.options = Object.assign({}, {
      allowCancel: true,
      defaultValue: 0,
    }, options);
  }

}
