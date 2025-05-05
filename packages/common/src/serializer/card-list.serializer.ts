import { SerializerContext, Serialized, Serializer } from './serializer.interface';
import { CardList } from '../store/state/card-list';
import { Card } from '../store/card/card';
import { GameError } from '../game-error';
import { GameCoreError } from '../game-message';
import { PokemonCardList } from '../store/state/pokemon-card-list';

export class CardListSerializer implements Serializer<CardList> {

  public readonly types = ['CardList', 'PokemonCardList'];
  public readonly classes = [CardList, PokemonCardList];

  constructor () { }

  public serialize(cardList: CardList): Serialized {
    const data: any = { ...cardList };
    let constructorName = 'CardList';

    if (cardList instanceof PokemonCardList) {
      constructorName = 'PokemonCardList';
      if (cardList.tool !== undefined) {
        data.tool = cardList.tool.id;
      }
    }

    return {
      ...data,
      _type: constructorName,
      cards: cardList.cards.map(card => card.id)
    };
  }

  public deserialize(data: Serialized, context: SerializerContext): CardList {
    const instance = data._type === 'PokemonCardList'
      ? new PokemonCardList()
      : new CardList();

    delete (data as any)._type;

    if (data.tool !== undefined) {
      data.tool = this.fromIndex(data.tool, context);
    }

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
