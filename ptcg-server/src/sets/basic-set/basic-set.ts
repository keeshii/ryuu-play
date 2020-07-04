import { Card } from "../../game/store/card/card";
import { WaterEnergy } from "./water-energy";
import { FireEnergy } from "./fire-energy";
import { Buizel } from "./buizel";
import { Sableye } from "./sableye";

export const basicSet: Card[] = [
  new WaterEnergy(),
  new FireEnergy(),
  new Buizel(),
  new Sableye()
];
