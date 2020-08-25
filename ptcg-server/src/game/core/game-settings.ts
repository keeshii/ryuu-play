import { Rules } from "../store/state/rules";

export class GameSettings {

  rules: Rules = new Rules();

  timeLimit: number = 0;

  recordingEnabled: boolean = true;

}
