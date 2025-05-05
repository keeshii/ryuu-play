import { SerializerContext, Serialized, Serializer } from './serializer.interface';
import { StateLog } from '../store/state/state-log';

export class StateLogSerializer implements Serializer<StateLog> {

  public readonly types = ['StateLog'];
  public readonly classes = [StateLog];

  constructor () { }

  public serialize(stateLog: StateLog): Serialized {
    return {
      ...stateLog,
      _type: 'StateLog'
    };
  }

  public deserialize(data: Serialized, context: SerializerContext): StateLog {
    delete (data as any)._type;
    const instance = new StateLog(data.message, data.params, data.client);
    return Object.assign(instance, data);
  }

}
