import { State, Player, ResolvePromptAction, GameMessage, ChooseAttackPrompt,
  PokemonCard, CardType, Attack } from '../../game';
import { ChooseAttackPromptResolver } from './choose-attack-prompt-resolver';
import {
  allSimpleTactics,
  allPromptResolvers,
  defaultStateScores,
  defaultArbiterOptions
} from '../simple-bot-definitions';

class TestPokemon extends PokemonCard {
  name = 'pokemon';
  fullName = 'pokemon';
  set = 'test';
  hp = 100;
}

describe('ChooseAttackPromptResolver', () => {
  let resolver: ChooseAttackPromptResolver;
  let prompt: ChooseAttackPrompt;
  let state: State;
  let player: Player;

  beforeEach(() => {
    const simpleBotOptions = {
      tactics: allSimpleTactics,
      promptResolvers: allPromptResolvers,
      scores: defaultStateScores,
      arbiter: defaultArbiterOptions
    };
    resolver = new ChooseAttackPromptResolver(simpleBotOptions);
    player = new Player();
    state = new State();
    prompt = new ChooseAttackPrompt(
      1,
      GameMessage.CHOOSE_ATTACK_TO_COPY,
      [ new TestPokemon() ]
    );
  });

  it('Should return undefined when other prompt type', () => {
    // given
    const other: any = { };
    // when
    const action = resolver.resolvePrompt(state, player, other);
    // then
    expect(action).toBeUndefined();
  });

  it('Should choose damage with the most damage and cost', () => {
    // given
    prompt.cards[0].attacks = [{
      name: 'Attack 1',
      damage: 10,
      cost: [],
      text: ''
    }, {
      name: 'Attack 2',
      damage: 30,
      cost: [ CardType.COLORLESS ],
      text: ''
    }, {
      name: 'Attack 3',
      damage: 30,
      cost: [],
      text: ''
    }];

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;
    const result: Attack = action.result;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(result).toEqual({
      name: 'Attack 2',
      damage: 30,
      cost: [ CardType.COLORLESS ],
      text: ''
    });
  });

  it('Should not select blocked attacks', () => {
    // given
    prompt.cards[0].attacks = [{
      name: 'Attack 1',
      damage: 100,
      cost: [],
      text: ''
    }, {
      name: 'Attack 2',
      damage: 0,
      cost: [],
      text: ''
    }];
    prompt.options.blocked = [{ index: 0, attack: 'Attack 1' }];

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;
    const result: Attack = action.result;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(result).toEqual({
      name: 'Attack 2',
      damage: 0,
      cost: [],
      text: ''
    });
  });

  it('Should cancel if all attacks are blocked', () => {
    // given
    prompt.cards[0].attacks = [{
      name: 'Attack 1',
      damage: 10,
      cost: [],
      text: ''
    }];
    prompt.options.blocked = [{ index: 0, attack: 'Attack 1' }];

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(action.result).toBeNull();
  });
});
