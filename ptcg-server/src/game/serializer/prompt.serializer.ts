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
import { MoveEnergyPrompt } from "../store/prompts/move-energy-prompt";
import { OrderCardsPrompt } from "../store/prompts/order-cards-prompt";
import { Prompt } from "../store/prompts/prompt";
import { SelectPrompt } from "../store/prompts/select-prompt";
import { ShowCardsPrompt } from "../store/prompts/show-cards-prompt";
import { ShuffleDeckPrompt } from "../store/prompts/shuffle-prompt";

export class PromptSerializer implements Serializer<Prompt<any>> {

  public readonly types: string[];
  private prompts: (new (...params: any[]) => Prompt<any>)[] = [
    AlertPrompt,
    AttachEnergyPrompt,
    ChooseCardsPrompt,
    ChooseEnergyPrompt,
    ChoosePokemonPrompt,
    ChoosePrizePrompt,
    CoinFlipPrompt,
    ConfirmPrompt,
    InvitePlayerPrompt,
    MoveEnergyPrompt,
    OrderCardsPrompt,
    SelectPrompt,
    ShowCardsPrompt,
    ShuffleDeckPrompt
  ];

  constructor () {
    this.types = this.prompts.map(p => p.name);
  }

  public serialize(prompt: Prompt<any>, context: SerializerContext): Serialized {
    const data: any = { ...prompt };
    return {
      ...data,
      _type: prompt.constructor.name,
    };
  }

  public deserialize(data: Serialized, context: SerializerContext): Prompt<any> {
    const constructorClass = this.prompts.find(p => p.name === data._type);
    if (constructorClass === undefined) {
      throw new GameError(GameMessage.SERIALIZER_ERROR, `Unknown prompt type '${data._type}'.`);
    }
    const prompt = Object.create(constructorClass.prototype);
    delete data._type;
    return Object.assign(prompt, data);
  }

}
