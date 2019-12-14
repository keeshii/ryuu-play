import { Action } from "./action";
import { Prompt } from "../prompts/prompt";

export class ResolvePromptAction implements Action {

  readonly type: string = 'RESOLVE_PROMPT';

  constructor(public prompt: Prompt<any>) {}

}
