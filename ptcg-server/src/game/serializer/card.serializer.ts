import { SerializerContext, Serialized, Serializer } from './serializer.interface';
import { Card } from '../store/card/card';
import { GameError } from '../game-error';
import { GameCoreError } from '../game-message';

export class CardSerializer implements Serializer<Card> {

  public readonly types = ['Card'];
  public readonly classes = [Card];

  constructor () { }

  public serialize(card: Card): Serialized {
    const index = card.id;
    if (index === -1) {
      throw new GameError(GameCoreError.ERROR_SERIALIZER, `Card not found '${card.fullName}'.`);
    }

    return { _type: 'Card', index };
  }

  public deserialize(data: Serialized, context: SerializerContext): Card {
    const index: number = data.index;
    const card = context.cards[index];
    if (card === undefined) {
      throw new GameError(GameCoreError.ERROR_SERIALIZER, `Card not found on index '${index}'.`);
    }
    return card;
  }

}
