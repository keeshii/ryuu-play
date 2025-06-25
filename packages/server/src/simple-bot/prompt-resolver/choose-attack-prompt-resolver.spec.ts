import { State, Player, ResolvePromptAction, GameMessage, ChooseAttackPrompt,
  PokemonCard, CardType, Attack, PowerType } from '@ptcg/common';
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
      damage: '10',
      cost: [],
      text: ''
    }, {
      name: 'Attack 2',
      damage: '30',
      cost: [ CardType.COLORLESS ],
      text: ''
    }, {
      name: 'Attack 3',
      damage: '30',
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
      damage: '30',
      cost: [ CardType.COLORLESS ],
      text: ''
    });
  });

  it('Should not select blocked attacks', () => {
    // given
    prompt.cards[0].attacks = [{
      name: 'Attack 1',
      damage: '100',
      cost: [],
      text: ''
    }, {
      name: 'Attack 2',
      damage: '',
      cost: [],
      text: ''
    }];
    prompt.options.blocked = [{ index: 0, name: 'Attack 1' }];

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;
    const result: Attack = action.result;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(result).toEqual({
      name: 'Attack 2',
      damage: '',
      cost: [],
      text: ''
    });
  });

  it('Should cancel if all attacks are blocked', () => {
    // given
    prompt.cards[0].attacks = [{
      name: 'Attack 1',
      damage: '10',
      cost: [],
      text: ''
    }];
    prompt.options.blocked = [{ index: 0, name: 'Attack 1' }];

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(action.result).toBeNull();
  });

  it('Should prefer attacks over powers', () => {
    // given
    prompt.cards[0].powers = [{
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      name: 'Power 1',
      text: 'text'
    }];
    prompt.cards[0].attacks = [{
      name: 'Attack 1',
      damage: '10',
      cost: [],
      text: ''
    }];

    prompt.options.enableAbility.useWhenInPlay = true;

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;
    const result: Attack = action.result;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(result).toEqual({
      name: 'Attack 1',
      damage: '10',
      cost: [],
      text: ''
    });
  });

  it('Should choose power, when no attacks available', () => {
    // given
    prompt.cards[0].powers = [{
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      name: 'Power 1',
      text: 'text'
    }];
    prompt.cards[0].attacks = [{
      name: 'Attack 1',
      damage: '10',
      cost: [],
      text: ''
    }];

    prompt.options.enableAttack = false;
    prompt.options.enableAbility.useWhenInPlay = true;

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;
    const result: Attack = action.result;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(result).toEqual({
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      name: 'Power 1',
      text: 'text'
    });
  });

  it('Should choose power with longest text', () => {
    // given
    prompt.cards[0].powers = [{
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      name: 'Power 1',
      text: 'Long text'
    }, {
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      name: 'Power 2',
      text: 'Very long text'
    }, {
      powerType: PowerType.POKEPOWER,
      useFromDiscard: true,
      name: 'Power 3',
      text: 'text'
    }];

    prompt.options.enableAbility.useWhenInPlay = true;

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;
    const result: Attack = action.result;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(result).toEqual({
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      name: 'Power 2',
      text: 'Very long text'
    });
  });

  it('Should not choose blocked power', () => {
    // given
    prompt.cards[0].powers = [{
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      name: 'Power 1',
      text: ''
    }, {
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      name: 'Power 2',
      text: ''
    }];

    prompt.options.enableAbility.useWhenInPlay = true;
    prompt.options.blocked.push({ index: 0, name: 'Power 2' });

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;
    const result: Attack = action.result;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(result).toEqual({
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      name: 'Power 1',
      text: ''
    });
  });

  it('Should choose power triggered from valid source', () => {
    // given
    prompt.cards[0].powers = [{
      powerType: PowerType.POKEPOWER,
      useFromHand: false,
      name: 'Power 1',
      text: ''
    }, {
      powerType: PowerType.POKEPOWER,
      useFromDiscard: true,
      name: 'Power 2',
      text: ''
    }, {
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      name: 'Power 5',
      text: ''
    }];

    prompt.options.enableAbility.useFromHand = true;
    prompt.options.enableAbility.useFromDiscard = true;

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;
    const result: Attack = action.result;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(result).toEqual({
      powerType: PowerType.POKEPOWER,
      useFromDiscard: true,
      name: 'Power 2',
      text: ''
    });
  });

});
