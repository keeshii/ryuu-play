import {
  GameMessage,
  PlayCardAction,
  ResolvePromptAction,
  Simulator,
  TrainerCard,
  TrainerType,
} from '@ptcg/common';

import { VsSeeker } from '../../../src/ex-sets/set-firered-and-leafgreen/vs-seeker';
import { TestCard } from '../../test-cards/test-card';
import { TestUtils } from '../../test-utils';

class TestSupporter extends TrainerCard {
  public trainerType = TrainerType.SUPPORTER;
  public name = 'Test Supporter';
  public fullName  = 'Test Supporter TEST';
  public set = 'TEST'
}

describe('VS Seeker RG', () => {
  let sim: Simulator;
  let trainerCard: TrainerCard;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
    trainerCard = new VsSeeker();

    const state = sim.store.state;
    state.players[0].hand.cards = [trainerCard];
  });

  it('Should play VS Seeker and cancel selection', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);
    player.discard.cards = [new TestSupporter()];

    sim.dispatch(new PlayCardAction(1, index, target));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_HAND,
      cards: player.discard,
      options: jasmine.objectContaining({ min: 1, max: 1, allowCancel: true })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.hand.cards).toEqual([trainerCard]);
    expect(player.discard.cards).toEqual([new TestSupporter()]);
  });

  it('Should play VS Seeker and retrieve a Supporter from discard', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);
    const supporter = new TestSupporter();
    player.discard.cards = [supporter];

    sim.dispatch(new PlayCardAction(1, index, target));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_HAND,
      cards: player.discard,
      options: jasmine.objectContaining({ min: 1, max: 1, allowCancel: true })
    }));

    const selected = [supporter];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, selected));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.hand.cards).toEqual([supporter]);
    expect(player.discard.cards).toEqual([trainerCard]);
  });

  it('Should not play VS Seeker when no supporter in discard', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);
    player.discard.cards = [new TestCard()];

    let message = '';
    try {
      sim.dispatch(new PlayCardAction(1, index, target));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.CANNOT_PLAY_THIS_CARD);
  });

});
