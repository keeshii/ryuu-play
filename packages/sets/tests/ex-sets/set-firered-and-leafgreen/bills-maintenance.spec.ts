import {
  CardList,
  CardType,
  GameMessage,
  PlayCardAction,
  ResolvePromptAction,
  Simulator
} from "@ptcg/common";
import { BillsMaintenance } from "../../../src/ex-sets/set-firered-and-leafgreen/bills-maintenance";
import { TestCard } from "../../test-cards/test-card";
import { TestEnergy } from "../../test-cards/test-energy";

import { TestUtils } from "../../test-utils";

describe('Bill\'s Maintenance RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
    const state = sim.store.state;

    state.players[0].hand.cards = [
      new BillsMaintenance()
    ];
  });

  it('Should play Bills Maintenance - with empty hand', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);

    // attack
    const index = player.hand.cards.findIndex(c => c.name === 'Bill\'s Maintenance');

    let message: string = '';
    try {
      sim.dispatch(new PlayCardAction(1, index, target));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.CANNOT_PLAY_THIS_CARD);
  });

  it('Should play Bills Maintenance - canceled', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const handWithoutBill = new CardList();

    // hand
    player.hand.cards = [
      new BillsMaintenance(),
      new TestCard()
    ];
    handWithoutBill.cards = player.hand.cards.slice(1); // without first card
    sim.dispatch(new PlayCardAction(1, 0, target));

    // choose card to deck
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_DECK,
      cards: handWithoutBill
    }));

    // Cancel prompt
    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    // Cart still in hand, no supported played
    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.hand.cards).toEqual([
      new BillsMaintenance(),
      new TestCard()
    ]);
    expect(player.supporter.cards).toEqual([]);
  });

  it('Should play Bills Maintenance - played', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const handWithoutBill = new CardList();

    // hand
    player.hand.cards = [
      new BillsMaintenance(),
      new TestCard()
    ];
    player.deck.cards = TestUtils.makeEnergies([CardType.GRASS, CardType.FIRE, CardType.WATER]);
    handWithoutBill.cards = player.hand.cards.slice(1); // without first card
    sim.dispatch(new PlayCardAction(1, 0, target));

    // choose card to deck
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_DECK,
      cards: handWithoutBill
    }));

    // Cancel prompt
    sim.dispatch(new ResolvePromptAction(prompts[0].id, [handWithoutBill.cards[0]]));

    // Cart still in hand, no supported played
    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.hand.cards).toEqual([
      new TestCard(),
      new TestEnergy(CardType.WATER),
      new TestEnergy(CardType.FIRE)
    ]);
    expect(player.supporter.cards).toEqual([new BillsMaintenance()]);
    expect(player.deck.cards).toEqual([new TestEnergy(CardType.GRASS)]);
  });

});
