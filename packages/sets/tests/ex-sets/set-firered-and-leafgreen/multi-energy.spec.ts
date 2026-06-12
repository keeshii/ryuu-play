import {
  AttackAction,
  CardType,
  GameMessage,
  Simulator,
} from '@ptcg/common';

import { MultiEnergy } from '../../../src/ex-sets/set-firered-and-leafgreen/multi-energy';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from "../../test-utils";

describe('Multi Energy RG', () => {
  let sim: Simulator;
  let pokemonCard: TestPokemon;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
    pokemonCard = new TestPokemon();
    
    TestUtils.setActive(sim, [pokemonCard]);
  });

  it('Should provide any energy type', () => {
    const { opponent, player } = TestUtils.getAll(sim);

    player.active.energies.cards = [new MultiEnergy()];
    pokemonCard.attacks[0].cost = [CardType.FIRE];

    // Attack
    sim.dispatch(new AttackAction(1, 'Test attack'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });

  it('Should provide only one energy', () => {
    const { player } = TestUtils.getAll(sim);

    player.active.energies.cards = [new MultiEnergy()];
    pokemonCard.attacks[0].cost = [CardType.FIRE, CardType.FIRE];

    let message = '';
    try {
      sim.dispatch(new AttackAction(1, 'Test attack'));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.NOT_ENOUGH_ENERGY);
  });

  it('Should provide C when another special energy attached - fire', () => {
    const { player } = TestUtils.getAll(sim);

    player.active.energies.cards = [new MultiEnergy(), new MultiEnergy()];
    pokemonCard.attacks[0].cost = [CardType.FIRE, CardType.FIRE];

    let message = '';
    try {
      sim.dispatch(new AttackAction(1, 'Test attack'));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.NOT_ENOUGH_ENERGY);
  });

  it('Should provide C when another special energy attached - colorless', () => {
    const { opponent, player } = TestUtils.getAll(sim);

    player.active.energies.cards = [new MultiEnergy(), new MultiEnergy()];
    pokemonCard.attacks[0].cost = [CardType.COLORLESS, CardType.COLORLESS];

    // Attack
    sim.dispatch(new AttackAction(1, 'Test attack'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });

});
