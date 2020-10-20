import { SerializerContext, Serialized, Serializer } from "./serializer.interface";
import { GameError, GameMessage } from "../game-error";
import { AlertPrompt } from "../store/prompts/alert-prompt";
import { AttachEnergyPrompt } from "../store/prompts/attach-energy-prompt";
import { ChooseCardsPrompt } from "../store/prompts/choose-cards-prompt";
import { ChooseEnergyPrompt } from "../store/prompts/choose-energy-prompt";
import { ChoosePokemonPrompt } from "../store/prompts/choose-pokemon-prompt";
import { ChoosePrizePrompt } from "../store/prompts/choose-prize-prompt";
import { CoinFlipPrompt } from "../store/prompts/coin-flip-prompt";
import { ConfirmPrompt } from "../store/prompts/confirm-prompt";
import { InvitePlayerPrompt } from "../store/prompts/invite-player-prompt";
import { MoveDamagePrompt } from "../store/prompts/move-damage-prompt";
import { MoveEnergyPrompt } from "../store/prompts/move-energy-prompt";
import { OrderCardsPrompt } from "../store/prompts/order-cards-prompt";
import { Prompt } from "../store/prompts/prompt";
import { SelectPrompt } from "../store/prompts/select-prompt";
import { ShowCardsPrompt } from "../store/prompts/show-cards-prompt";
import { ShuffleDeckPrompt } from "../store/prompts/shuffle-prompt";

export class PromptSerializer implements Serializer<Prompt<any>> {

  public readonly types: string[];
  public readonly classes: any[];

  private rows: { classValue: (new (...params: any[]) => Prompt<any>), type: string }[] = [
    { classValue: AlertPrompt, type: 'AlertPrompt' },
    { classValue: AttachEnergyPrompt, type: 'AttachEnergyPrompt' },
    { classValue: ChooseCardsPrompt, type: 'ChooseCardsPrompt' },
    { classValue: ChooseEnergyPrompt, type: 'ChooseEnergyPrompt' },
    { classValue: ChoosePokemonPrompt, type: 'ChoosePokemonPrompt' },
    { classValue: ChoosePrizePrompt, type: 'ChoosePrizePrompt' },
    { classValue: CoinFlipPrompt, type: 'CoinFlipPrompt' },
    { classValue: ConfirmPrompt, type: 'ConfirmPrompt' },
    { classValue: InvitePlayerPrompt, type: 'InvitePlayerPrompt' },
    { classValue: MoveDamagePrompt, type: 'MoveDamagePrompt' },
    { classValue: MoveEnergyPrompt, type: 'MoveEnergyPrompt' },
    { classValue: OrderCardsPrompt, type: 'OrderCardsPrompt' },
    { classValue: SelectPrompt, type: 'SelectPrompt' },
    { classValue: ShowCardsPrompt, type: 'ShowCardsPrompt' },
    { classValue: ShuffleDeckPrompt, type: 'ShuffleDeckPrompt' },
  ];

  constructor () {
    this.types = this.rows.map(p => p.type);
    this.classes = this.rows.map(p => p.classValue);
  }

  public serialize(prompt: Prompt<any>): Serialized {
    const data: any = { ...prompt };
    const row = this.rows.find(r => prompt instanceof r.classValue);
    if (row === undefined) {
      throw new GameError(GameMessage.SERIALIZER_ERROR, `Unknown prompt type '${prompt.type}'.`);
    }

    return {
      ...data,
      _type: row.type,
    };
  }

  public deserialize(data: Serialized, context: SerializerContext): Prompt<any> {
    const row = this.rows.find(p => p.type === data._type);
    if (row === undefined) {
      throw new GameError(GameMessage.SERIALIZER_ERROR, `Unknown prompt type '${data._type}'.`);
    }
    const prompt = Object.create(row.classValue.prototype);
    delete data._type;
    return Object.assign(prompt, data);
  }

}
