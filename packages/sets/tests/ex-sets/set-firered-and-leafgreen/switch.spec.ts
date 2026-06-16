import {
  GameMessage,
  PlayCardAction,
  ResolvePromptAction,
  Simulator,
  SlotType,
  TrainerCard,
} from '@ptcg/common';
import { Switch } from '../../../src/ex-sets/set-firered-and-leafgreen/switch';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Switch RG', () => {
  let sim: Simulator;
  let trainerCard: TrainerCard;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
    trainerCard = new Switch();

    const state = sim.store.state;
    state.players[0].hand.cards = [trainerCard];
  });

  it('Should play Switch and switch with a Benched Pokémon', () => {
    const { player } = TestUtils.getAll(sim);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);
    const active = player.active;
    const benched = player.bench[0];
    TestUtils.setCardIds(sim);

    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);

    sim.dispatch(new PlayCardAction(1, index, target));

    const { prompts } = TestUtils.getAll(sim);
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_SWITCH,
      slots: [SlotType.BENCH],
      options: jasmine.objectContaining({ allowCancel: true })
    }));

    const selected = [player.bench[0]];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, selected));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.discard.cards).toEqual([trainerCard]);
    expect(player.active).toEqual(benched);
    expect(player.bench[0]).toEqual(active);
  });

  it('Should play Switch and cancel (trainer not discarded)', () => {
    const { player } = TestUtils.getAll(sim);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);
    const active = player.active;
    const benched = player.bench[0];
    TestUtils.setCardIds(sim);

    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);

    sim.dispatch(new PlayCardAction(1, index, target));

    const { prompts } = TestUtils.getAll(sim);
    expect(prompts.length).toEqual(1);

    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.hand.cards).toEqual([trainerCard]);
    expect(player.active).toEqual(active);
    expect(player.bench[0]).toEqual(benched);
  });

  it('Should not play Switch when there is no Benched Pokémon', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);

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
