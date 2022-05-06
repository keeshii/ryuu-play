import { Rules } from '../store/state/rules';

export class GameSettings {

  rules: Rules = new Rules();

  timeLimit: number = 1800;

  recordingEnabled: boolean = true;

}
