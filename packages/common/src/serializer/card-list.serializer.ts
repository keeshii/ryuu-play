import { SerializerContext, Serialized, Serializer } from './serializer.interface';
import { CardList } from '../store/state/card-list';
import { Card } from '../store/card/card';
import { GameError } from '../game-error';
import { GameCoreError } from '../game-message';

export class CardListSerializer implements Serializer<CardList> {

  public readonly types = ['CardList'];
  public readonly classes = [CardList];

  constructor () { }

  public serialize(cardList: CardList): Serialized {
    const data: any = { ...cardList };
    const constructorName = 'CardList';

    return {
      ...data,
      _type: constructorName,
      cards: cardList.cards.map(card => card.id)
    };
  }

  public deserialize(data: Serialized, context: SerializerContext): CardList {
    const instance = new CardList();

    delete (data as any)._type;

    const indexes: number[] = data.cards;
    data.cards = indexes.map(index => this.fromIndex(index, context));

    return Object.assign(instance, data);
  }

  private fromIndex(index: number, context: SerializerContext): Card {
    const card = context.cards[index];
    if (card === undefined) {
      throw new GameError(GameCoreError.ERROR_SERIALIZER, `Card not found on index '${index}'.`);
    }
    return card;
  }

}
