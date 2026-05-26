import {
  CardType,
  GameMessage,
  PlayCardAction,
  PlayerType,
  PokemonSlot,
  ResolvePromptAction,
  Simulator, SlotType, TrainerCard,
} from '@ptcg/common';

import { EnergyRemoval2 } from '../../../src/ex-sets/set-firered-and-leafgreen/energy-removal-2';
import { TestUtils } from "../../test-utils";

describe('Energy Removal 2 RG', () => {
  let sim: Simulator;
  let trainerCard: TrainerCard;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
    trainerCard = new EnergyRemoval2();

    const state = sim.store.state;
    state.players[0].hand.cards = [trainerCard];
  });

  // Flip a coin. If heads, choose 1 Energy card attached to 1 of your opponent's Pokémon and discard it.
  it('Should play Energy Removal 2', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);
    opponent.active.energies.cards = TestUtils.makeEnergies([CardType.COLORLESS]);
    TestUtils.setFlipResults(sim, [true]);

    // play card
    sim.dispatch(new PlayCardAction(1, index, target));

    expect(prompts.length).toEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
      playerType: PlayerType.TOP_PLAYER,
      slots: [SlotType.ACTIVE, SlotType.BENCH],
      options: jasmine.objectContaining({ allowCancel: false, blocked: [] })
    }));

    // Choose Pokemon
    const selected: PokemonSlot[] = [opponent.active];
    sim.dispatch(new ResolvePromptAction(prompts[1].id, selected));

    // Choose card prompt
    expect(prompts.length).toEqual(3);
    expect(prompts[2]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_DISCARD,
      cards: opponent.active.energies,
      options: jasmine.objectContaining({ min: 1, max: 1, allowCancel: false })
    }));

    // Choose card
    sim.dispatch(new ResolvePromptAction(prompts[2].id, [opponent.active.energies.cards[0]]));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.discard.cards).toEqual([trainerCard]);
    expect(opponent.active.energies.cards).toEqual([]);
    expect(opponent.discard.cards).toEqual(TestUtils.makeEnergies([CardType.COLORLESS]));
  });

  it('Should play Energy Removal 2 - no pokemon selected', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);
    opponent.active.energies.cards = TestUtils.makeEnergies([CardType.COLORLESS]);
    TestUtils.setFlipResults(sim, [true]);

    // play card
    sim.dispatch(new PlayCardAction(1, index, target));

    // Choose Pokemon
    expect(prompts.length).toEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
      playerType: PlayerType.TOP_PLAYER,
      slots: [SlotType.ACTIVE, SlotType.BENCH],
      options: jasmine.objectContaining({ allowCancel: false, blocked: [] })
    }));

    // cancel, illegal action
    sim.dispatch(new ResolvePromptAction(prompts[1].id, null));

    // No more prompts

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.discard.cards).toEqual([trainerCard]);
    expect(opponent.active.energies.cards).toEqual(TestUtils.makeEnergies([CardType.COLORLESS]));
    expect(opponent.discard.cards).toEqual([]);
  });

  it('Should play Energy Removal 2 - tails', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);
    opponent.active.energies.cards = TestUtils.makeEnergies([CardType.COLORLESS]);
    TestUtils.setFlipResults(sim, [false]);

    // play card
    sim.dispatch(new PlayCardAction(1, index, target));

    // No prompts

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.discard.cards).toEqual([trainerCard]);
    expect(opponent.active.energies.cards).toEqual(TestUtils.makeEnergies([CardType.COLORLESS]));
    expect(opponent.discard.cards).toEqual([]);
  });

  it('Should play Energy Removal 2 - opponent no energies', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);

    let message = ''
    try {
      // play card
      sim.dispatch(new PlayCardAction(1, index, target));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.CANNOT_PLAY_THIS_CARD);
  });

});
