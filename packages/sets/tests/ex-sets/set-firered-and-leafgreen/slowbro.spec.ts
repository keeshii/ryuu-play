import {
  AttackAction,
  CardType,
  DamageTransfer,
  GameMessage,
  ResolvePromptAction,
  Simulator,
  SpecialCondition,
  UseAbilityAction,
} from '@ptcg/common';
import { Slowbro } from '../../../src/ex-sets/set-firered-and-leafgreen/slowbro';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestPokemonBlockPowers } from '../../test-cards/test-pokemon-block-powers';
import { TestUtils } from '../../test-utils';

describe('Slowbro RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Slowbro()],
      [CardType.PSYCHIC, CardType.COLORLESS]
    );
  });

  it('Should use Strange Behavior and move damage from another Pokémon to Slowbro', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);
    player.bench[0].damage = 20;

    const target = TestUtils.target(sim, player.active);
    sim.dispatch(new UseAbilityAction(1, 'Strange Behavior', target));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Move damage',
      playerId: player.id,
      message: GameMessage.MOVE_DAMAGE
    }));

    const transfers: DamageTransfer[] = [{
      from: TestUtils.target(sim, player.bench[0]),
      to: TestUtils.target(sim, player.active),
    }, {
      from: TestUtils.target(sim, player.bench[0]),
      to: TestUtils.target(sim, player.active),
    }];

    // Move energies
    sim.dispatch(new ResolvePromptAction(prompts[0].id, transfers));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active.damage).toEqual(20);
    expect(player.bench[0].damage).toEqual(0);
  });

  it('Should use Strange Behavior and cancel', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);
    player.bench[0].damage = 20;

    const target = TestUtils.target(sim, player.active);
    sim.dispatch(new UseAbilityAction(1, 'Strange Behavior', target));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Move damage',
      playerId: player.id,
      message: GameMessage.MOVE_DAMAGE
    }));

    // Move energies
    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active.damage).toEqual(0);
    expect(player.bench[0].damage).toEqual(20);
  });

  it('Should not use Strange Behavior when Slowbro is affected by a Special Condition', () => {
    const { player } = TestUtils.getAll(sim);
    player.active.specialConditions.push(SpecialCondition.ASLEEP);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);
    player.bench[0].damage = 20;
    const target = TestUtils.target(sim, player.active);

    let message = '';
    try {
      sim.dispatch(new UseAbilityAction(1, 'Strange Behavior', target));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.CANNOT_USE_POWER);
    expect(player.active.damage).toEqual(0);
    expect(player.bench[0].damage).toEqual(20);
  });

  it('Should use Psyshock and paralyze on heads', () => {
    const { opponent } = TestUtils.getAll(sim);

    TestUtils.setFlipResults(sim, [true]);
    sim.dispatch(new AttackAction(1, 'Psyshock'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.PARALYZED]);
  });

  it('Should use Psyshock and not paralyze on tails', () => {
    const { opponent } = TestUtils.getAll(sim);

    TestUtils.setFlipResults(sim, [false]);
    sim.dispatch(new AttackAction(1, 'Psyshock'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
    expect(opponent.active.specialConditions).toEqual([]);
  });

  it('Should not use Strange Behavior when blocked by power-blocking Pokémon', () => {
    const { player } = TestUtils.getAll(sim);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);
    player.bench[1] = TestUtils.pokemonSlot([new TestPokemonBlockPowers()]);
    player.bench[0].damage = 20;
    const target = TestUtils.target(sim, player.active);

    let message = '';
    try {
      sim.dispatch(new UseAbilityAction(1, 'Strange Behavior', target));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.BLOCKED_BY_ABILITY);
    expect(player.active.damage).toEqual(0);
    expect(player.bench[0].damage).toEqual(20);
  });

  it('Should not use Strange Behavior when no Pokémon with damage', () => {
    const { player } = TestUtils.getAll(sim);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);
    const target = TestUtils.target(sim, player.active);

    let message = '';
    try {
      sim.dispatch(new UseAbilityAction(1, 'Strange Behavior', target));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.CANNOT_USE_POWER);
    expect(player.active.damage).toEqual(0);
    expect(player.bench[0].damage).toEqual(0);
  });

  it('Should not use Strange Behavior when Slowbro has no HP left', () => {
    const { player } = TestUtils.getAll(sim);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);
    player.active.damage = 50;
    player.bench[0].damage = 20;
    const target = TestUtils.target(sim, player.active);

    let message = '';
    try {
      sim.dispatch(new UseAbilityAction(1, 'Strange Behavior', target));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.CANNOT_USE_POWER);
    expect(player.active.damage).toEqual(50);
    expect(player.bench[0].damage).toEqual(20);
  });
});
