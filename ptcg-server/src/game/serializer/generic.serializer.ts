import { SerializerContext, Serialized, Serializer } from "./serializer.interface";

export class GenericSerializer<T extends Object> implements Serializer<T> {

  public types: string[];

  constructor(private creatorClass: new () => T) {
    this.types = [creatorClass.name];
  }

  public serialize(state: T, context: SerializerContext): Serialized {
    const constructorName = state.constructor.name;
    return {
      _type: constructorName,
      ...state
    };
  }

  public deserialize(data: Serialized, context: SerializerContext): T {
    const instance = new this.creatorClass();
    delete data._type;
    return Object.assign(instance, data);
  }

}
