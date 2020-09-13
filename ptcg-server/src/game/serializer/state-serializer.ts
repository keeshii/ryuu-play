import { GameError, GameMessage } from "../game-error";
import { Serializer, SerializerContext, SerializedState, Serialized } from "./serializer.interface";
import { State } from "../store/state/state";
import { Card } from "../store/card/card";
import { GenericSerializer } from "./generic.serializer";
import { Rules } from "../store/state/rules";
import { Player } from "../store/state/player";
import { CardSerializer } from "./card.serializer";
import { CardListSerializer } from "./card-list.serializer";
import { Marker } from "../store/state/card-marker";
import { StateLogSerializer } from "./state-log.serializer";
import { PromptSerializer } from "./prompt.serializer";
import { PathBuilder } from "./path-builder";
import { deepIterate } from "../../utils";
import { JsonPatch } from "./json-patch";
import { JsonDiff } from "./json-patch.interface";

export class StateSerializer {

  public serializers: Serializer<any>[];
  public static knownCards: Card[] = [];

  constructor() {
    this.serializers = [
      new GenericSerializer(State, 'State'),
      new GenericSerializer(Rules, 'Rules'),
      new GenericSerializer(Player, 'Player'),
      new GenericSerializer(Marker, 'Marker'),
      new CardSerializer(),
      new CardListSerializer(),
      new StateLogSerializer(),
      new PromptSerializer()
    ];
  }

  public serialize(state: State, context: SerializerContext = this.createContext(state)): SerializedState {
    const serializers = this.serializers;
    const refs: { node: Object, path: string }[] = [];
    const pathBuilder = new PathBuilder();

    const replacer: any = function(this: any, key: string, value: any) {
      pathBuilder.goTo(this, key);
      const path = pathBuilder.getPath();

      if (value instanceof Array) {
        return value;
      }
      if (value instanceof Object && value._type !== 'Ref') {
        let ref = refs.find(r => r.node === value);
        if (ref !== undefined) {
          return { _type: 'Ref', path: ref.path };
        }
        refs.push({ node: value, path });
        const name = value.constructor.name;
        if (name === 'Object') {
          return value;
        }
        let serializer = serializers.find(s => s.classes.some(c => value instanceof c));
        if (serializer !== undefined) {
          return serializer.serialize(value, context);
        }
        throw new GameError(GameMessage.SERIALIZER_ERROR, `Unknown serializer for '${name}'.`);
      }
      return value;
    };
    const contextData = { ...context, cards: context.cards.map(card => card.fullName) };
    return JSON.stringify([contextData, state.players, state], replacer);
  }

  public deserialize(serializedState: SerializedState): State {
    const serializers = this.serializers;
    const context = this.restoreContext(serializedState);

    const reviver: any = function (this: any, key: string, value: any) {
      if (value instanceof Array) {
        return value;
      }
      if (value instanceof Object) {
        const name = (value as Serialized)._type;
        if (typeof name === 'string') {
          if (name === 'Ref') {
            return value;
          }
          const serializer = serializers.find(s => s.types.includes(name));
          if (serializer !== undefined) {
            return serializer.deserialize(value, context);
          }
          throw new GameError(GameMessage.SERIALIZER_ERROR, `Unknown deserializer for '${name}'.`);
        }
      }
      return value;
    };

    const parsed = JSON.parse(serializedState, reviver);

    // Restore Refs
    const pathBuilder = new PathBuilder();
    deepIterate(parsed, (holder, key, value) => {
      if (value instanceof Object && value._type === 'Ref') {
        const reference = pathBuilder.getValue(parsed, value.path);
        if (reference === undefined) {
          throw new GameError(GameMessage.SERIALIZER_ERROR, `Unknown reference '${value.path}'.`);
        }
        holder[key] = reference;
      }
    });

    const state = parsed[2];
    return state;
  }

  public serializeDiff(base: SerializedState | undefined, state: State): SerializedState {
    if (base === undefined) {
      return this.serialize(state);
    }
    const parsedBase = JSON.parse(base);

    // compare contexts
    const cards1 = parsedBase[0];
    const context2 = this.createContext(state);
    const cards2 = context2.cards.map(c => c.fullName);

    // different contexts, use standard serialization instead of differencial
    const jsonPatch = new JsonPatch();
    if (jsonPatch.diff(cards1, cards2).length === 0) {
      return this.serialize(state);
    }

    const players1 = parsedBase[1];
    const state1 = parsedBase[2];

    const serialized2 = this.serialize(state, context2);
    const parsed2 = JSON.parse(serialized2);
    const players2 = parsed2[1];
    const state2 = parsed2[2];

    const diff = jsonPatch.diff([players1, state1], [players2, state2]);
    return JSON.stringify([ diff ]);
  }

  public deserializeDiff(base: SerializedState | undefined, data: SerializedState): State {
    if (base === undefined) {
      return this.deserialize(data);
    }

    const parsed = JSON.parse(data);
    if (parsed.length > 1) {
      return this.deserialize(data);
    }

    let [ contextData, players, state ] = JSON.parse(base);
    const diff: JsonDiff[] = parsed[0];

    const jsonPatch = new JsonPatch();
    [ players, state ] = jsonPatch.apply([ players, state ], diff);

    data = JSON.stringify([ contextData, players, state ]);
    return this.deserialize(data);
  }

  public static setKnownCards(cards: Card[]) {
    StateSerializer.knownCards = cards;
  }

  private restoreContext(serializedState: SerializedState): SerializerContext {
    const parsed = JSON.parse(serializedState);
    const contextData = parsed[0];
    const names: string[] = contextData.cards;
    const cards: Card[] = [];
    names.forEach(name => {
      const card = StateSerializer.knownCards.find(c => c.fullName === name);
      if (card === undefined) {
        throw new GameError(GameMessage.SERIALIZER_ERROR, `Unknown card '${name}'.`);
      }
      cards.push(card);
    });
    return { ...contextData, cards };
  }

  private createContext(state: State): SerializerContext {
    const cards: Card[] = [];
    for (let player of state.players) {
      let list: Card[] = [];
      player.stadium.cards.forEach(c => list.push(c));
      player.active.cards.forEach(c => list.push(c));
      for (let bench of player.bench) {
        bench.cards.forEach(c => list.push(c));
      }
      for (let prize of player.prizes) {
        prize.cards.forEach(c => list.push(c));
      }
      player.hand.cards.forEach(c => list.push(c));
      player.deck.cards.forEach(c => list.push(c));
      player.discard.cards.forEach(c => list.push(c));
      list.sort((a, b) => a.fullName < b.fullName
        ? -1 : (a.fullName > b.fullName ? 1 : 0));
      cards.push(...list);
    }
    return { cards };
  }

}
