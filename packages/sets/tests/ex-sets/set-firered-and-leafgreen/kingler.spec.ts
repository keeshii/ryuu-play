import {
  AttackAction,
  CardType,
  EnergyType,
  GameMessage,
  ResolvePromptAction,
  Simulator,
  SuperType
} from '@ptcg/common';

import { Kingler } from '../../../src/ex-sets/set-firered-and-leafgreen/kingler';
import { TestUtils } from "../../test-utils";

describe('Kingler RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new Kingler()],
      [CardType.WATER, CardType.COLORLESS],
    );
  });

  // Salt Water () - Search your deck for up to 2 Water Energy cards and attach them to Kingler. Shuffle your deck
  // afterward.
  it('Should use Salt Water attack', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    const activeEnergiesCopy = player.active.energies.cards.slice();
    const deckEnergies = TestUtils.makeEnergies([CardType.WATER, CardType.WATER]);
    player.deck.cards.push(...deckEnergies);

    // attack
    sim.dispatch(new AttackAction(1, 'Salt Water'));

    // Choose card prompt
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_ATTACH,
      cards: player.deck,
      filter: {
        superType: SuperType.ENERGY,
        energyType: EnergyType.BASIC,
        name: 'Water Energy',
      },
      options: jasmine.objectContaining({ min: 0, max: 2, allowCancel: true })
    }));

    // Choose card
    sim.dispatch(new ResolvePromptAction(prompts[0].id, deckEnergies));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    expect(player.active.energies.cards).toEqual([...activeEnergiesCopy, ...deckEnergies]);
  });

  it('Should use Salt Water attack - canceled', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    const activeEnergiesCopy = player.active.energies.cards.slice();

    // attack
    sim.dispatch(new AttackAction(1, 'Salt Water'));

    // Choose card prompt
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_ATTACH,
      cards: player.deck,
      filter: {
        superType: SuperType.ENERGY,
        energyType: EnergyType.BASIC,
        name: 'Water Energy',
      },
      options: jasmine.objectContaining({ min: 0, max: 2, allowCancel: true })
    }));

    // Choose card
    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    expect(player.active.energies.cards).toEqual(activeEnergiesCopy);
  });

  it('Should use Salt Water attack - empty deck', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    const activeEnergiesCopy = player.active.energies.cards.slice();
    player.deck.cards = [];

    // attack
    sim.dispatch(new AttackAction(1, 'Salt Water'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    expect(player.active.energies.cards).toEqual(activeEnergiesCopy);
  });

  // Hyper Pump (30+) - Does 30 damage plus 20 more damage for each basic Energy attached to Kingler but not used
  // to pay for this attack's Energy cost. You can't add more than 40 damage in this way.
  it('Should use Hyper Pump attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Hyper Pump'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
  });

  it('Should use Hyper Pump attack - two additional energies', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    const additionalBasicEnergies = TestUtils.makeEnergies([CardType.FIRE, CardType.GRASS]);
    player.active.energies.cards.push(...additionalBasicEnergies);

    // attack
    sim.dispatch(new AttackAction(1, 'Hyper Pump'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(70);
  });

});
