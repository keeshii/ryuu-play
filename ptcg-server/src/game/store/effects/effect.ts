import { CardList } from "../state/card-list";
import { Card } from "../card/card";
import { GameMessage } from "../../game-error";
import { Player } from "../state/player";

export interface EffectTarget {
  player: Player;
  cardList: CardList;
  card?: Card;
}

export interface Effect {
  readonly type: string;
  canceled?: GameMessage;
  source?: EffectTarget;
  target?: EffectTarget;
}
