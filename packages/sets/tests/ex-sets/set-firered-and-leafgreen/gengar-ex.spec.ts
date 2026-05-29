import {
  AttackAction,
  CardType,
  GameMessage,
  ResolvePromptAction,
  Simulator,
  TrainerCard,
  TrainerType
} from '@ptcg/common';

import { GengarEx } from '../../../src/ex-sets/set-firered-and-leafgreen/gengar-ex';
import { TestCard } from '../../test-cards/test-card';
import { TestUtils } from "../../test-utils";

class TestTrainer extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set = 'TEST';
  public name = 'Item';
  public fullName = 'Item TEST';
}

describe('Gengar ex RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new GengarEx()],
      [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
    );
  });

  // Poltergeist (40+) - Look at your opponent's hand. This attack does 40 damage plus 10 more damage for each
  // Trainer card in your opponent's hand.
  it('Should use Poltergeist attack', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    opponent.hand.cards = [ new TestCard(), new TestTrainer(), new TestTrainer() ];

    // attack
    sim.dispatch(new AttackAction(1, 'Poltergeist'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Show cards',
      playerId: player.id,
      message: GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards: [ new TestCard(), new TestTrainer(), new TestTrainer() ]
    }));

    // Confirm show cards
    sim.dispatch(new ResolvePromptAction(prompts[0].id, true));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(60);
  });

  it('Should use Poltergeist attack - empty hand', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Poltergeist'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(40);
  });

  // Prize Count (60+) - If you have more Prize cards left than your opponent, this attack does 60 damage plus 40
  // more damage.
  it('Should use Prize Count attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Prize Count'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(60);
  });

  it('Should use Prize Count attack - more prize than opponent', () => {
    const { opponent } = TestUtils.getAll(sim);
    opponent.prizes[0].cards = [];

    // attack
    sim.dispatch(new AttackAction(1, 'Prize Count'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(100);
  });

});
