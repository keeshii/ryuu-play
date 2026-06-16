import {
  AttackAction,
  CardType,
  GameMessage,
  ResolvePromptAction,
  Simulator,
  SpecialCondition,
} from '@ptcg/common';

import { Paras } from '../../../src/ex-sets/set-firered-and-leafgreen/paras';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Paras RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Paras()],
      [CardType.GRASS, CardType.COLORLESS],
    );
  });

  it('Should use Call for Family and put up to 2 Basic Pokémon onto the Bench', () => {
    const { player, opponent, prompts } = TestUtils.getAll(sim);
    const basic1 = new TestPokemon();
    const basic2 = new TestPokemon();

    player.deck.cards = [basic1, basic2];

    sim.dispatch(new AttackAction(1, 'Call for Family'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
      cards: player.deck,
      options: jasmine.objectContaining({ min: 0, max: 2, allowCancel: true })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, [basic1, basic2]));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.bench[0].pokemons.cards).toEqual([basic1]);
    expect(player.bench[1].pokemons.cards).toEqual([basic2]);
    expect(player.deck.cards).toEqual([]);
  });

  it('Should use Call for Family and cancel the search prompt', () => {
    const { player, opponent, prompts } = TestUtils.getAll(sim);
    player.deck.cards = [new TestPokemon()];

    sim.dispatch(new AttackAction(1, 'Call for Family'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
      cards: player.deck,
      options: jasmine.objectContaining({ min: 0, max: 2, allowCancel: true })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.bench[0].pokemons.cards).toEqual([]);
  });

  it('Should use Toxic Spore and poison the Defending Pokémon on heads', () => {
    const { opponent } = TestUtils.getAll(sim);

    TestUtils.setFlipResults(sim, [true]);

    sim.dispatch(new AttackAction(1, 'Toxic Spore'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.POISONED]);
  });

  it('Should use Toxic Spore and not poison the Defending Pokémon on tails', () => {
    const { opponent } = TestUtils.getAll(sim);

    TestUtils.setFlipResults(sim, [false]);

    sim.dispatch(new AttackAction(1, 'Toxic Spore'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
    expect(opponent.active.specialConditions).toEqual([]);
  });
});
