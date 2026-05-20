import {
  AttackAction,
  CardType,
  Simulator,
  SpecialCondition,
} from "@ptcg/common";
import { Beedrill } from "../../../src/ex-sets/set-firered-and-leafgreen/beedrill";

import { TestUtils } from "../../test-utils";

describe('Beedrill RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [ new Beedrill() ],
      [ CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS ]
    );
  });

  it('Should use Poison Sting', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Poison Sting'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.POISONED]);
    expect(opponent.active.damage).toEqual(30);
  });

  it('Should use Link Needle', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Link Needle'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(50);
  });

  it('Should use Link Needle', () => {
    const { player, opponent } = TestUtils.getAll(sim);
    player.bench[0].pokemons.cards = [ new Beedrill() ];
    player.bench[1].pokemons.cards = [ new Beedrill() ];

    // attack
    sim.dispatch(new AttackAction(1, 'Link Needle'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(110);
  });

});
