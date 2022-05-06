import { SerializerContext, Serialized, Serializer } from './serializer.interface';

export class GenericSerializer<T extends Object> implements Serializer<T> {

  public types: string[];
  public classes: (new () => T)[];

  constructor(private creatorClass: new () => T, private constructorName: string) {
    this.types = [constructorName];
    this.classes = [creatorClass];
  }

  public serialize(state: T): Serialized {
    const constructorName = this.constructorName;
    return {
      _type: constructorName,
      ...(state as Object)
    };
  }

  public deserialize(data: Serialized, context: SerializerContext): T {
    const instance = new this.creatorClass();
    delete (data as any)._type;
    return Object.assign(instance, data);
  }

}
