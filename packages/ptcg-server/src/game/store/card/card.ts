import { SuperType } from './card-types';
import { Effect } from '../effects/effect';
import { State } from '../state/state';
import { StoreLike } from '../store-like';

export abstract class Card {

  public abstract set: string;

  public abstract superType: SuperType;

  public abstract fullName: string;

  public abstract name: string;

  public id: number = -1;

  public tags: string[] = [];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }

}
