import {
  AttackAction,
  CardType,
  GameMessage,
  PlayerType,
  ResolvePromptAction,
  Simulator,
  SlotType,
} from '@ptcg/common';

import { Wartortle } from '../../../src/ex-sets/set-firered-and-leafgreen/wartortle';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Wartortle RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Wartortle()],
      [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS]
    );
  });

  // Water Gun (20+) - Does 20 damage plus 10 more damage for each W Energy attached to Wartortle but not used
  // to pay for this attack's Energy cost. You can't add more than 20 damage in this way.
  it('Should use Water Gun attack with no extra energy', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Water Gun'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
  });

  it('Should use Water Gun attack with one extra Water energy', () => {
    const { opponent, player } = TestUtils.getAll(sim);

    player.active.energies.cards = TestUtils.makeEnergies([
      CardType.WATER,
      CardType.WATER,
      CardType.COLORLESS,
      CardType.COLORLESS
    ]);

    sim.dispatch(new AttackAction(1, 'Water Gun'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
  });

  it('Should use Water Gun attack with two extra Water energies', () => {
    const { opponent, player } = TestUtils.getAll(sim);

    player.active.energies.cards = TestUtils.makeEnergies([
      CardType.WATER,
      CardType.WATER,
      CardType.WATER,
      CardType.COLORLESS,
      CardType.COLORLESS
    ]);

    sim.dispatch(new AttackAction(1, 'Water Gun'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(40);
  });

  it('Should use Water Gun attack - cap at 20 bonus damage', () => {
    const { opponent, player } = TestUtils.getAll(sim);

    player.active.energies.cards = TestUtils.makeEnergies([
      CardType.WATER,
      CardType.WATER,
      CardType.WATER,
      CardType.WATER,
      CardType.WATER,
      CardType.COLORLESS,
      CardType.COLORLESS
    ]);

    sim.dispatch(new AttackAction(1, 'Water Gun'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(40);
  });

  // Smash Turn (40) - After your attack, you may switch Wartortle with 1 of your Benched Pokémon.
  it('Should use Smash Turn attack - no benched Pokemon', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Smash Turn'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(40);
  });

  it('Should use Smash Turn attack - cancel switch', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);

    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    sim.dispatch(new AttackAction(1, 'Smash Turn'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
      playerType: PlayerType.BOTTOM_PLAYER,
      slots: [SlotType.BENCH],
      options: jasmine.objectContaining({ allowCancel: true })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(40);
  });

  it('Should use Smash Turn attack - switch to benched Pokemon', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);

    const benched = new TestPokemon();
    player.bench[0] = TestUtils.pokemonSlot([benched]);
    TestUtils.setCardIds(sim);

    const originalActive = player.active.getPokemonCard();

    sim.dispatch(new AttackAction(1, 'Smash Turn'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
      playerType: PlayerType.BOTTOM_PLAYER,
      slots: [SlotType.BENCH],
      options: jasmine.objectContaining({ allowCancel: true })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, [player.bench[0]]));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(40);
    expect(player.active.getPokemonCard()).toEqual(benched);
    expect(player.bench[0].getPokemonCard()).toEqual(originalActive);
  });
});
