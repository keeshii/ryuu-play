import { State, Player, ResolvePromptAction, GameMessage, PokemonCardList,
  PutDamagePrompt, PlayerType, SlotType, PokemonCard, DamageMap} from '../../game';
import { PutDamagePromptResolver } from './put-damage-prompt-resolver';
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

describe('PutDamagePromptResolver', () => {
  let resolver: PutDamagePromptResolver;
  let prompt: PutDamagePrompt;
  let state: State;
  let player: Player;
  let opponent: Player;

  function createSlot(): PokemonCardList {
    const slot = new PokemonCardList();
    slot.cards = [ new TestPokemon() ];
    return slot;
  }

  function createState(): State {
    const s = new State();
    for (let i = 0; i < 2; i ++) {
      const p = new Player();
      p.id = i;
      p.active = createSlot();
      for (let j = 0; j < 5; j++) {
        p.bench.push(createSlot());
      }
      s.players.push(p);
    }
    return s;
  }

  beforeEach(() => {
    const simpleBotOptions = {
      tactics: allSimpleTactics,
      promptResolvers: allPromptResolvers,
      scores: defaultStateScores,
      arbiter: defaultArbiterOptions
    };
    resolver = new PutDamagePromptResolver(simpleBotOptions);

    state = createState();
    player = state.players[0];
    opponent = state.players[1];

    const damageMap: DamageMap[] = [];
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
      damageMap.push({ target, damage: 100 });
    });
    opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
      damageMap.push({ target, damage: 100 });
    });

    prompt = new PutDamagePrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
      PlayerType.TOP_PLAYER,
      [ SlotType.ACTIVE, SlotType.BENCH ],
      20,
      damageMap
    );
  });

  it('Should put two damage counters', () => {
    // given
    opponent.active.damage = 80;
    prompt.damage = 20;
    prompt.options.allowCancel = false;

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;
    const result: DamageMap[] = action.result;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(result).toEqual([{
      target: { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 },
      damage: 20
    }]);
  });

  it('Should put two damage counters on two different targets', () => {
    // given
    opponent.active.damage = 90;
    opponent.bench.length = 1;
    opponent.bench[0].damage = 90;
    prompt.damage = 20;
    prompt.options.allowCancel = false;

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;
    const result: DamageMap[] = action.result;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(result).toEqual([{
      target: { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 },
      damage: 10
    }, {
      target: { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 },
      damage: 10
    }]);
  });

  it('Should put damage on Bench, because Active is blocked', () => {
    // given
    prompt.damage = 20;
    prompt.options.blocked.push({ player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 });
    prompt.options.allowCancel = false;

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;
    const result: DamageMap[] = action.result;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(result[0].target.player).toEqual(PlayerType.TOP_PLAYER);
    expect(result[0].target.slot).toEqual(SlotType.BENCH);
    expect(result[0].damage).toEqual(20);
  });

  it('Should put damage counters on our Pokemons, but we cancel', () => {
    // given
    prompt.playerType = PlayerType.BOTTOM_PLAYER;
    prompt.options.allowCancel = true;

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(action.result).toBeNull();
  });

});
