import {
  AttackAction,
  CardTransfer,
  CardType,
  GameMessage,
  PlayerType,
  ResolvePromptAction,
  Simulator,
  SlotType,
  SpecialCondition,
  UseAbilityAction,
} from '@ptcg/common';
import { VenusaurEx } from '../../../src/ex-sets/set-firered-and-leafgreen/venusaur-ex';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Venusaur ex RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new VenusaurEx()],
      [CardType.GRASS, CardType.GRASS, CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS]
    );
  });

  it('Should use Energy Trans to move Grass energy between Pokémon', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim, player.active);

    // Add a Pokémon to the bench
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    sim.dispatch(new UseAbilityAction(1, 'Energy Trans', target));

    // All energies except GRASS should be blocked
    const blockedMap = [{
      source: TestUtils.target(sim, player.active),
      blocked: [3, 4]
    }];

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Move energy',
      playerId: player.id,
      playerType: PlayerType.BOTTOM_PLAYER,
      slots: [ SlotType.ACTIVE, SlotType.BENCH ],
      message: GameMessage.MOVE_ENERGY_CARDS,
      options: jasmine.objectContaining({ allowCancel: true, blockedMap })
    }));

    const transfers: CardTransfer[] = [{
      from: TestUtils.target(sim, player.active),
      to: TestUtils.target(sim, player.bench[0]),
      card: player.active.energies.cards[0]
    }];

    // Move energies
    sim.dispatch(new ResolvePromptAction(prompts[0].id, transfers));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active.energies.cards).toEqual(TestUtils.makeEnergies(
      [CardType.GRASS, CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS]));
    expect(player.bench[0]).toEqual(TestUtils.pokemonSlot([new TestPokemon()], [CardType.GRASS]));
  });

  it('Should use Energy Trans but cancel', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim, player.active);

    // Add a Pokémon to the bench
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    sim.dispatch(new UseAbilityAction(1, 'Energy Trans', target));
    // Note: Energy Trans uses a custom implementation; here we verify the power can be used

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Move energy',
      playerId: player.id,
      playerType: PlayerType.BOTTOM_PLAYER,
      slots: [ SlotType.ACTIVE, SlotType.BENCH ],
      message: GameMessage.MOVE_ENERGY_CARDS,
      options: jasmine.objectContaining({ allowCancel: true })
    }));

    // Move energies
    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active.energies.cards).toEqual(TestUtils.makeEnergies(
      [CardType.GRASS, CardType.GRASS, CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS]));
    expect(player.bench[0]).toEqual(TestUtils.pokemonSlot([new TestPokemon()]));
  });

  it('Should not allow Energy Trans when Venusaur ex has special conditions', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim, player.active);

    player.active.specialConditions.push(SpecialCondition.POISONED);

    let message: string = '';
    try {
      sim.dispatch(new UseAbilityAction(1, 'Energy Trans', target));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(message).toEqual(GameMessage.CANNOT_USE_POWER);
  });

  it('Should use Pollen Hazard and apply Poisoned, Burned, and Confused', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Pollen Hazard'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
    expect(opponent.active.specialConditions).toEqual(
      jasmine.arrayContaining([
        SpecialCondition.POISONED,
        SpecialCondition.BURNED,
        SpecialCondition.CONFUSED
      ])
    );
  });

  it('Should use Solarbeam for 90 damage', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Solarbeam'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(90);
  });
});
