import {
  AttackAction,
  CardType,
  ResolvePromptAction,
  State,
  Simulator
} from "@ptcg/common";

import { Butterfree } from "../../../src/base-sets/set-jungle/butterfree";
import { TestPokemon } from "../../test-cards/test-pokemon";
import { TestUtils } from "../../test-utils";

describe('Butterfree JU', () => {
  let sim: Simulator;
  let state: State;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
    state = sim.store.state;

    TestUtils.setActive(
      sim,
      [ new Butterfree() ],
      [ CardType.GRASS, CardType.GRASS, CardType.GRASS, CardType.GRASS ]
    );
  });

  it('Should use Whirlwind', () => {
    const { opponent, prompts } = TestUtils.getAll(sim);
    const opponentActive = opponent.active.pokemons.cards[0];
    const opponentBenched = new TestPokemon();
    opponent.bench[0].pokemons.cards = [ opponentBenched ];
    const ids = TestUtils.setCardIds(sim);  // to better compare which card is which

    // attack
    sim.dispatch(new AttackAction(1, 'Whirlwind'));
    expect(prompts.length).toEqual(1);
    expect(prompts[0].type).toEqual('Choose pokemon');

    // opponent chooses benched
    sim.dispatch(new ResolvePromptAction(prompts[0].id, [opponent.bench[0]]));
    expect(state.turn).toEqual(1);
    expect(state.activePlayer).toEqual(1);
    expect(opponent.active.pokemons.cards[0]).toBe(opponentBenched);
    expect(opponent.active.damage).toEqual(0);
    expect(opponent.bench[0].pokemons.cards[0]).toBe(opponentActive);
    expect(opponent.bench[0].damage).toEqual(20);
    expect(TestUtils.getCardIds(sim)).toEqual(ids); // check if no cards missing
  });

  it('Should use Whirlwind - empty bench', () => {
    const { opponent, prompts } = TestUtils.getAll(sim);
    const ids = TestUtils.setCardIds(sim);  // to better compare which card is which

    // attack
    sim.dispatch(new AttackAction(1, 'Whirlwind'));
    expect(prompts.length).toEqual(0);

    // opponent chooses benched
    expect(state.turn).toEqual(1);
    expect(state.activePlayer).toEqual(1);
    expect(opponent.active.damage).toEqual(20);
    expect(TestUtils.getCardIds(sim)).toEqual(ids); // check if no cards missing
  });

  it('Should use Mega Drain', () => {
    const { opponent, active, prompts } = TestUtils.getAll(sim);
    active.damage = 60;

    // attack
    sim.dispatch(new AttackAction(1, 'Mega Drain'));
    expect(prompts.length).toEqual(0);

    // opponent chooses benched
    expect(state.turn).toEqual(1);
    expect(state.activePlayer).toEqual(1);
    expect(opponent.active.damage).toEqual(40);
    expect(active.damage).toEqual(40);
  });
});
