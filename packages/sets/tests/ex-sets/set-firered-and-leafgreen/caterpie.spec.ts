import {
  AttackAction,
  CardType,
  GameMessage,
  ResolvePromptAction,
  Simulator,
  SpecialCondition,
} from "@ptcg/common";
import { Butterfree } from "../../../src/ex-sets/set-firered-and-leafgreen/butterfree";
import { Caterpie } from "../../../src/ex-sets/set-firered-and-leafgreen/caterpie";
import { Metapod } from "../../../src/ex-sets/set-firered-and-leafgreen/metapod";

import { TestUtils } from "../../test-utils";

describe('Caterpie RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Caterpie()],
      [CardType.GRASS]
    );
  });

  it('Should use Signs of Evolution - empty deck', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    player.deck.cards = [];

    // attack
    sim.dispatch(new AttackAction(1, 'Signs of Evolution'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
  });

  it('Should use Signs of Evolution - canceled', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Signs of Evolution'));
    
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_HAND,
      cards: player.deck
    }));

    // Cancel prompt
    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
  });

  it('Should use Signs of Evolution - selected', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    const metapod = new Metapod();
    const butterfree = new Butterfree();
    
    player.deck.cards.push(metapod, butterfree);

    // attack
    sim.dispatch(new AttackAction(1, 'Signs of Evolution'));
    
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_HAND,
      cards: player.deck
    }));

    // Select both metapod and butterfree
    sim.dispatch(new ResolvePromptAction(prompts[0].id, [metapod, butterfree]));

    expect(prompts.length).toEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Show cards',
      playerId: opponent.id,
      message: GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards: [metapod, butterfree]
    }));

    // Confirm show cards
    sim.dispatch(new ResolvePromptAction(prompts[1].id, true));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.hand.cards).toEqual([metapod, butterfree]);
  });

  it('Should use String Shot - heads', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'String Shot'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.PARALYZED]);
    expect(opponent.active.damage).toEqual(10);
  });

  it('Should use String Shot - tails', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [false]);

    // attack
    sim.dispatch(new AttackAction(1, 'String Shot'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.specialConditions).toEqual([]);
    expect(opponent.active.damage).toEqual(10);
  });

});
