import { BotArbiter, BotFlipMode, BotShuffleMode } from './bot-arbiter';
import { State, ShuffleDeckPrompt, CoinFlipPrompt, ResolvePromptAction } from '../store';
import { GameCardMessage } from '../game-message';

describe('BotArbiter', () => {
  let state: State;
  let arbiter: BotArbiter;

  beforeEach(() => {
    state = {
      players: [
        { id: 1, deck: { cards: [1, 2, 3, 4, 5] } },
        { id: 2, deck: { cards: [6, 7, 8, 9, 10] } }
      ]
    } as unknown as State;
  });

  it('should resolve shuffle deck prompt with reverse order', () => {
    arbiter = new BotArbiter({ shuffleMode: BotShuffleMode.REVERSE });
    const prompt = new ShuffleDeckPrompt(1);

    const action = arbiter.resolvePrompt(state, prompt) as ResolvePromptAction;

    expect(action).toBeDefined();
    expect(action.result).toEqual([4, 3, 2, 1, 0]);
  });

  it('should resolve shuffle deck prompt with random order', () => {
    arbiter = new BotArbiter({ shuffleMode: BotShuffleMode.RANDOM });
    const prompt = new ShuffleDeckPrompt(1);

    const action = arbiter.resolvePrompt(state, prompt) as ResolvePromptAction;

    expect(action).toBeDefined();
    expect(action.result.sort()).toEqual([0, 1, 2, 3, 4]);
  });

  it('should resolve coin flip prompt with all heads', () => {
    arbiter = new BotArbiter({ flipMode: BotFlipMode.ALL_HEADS });
    const prompt = new CoinFlipPrompt(1, GameCardMessage.COIN_FLIP);

    const action = arbiter.resolvePrompt(state, prompt) as ResolvePromptAction;

    expect(action).toBeDefined();
    expect(action.result).toBe(true);
  });

  it('should resolve coin flip prompt with all tails', () => {
    arbiter = new BotArbiter({ flipMode: BotFlipMode.ALL_TAILS });
    const prompt = new CoinFlipPrompt(1, GameCardMessage.COIN_FLIP);

    const action = arbiter.resolvePrompt(state, prompt) as ResolvePromptAction;

    expect(action).toBeDefined();
    expect(action.result).toBe(false);
  });

  it('should resolve coin flip prompt with random results', () => {
    arbiter = new BotArbiter({ flipMode: BotFlipMode.RANDOM });
    const prompt = new CoinFlipPrompt(1, GameCardMessage.COIN_FLIP);

    const action = arbiter.resolvePrompt(state, prompt) as ResolvePromptAction;

    expect(action).toBeDefined();
    expect(typeof action.result).toBe('boolean');
  });
});