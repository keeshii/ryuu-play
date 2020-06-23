import { SuperType } from "./card-types";
import { Effect } from "../effects/effect";
import { State } from "../state/state";
import { StoreLike } from "../store-like";

export abstract class Card {

  public abstract superType: SuperType;

  public abstract fullName: string;

  public abstract name: string;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }

}
