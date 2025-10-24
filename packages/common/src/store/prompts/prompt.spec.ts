import { Prompt } from './prompt';
import { State } from '../state/state';

class TestPrompt extends Prompt<string> {
  type: string = 'TEST_PROMPT';
}

describe('Prompt', () => {
  let playerId: number;
  let prompt: TestPrompt;
  let state: State;

  beforeEach(() => {
    playerId = 1;
    prompt = new TestPrompt(playerId);
    state = new State();
  });

  it('should initialize with correct playerId and default id', () => {
    expect(prompt.playerId).toBe(playerId);
    expect(prompt.id).toBe(0);
    expect(prompt.result).toBeUndefined();
  });

  it('should decode result without modification by default', () => {
    const result = 'test result';
    expect(prompt.decode(result, state)).toBe(result);
  });

  it('should validate any result as true by default', () => {
    const result = 'test result';
    expect(prompt.validate(result, state)).toBe(true);
    expect(prompt.validate(null, state)).toBe(true);
  });

});