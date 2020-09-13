import { SerializerContext, Serialized, Serializer } from "./serializer.interface";

export class GenericSerializer<T extends Object> implements Serializer<T> {

  public types: string[];
  public classes: (new () => T)[];

  constructor(private creatorClass: new () => T, private constructorName: string) {
    this.types = [constructorName];
    this.classes = [creatorClass];
  }

  public serialize(state: T, context: SerializerContext): Serialized {
    const constructorName = this.constructorName;
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
