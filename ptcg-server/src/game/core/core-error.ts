import { CoreMessage } from "./core-messages";

export class CoreError extends Error {

  constructor(message: CoreMessage) {
    super(message);
  }

}
