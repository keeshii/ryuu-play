import { User } from "../../storage/index";

export class Subscription<T> {

  constructor(
    public user: User,
    public handler: T
  ) { }

}
