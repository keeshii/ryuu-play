import { Bianca } from "./bianca";
import { Card } from "../../game/store/card/card";
import { Cheren } from "./cheren";
import { Colress } from "./colress";
import { ComputerSearch } from "./computer-search";

export const setBlackAndWhite: Card[] = [
  new Bianca(),
  new Cheren(),
  new Colress(),
  new ComputerSearch()
];
