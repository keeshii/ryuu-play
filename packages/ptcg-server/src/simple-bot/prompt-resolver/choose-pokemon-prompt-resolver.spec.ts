import { State, Player, ResolvePromptAction, GameMessage, ChoosePokemonPrompt,
  PokemonCard, PokemonCardList, PlayerType, SlotType } from '../../game';
import { ChoosePokemonPromptResolver } from './choose-pokemon-prompt-resolver';
import {
  allSimpleTactics,
  allPromptResolvers,
  defaultStateScores,
  defaultArbiterOptions
} from '../simple-bot-definitions';

class TestPokemon extends PokemonCard {
  name = 'energy';
  fullName = 'energy';
  set = 'test';
  hp = 100;
  constructor (name: string) {
    super();
    this.name = name;
  }
}

describe('ChoosePokemonPromptResolver', () => {
  let resolver: ChoosePokemonPromptResolver;
  let prompt: ChoosePokemonPrompt;
  let state: State;
  let player: Player;
  let opponent: Player;

  function createSlot(): PokemonCardList {
    const slot = new PokemonCardList();
    slot.cards = [ new TestPokemon('Test') ];
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
    resolver = new ChoosePokemonPromptResolver(simpleBotOptions);    

    state = createState();
    player = state.players[0];
    opponent = state.players[1];

    prompt = new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS,
      PlayerType.BOTTOM_PLAYER,
      [ SlotType.ACTIVE, SlotType.BENCH ]
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

  it('Should choose the strongest Pokemon', () => {
    // given
    setHp(player.bench[2], 150);
    prompt.options.min = 1;
    prompt.options.max = 1;

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;
    const result: PokemonCardList[] = action.result;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(result).toEqual([player.bench[2]]);
  });

  it('Should choose the weakest Pokemon for the opponent', () => {
    // given
    setHp(opponent.bench[2], 50);
    prompt.playerType = PlayerType.TOP_PLAYER;
    prompt.options.min = 1;
    prompt.options.max = 1;
    prompt.options.allowCancel = false;

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;
    const result: PokemonCardList[] = action.result;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(result).toEqual([opponent.bench[2]]);
  });

  it('Should choose the weakest Pokemon to deal damage', () => {
    // given
    setHp(player.bench[2], 50);
    prompt.options.min = 1;
    prompt.options.max = 1;
    prompt.options.allowCancel = false;
    prompt.message = GameMessage.CHOOSE_POKEMON_TO_DAMAGE;

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;
    const result: PokemonCardList[] = action.result;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(result).toEqual([player.bench[2]]);
  });

  it('Should choose the strongest opponent\'s Pokemon to deal damage', () => {
    // given
    setHp(player.bench[2], 200);
    setHp(player.bench[3], 50);
    setHp(opponent.bench[2], 150);
    prompt.playerType = PlayerType.ANY;
    prompt.options.min = 1;
    prompt.options.max = 1;
    prompt.message = GameMessage.CHOOSE_POKEMON_TO_DAMAGE;

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;
    const result: PokemonCardList[] = action.result;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(result).toEqual([opponent.bench[2]]);
  });

  it('Should cancel instead of dealing damage to own Pokemon', () => {
    // given
    setHp(player.bench[2], 50);
    prompt.options.min = 1;
    prompt.options.max = 1;
    prompt.message = GameMessage.CHOOSE_POKEMON_TO_DAMAGE;

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(action.result).toBeNull();
  });

  it('Should not choose blocked Pokemon', () => {
    // given
    setHp(player.bench[0], 250);
    setHp(player.bench[1], 200);
    setHp(player.bench[2], 150);
    prompt.options.min = 1;
    prompt.options.max = 2;
    prompt.options.blocked = [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 1 }];

    // when
    const action = resolver.resolvePrompt(state, player, prompt) as ResolvePromptAction;
    const result: PokemonCardList[] = action.result;

    // then
    expect(action instanceof ResolvePromptAction).toBeTruthy();
    expect(result.length).toEqual(2);
    expect(result.includes(player.bench[0])).toBeTruthy();
    expect(result.includes(player.bench[2])).toBeTruthy();
  });


});
