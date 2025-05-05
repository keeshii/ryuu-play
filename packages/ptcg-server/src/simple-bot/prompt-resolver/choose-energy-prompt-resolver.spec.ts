import { CardType, SuperType, State, Player, ResolvePromptAction, GameMessage } from '../../game';
import { ChooseEnergyPrompt, EnergyMap } from '../../game/store/prompts/choose-energy-prompt';
import { ChooseEnergyPromptResolver } from './choose-energy-prompt-resolver';
import {
  allSimpleTactics,
  allPromptResolvers,
  defaultStateScores,
  defaultArbiterOptions
} from '../simple-bot-definitions';

describe('ChooseEnergyPromptResolver', () => {

  let resolver: ChooseEnergyPromptResolver;
  let prompt: ChooseEnergyPrompt;
  let state: State;
  let player: Player;

  function createEnergy(name: string, provides: CardType[]): EnergyMap {
    const card = { name, superType: SuperType.ENERGY, provides } as any;
    return { card, provides };
  }

  beforeEach(() => {
    const simpleBotOptions = {
      tactics: allSimpleTactics,
      promptResolvers: allPromptResolvers,
      scores: defaultStateScores,
      arbiter: defaultArbiterOptions
    };
    resolver = new ChooseEnergyPromptResolver(simpleBotOptions);    
    prompt = new ChooseEnergyPrompt(1, GameMessage.CHOOSE_CARD_TO_HAND, [], []);
    state = new State();
    player = new Player();
  });

  it('Should choose valid energy cost for [R]', () => {
    // given
    const fire = [ CardType.FIRE ];
    const dce = [ CardType.COLORLESS, CardType.COLORLESS ];

    prompt.cost = [ CardType.FIRE ];
    prompt.energy = [
      createEnergy('fire', fire),
      createEnergy('fire', fire),
      createEnergy('dce', dce)
    ];

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(action.result).toEqual([createEnergy('fire', fire)]);
  });

  it('Should choose valid energy cost for [R] when dce is first', () => {
    // given
    const fire = [ CardType.FIRE ];
    const dce = [ CardType.COLORLESS, CardType.COLORLESS ];

    prompt.cost = [ CardType.FIRE ];
    prompt.energy = [
      createEnergy('dce', dce),
      createEnergy('fire', fire),
      createEnergy('fire', fire)
    ];

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(action.result).toEqual([createEnergy('fire', fire)]);
  });

  it('Should choose valid energy cost for [RRC]', () => {
    // given
    const rainbow = [ CardType.ANY ];
    const fire = [ CardType.FIRE ];
    const dce = [ CardType.COLORLESS, CardType.COLORLESS ];

    prompt.cost = [ CardType.FIRE, CardType.FIRE, CardType.COLORLESS ];
    prompt.energy = [
      createEnergy('dce', dce),
      createEnergy('fire', fire),
      createEnergy('rainbow', rainbow),
      createEnergy('rainbow', rainbow)
    ];

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(action.result).toEqual([
      createEnergy('fire', fire),
      createEnergy('rainbow', rainbow),
      createEnergy('dce', dce)
    ]);
  });

  it('Should choose valid energy cost for [C]', () => {
    // given
    const rainbow = [ CardType.ANY ];
    const fire = [ CardType.FIRE ];
    const dce = [ CardType.COLORLESS, CardType.COLORLESS ];

    prompt.cost = [ CardType.COLORLESS ];
    prompt.energy = [
      createEnergy('dce', dce),
      createEnergy('fire', fire),
      createEnergy('rainbow', rainbow),
      createEnergy('rainbow', rainbow)
    ];

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(action.result).toEqual([
      createEnergy('fire', fire)
    ]);
  });

  it('Should choose valid energy cost for [CC]', () => {
    // given
    const rainbow = [ CardType.ANY ];
    const fire = [ CardType.FIRE ];
    const dce = [ CardType.COLORLESS, CardType.COLORLESS ];

    prompt.cost = [ CardType.COLORLESS, CardType.COLORLESS ];
    prompt.energy = [
      createEnergy('dce', dce),
      createEnergy('fire', fire),
      createEnergy('rainbow', rainbow),
      createEnergy('rainbow', rainbow)
    ];

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(action.result).toEqual([
      createEnergy('dce', dce)
    ]);
  });

  it('Should choose valid energy cost for [WCC]', () => {
    // given
    const rainbow = [ CardType.ANY ];
    const fire = [ CardType.FIRE ];
    const dce = [ CardType.COLORLESS, CardType.COLORLESS ];

    prompt.cost = [ CardType.WATER, CardType.COLORLESS, CardType.COLORLESS ];
    prompt.energy = [
      createEnergy('dce', dce),
      createEnergy('fire', fire),
      createEnergy('rainbow', rainbow),
      createEnergy('rainbow', rainbow)
    ];

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(action.result).toEqual([
      createEnergy('rainbow', rainbow),
      createEnergy('dce', dce)
    ]);
  });

  it('Should choose valid energy cost for [WCC] (impossible to pay)', () => {
    // given
    const fire = [ CardType.FIRE ];
    const dce = [ CardType.COLORLESS, CardType.COLORLESS ];

    prompt.cost = [ CardType.WATER, CardType.COLORLESS, CardType.COLORLESS ];
    prompt.energy = [
      createEnergy('dce', dce),
      createEnergy('fire', fire)
    ];

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(action.result).toEqual(null);
  });

});
