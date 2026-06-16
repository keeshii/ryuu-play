import {
  AttackAction,
  CardType,
  GameMessage,
  PokemonSlot,
  ResolvePromptAction,
  Simulator,
  SlotType,
  SpecialCondition,
} from '@ptcg/common';
import { Squirtle2 } from '../../../src/ex-sets/set-firered-and-leafgreen/squirtle-2';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Squirtle RG-2', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Squirtle2()],
      [CardType.WATER, CardType.COLORLESS]
    );
  });

  it('Should use Bubble and paralyze on heads', () => {
    const { opponent } = TestUtils.getAll(sim);

    TestUtils.setFlipResults(sim, [true]);
    sim.dispatch(new AttackAction(1, 'Bubble'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.PARALYZED]);
  });

  it('Should use Bubble and do nothing on tails', () => {
    const { opponent } = TestUtils.getAll(sim);

    TestUtils.setFlipResults(sim, [false]);
    sim.dispatch(new AttackAction(1, 'Bubble'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    expect(opponent.active.specialConditions).toEqual([]);
  });

  it('Should use Smash Turn and switch with benched Pokémon', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    sim.dispatch(new AttackAction(1, 'Smash Turn'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
      slots: [SlotType.BENCH],
      options: jasmine.objectContaining({ allowCancel: true }),
    }));

    const selected: PokemonSlot[] = [player.bench[0]];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, selected));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot([new TestPokemon()]));
    expect(player.bench[0]).toEqual(TestUtils.pokemonSlot(
      [new Squirtle2()],
      [CardType.WATER, CardType.COLORLESS]
    ));
  });

  it('Should use Smash Turn and cancel swap when choose is canceled', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    sim.dispatch(new AttackAction(1, 'Smash Turn'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
      slots: [SlotType.BENCH],
      options: jasmine.objectContaining({ allowCancel: true }),
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot(
      [new Squirtle2()],
      [CardType.WATER, CardType.COLORLESS]
    ));
    expect(player.bench[0]).toEqual(TestUtils.pokemonSlot([new TestPokemon()]));
  });

  it('Should use Smash Turn without swapping when no benched Pokémon', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Smash Turn'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
  });
});
