import {
  AttackAction,
  CardType,
  EnergyMap,
  GameMessage,
  PokemonCard,
  ResolvePromptAction,
  Simulator,
} from "@ptcg/common";
import { CharizardEx } from "../../../src/ex-sets/set-firered-and-leafgreen/charizard-ex";
import { TestPokemonBlockPowers } from "../../test-cards/test-pokemon-block-powers";

import { TestUtils } from "../../test-utils";

describe('Charizard ex RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new CharizardEx()],
      [CardType.WATER, CardType.WATER, CardType.WATER, CardType.WATER, CardType.WATER]
    );
  });

  it('Should use Slash', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Slash'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(50);
  });

  it('Should use Burn Down - discard energies', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Burn Down'));

    // first, the player discards energy from articuno-ex
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose energy',
      playerId: player.id,
      message: GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      cost: [CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE],
      options: jasmine.objectContaining({ allowCancel: false })
    }));

    // Choose an energy to discard
    const selected: EnergyMap[] = player.active.energies.cards.map(c => ({
      card: c,
      provides: [CardType.FIRE]
    }));
    sim.dispatch(new ResolvePromptAction(prompts[0].id, selected));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(200);
    expect(player.active.energies.cards).toEqual([]);
  });

  it('Should use Burn Down - power blocked', () => {
    const { player } = TestUtils.getAll(sim);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemonBlockPowers()]);

    // attack
    let message: string = '';
    try {
      sim.dispatch(new AttackAction(1, 'Burn Down'));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.NOT_ENOUGH_ENERGY);
  });

  it('Should use Burn Down - canceled', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    const energies = player.active.energies.cards.slice();

    // attack
    sim.dispatch(new AttackAction(1, 'Burn Down'));

    // first, the player discards energy from articuno-ex
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose energy',
      playerId: player.id,
      message: GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      cost: [CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE],
      options: jasmine.objectContaining({ allowCancel: false })
    }));

    // cancel, in theory should be an invalid action, but possible
    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(200);
    expect(player.active.energies.cards).toEqual(energies);
  });

  it('Should use Burn Down - ignore weakness and resistance', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    const defending = opponent.active.getPokemonCard() as PokemonCard;
    defending.weakness = [{ type: CardType.FIRE }];
    defending.resistance = [{ type: CardType.FIRE, value: -30 }];

    // attack
    sim.dispatch(new AttackAction(1, 'Burn Down'));

    // first, the player discards energy from articuno-ex
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose energy',
      playerId: player.id,
      message: GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      cost: [CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE],
      options: jasmine.objectContaining({ allowCancel: false })
    }));

    // Choose an energy to discard
    const selected: EnergyMap[] = player.active.energies.cards.map(c => ({
      card: c,
      provides: [CardType.FIRE]
    }));
    sim.dispatch(new ResolvePromptAction(prompts[0].id, selected));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(200);
    expect(player.active.energies.cards).toEqual([]);
  });

});
