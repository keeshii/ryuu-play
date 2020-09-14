import { SerializerContext, Serialized, Serializer } from "./serializer.interface";
import { Card } from "../store/card/card";
import { GameError, GameMessage } from "../game-error";

export class CardSerializer implements Serializer<Card> {

  public readonly types = ['Card'];
  public readonly classes = [Card];

  constructor () { }

  public serialize(card: Card, context: SerializerContext): Serialized {
    const index = context.cards.indexOf(card);
    if (index === -1) {
      throw new GameError(GameMessage.SERIALIZER_ERROR, `Card not found '${card.name}'.`);
    }

    return { _type: 'Card', index };
  }

  public deserialize(data: Serialized, context: SerializerContext): Card {
    const index: number = data.index;
    const card = context.cards[index];
    if (card === undefined) {
      throw new GameError(GameMessage.SERIALIZER_ERROR, `Card not found on index '${index}'.`);
    }
    return card;
  }

}
