import { State, Player, ResolvePromptAction, GameMessage, PokemonCardList,
  MoveDamagePrompt, PlayerType, SlotType, PokemonCard, DamageMap, DamageTransfer} from '../../game';
import { MoveDamagePromptResolver } from './move-damage-prompt-resolver';
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

describe('MoveDamagePromptResolver', () => {
  let resolver: MoveDamagePromptResolver;
  let prompt: MoveDamagePrompt;
  let state: State;
  let player: Player;
  let opponent: Player;

  function createSlot(): PokemonCardList {
    const slot = new PokemonCardList();
    slot.cards = [ new TestPokemon() ];
    return slot;
  }

  function setHp(cardList: PokemonCardList, hp: number): void {
    const pokemonCard = cardList.cards[0] as PokemonCard;
    pokemonCard.hp = hp;
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
    resolver = new MoveDamagePromptResolver(simpleBotOptions);

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

    prompt = new MoveDamagePrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
      PlayerType.TOP_PLAYER,
      [ SlotType.ACTIVE, SlotType.BENCH ],
      damageMap
    );
  });

  it('Should move damage to Active', () => {
    // given
    opponent.bench.length = 1;
    setHp(opponent.active, 110);
    opponent.bench[0].damage = 20;
    prompt.options.allowCancel = true;

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;
    const result: DamageTransfer[] = action.result;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(result).toEqual([{
      from: { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 },
      to: { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 }
    }, {
      from: { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 },
      to: { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 }
    }]);
  });

  it('Should move damage to Bench, because we can\'t cancel prompt', () => {
    // given
    opponent.bench.length = 1;
    setHp(opponent.active, 110);
    opponent.active.damage = 20;
    prompt.options.min = 1;
    prompt.options.allowCancel = false;

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;
    const result: DamageTransfer[] = action.result;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(result).toEqual([{
      from: { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 },
      to: { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 }
    }]);
  });

  it('Should cancel prompt, because damage position is correct', () => {
    // given
    opponent.bench.length = 1;
    setHp(opponent.active, 110);
    opponent.active.damage = 20;
    prompt.options.min = 1;
    prompt.options.allowCancel = true;

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;
    const result: DamageTransfer[] = action.result;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(result).toBeNull();
  });

  it('Should move damage from Player to Opponent', () => {
    // given
    prompt.playerType = PlayerType.ANY;
    player.bench.length = 0;
    opponent.bench.length = 0;
    player.active.damage = 80;
    prompt.options.min = 0;
    prompt.options.max = 3;
    prompt.options.allowCancel = true;

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;
    const result: DamageTransfer[] = action.result;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(result).toEqual([{
      from: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 },
      to: { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 }
    }, {
      from: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 },
      to: { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 }
    }, {
      from: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 },
      to: { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 }
    }]);
  });

  it('Should KO opponent\'s Active and put damage to opponent\'s Bench', () => {
    // given
    prompt.playerType = PlayerType.ANY;
    player.bench.length = 0;
    opponent.bench.length = 1;
    player.active.damage = 60;
    opponent.active.damage = 80;
    prompt.options.min = 0;
    prompt.options.max = 3;
    prompt.options.allowCancel = true;

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;
    const result: DamageTransfer[] = action.result;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(result).toEqual([{
      from: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 },
      to: { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 }
    }, {
      from: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 },
      to: { player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 }
    }, {
      from: { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 },
      to: { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 }
    }]);
  });

});
