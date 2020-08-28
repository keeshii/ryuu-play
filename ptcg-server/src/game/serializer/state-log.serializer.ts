import { SerializerContext, Serialized, Serializer } from "./serializer.interface";
import { StateLog } from "../store/state/state-log";

export class StateLogSerializer implements Serializer<StateLog> {

  public readonly types = ['StateLog'];

  constructor () { }

  public serialize(stateLog: StateLog, context: SerializerContext): Serialized {
    return {
      ...stateLog,
      _type: stateLog.constructor.name
    };
  }

  public deserialize(data: Serialized, context: SerializerContext): StateLog {
    delete data._type;
    const instance = new StateLog(data.message, data.params, data.client);
    return Object.assign(instance, data);
  }

}
