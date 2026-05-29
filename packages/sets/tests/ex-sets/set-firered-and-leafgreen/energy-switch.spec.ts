import {
  CardTransfer,
  CardType,
  EnergyType,
  GameMessage,
  PlayCardAction,
  PlayerType,
  ResolvePromptAction,
  Simulator, SlotType, TrainerCard,
} from '@ptcg/common';

import { EnergySwitch } from '../../../src/ex-sets/set-firered-and-leafgreen/energy-switch';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from "../../test-utils";

describe('Energy Switch RG', () => {
  let sim: Simulator;
  let trainerCard: TrainerCard;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
    trainerCard = new EnergySwitch();

    const state = sim.store.state;
    state.players[0].hand.cards = [trainerCard];
  });

  // Move a basic Energy card attached to 1 of your Pokémon to another of your Pokémon.
  it('Should play Energy Switch trainer card', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);

    player.active.energies.cards = TestUtils.makeEnergies([CardType.WATER, CardType.WATER]);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    // play card
    sim.dispatch(new PlayCardAction(1, index, target));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Move energy',
      playerId: player.id,
      message: GameMessage.MOVE_ENERGY_CARDS,
      playerType: PlayerType.BOTTOM_PLAYER,
      slots: [SlotType.ACTIVE, SlotType.BENCH],
      filter: { energyType: EnergyType.BASIC },
      options: jasmine.objectContaining({ min: 1, max: 1, allowCancel: true })
    }));

    const transfers: CardTransfer[] = [{
      from: TestUtils.target(sim, player.active),
      to: TestUtils.target(sim, player.bench[0]),
      card: player.active.energies.cards[0]
    }];

    // Move energies
    sim.dispatch(new ResolvePromptAction(prompts[0].id, transfers));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.hand.cards).toEqual([]);
    expect(player.discard.cards).toEqual([trainerCard]);
    expect(player.active.energies.cards).toEqual(TestUtils.makeEnergies([CardType.WATER]));
    expect(player.bench[0].energies.cards).toEqual(TestUtils.makeEnergies([CardType.WATER]));
  });

  it('Should play Energy Switch - canceled', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);

    player.active.energies.cards = TestUtils.makeEnergies([CardType.WATER, CardType.WATER]);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    // play card
    sim.dispatch(new PlayCardAction(1, index, target));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Move energy',
      playerId: player.id,
      message: GameMessage.MOVE_ENERGY_CARDS,
      playerType: PlayerType.BOTTOM_PLAYER,
      slots: [SlotType.ACTIVE, SlotType.BENCH],
      filter: { energyType: EnergyType.BASIC },
      options: jasmine.objectContaining({ min: 1, max: 1, allowCancel: true })
    }));

    // Move energies
    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.hand.cards).toEqual([trainerCard]);
    expect(player.discard.cards).toEqual([]);
    expect(player.active.energies.cards).toEqual(TestUtils.makeEnergies([CardType.WATER, CardType.WATER]));
    expect(player.bench[0].energies.cards).toEqual(TestUtils.makeEnergies([]));
  });

  it('Should play Energy Switch - no energies', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

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

  it('Should play Energy Switch - no other pokemon', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);
    player.active.energies.cards = TestUtils.makeEnergies([CardType.WATER, CardType.WATER]);

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
