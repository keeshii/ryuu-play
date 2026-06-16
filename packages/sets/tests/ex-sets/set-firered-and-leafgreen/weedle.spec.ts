import {
  AttackAction,
  CardType,
  GameMessage,
  ResolvePromptAction,
  Simulator,
  SpecialCondition,
} from '@ptcg/common';

import { Weedle } from '../../../src/ex-sets/set-firered-and-leafgreen/weedle';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from "../../test-utils";

class GrassPokemon extends TestPokemon {
  public cardTypes = [ CardType.GRASS ];
}

describe('Weedle RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new Weedle()],
      [CardType.GRASS],
    );
  });

  // Call for Family () - Search your deck for up to 2 Grass Basic Pokémon and put them onto your Bench. Shuffle
  // your deck afterward.
  it('Should use Call for Family and put up to 2 Basic Pokémon onto the Bench', () => {
    const { player, opponent, prompts } = TestUtils.getAll(sim);
    const basic1 = new GrassPokemon();
    const basic2 = new GrassPokemon();

    player.deck.cards = [basic1, basic2];

    sim.dispatch(new AttackAction(1, 'Call for Family'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
      cards: player.deck,
      options: jasmine.objectContaining({ min: 0, max: 2, allowCancel: true })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, [basic1, basic2]));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.bench[0].pokemons.cards).toEqual([basic1]);
    expect(player.bench[1].pokemons.cards).toEqual([basic2]);
    expect(player.deck.cards).toEqual([]);
  });

  it('Should use Call for Family and cancel the search prompt', () => {
    const { player, opponent, prompts } = TestUtils.getAll(sim);
    player.deck.cards = [new GrassPokemon()];

    sim.dispatch(new AttackAction(1, 'Call for Family'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
      cards: player.deck,
      options: jasmine.objectContaining({ min: 0, max: 2, allowCancel: true })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.bench[0].pokemons.cards).toEqual([]);
  });

  // Poison Spurt () - Discard a Grass Energy card attached to Weedle. The Defending Pokémon is now Poisoned.
  it('Should use Poison Spurt attack', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Poison Spurt'));

    // Choose energy prompt
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose energy',
      playerId: player.id,
      message: GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      cost: [CardType.GRASS],
      options: jasmine.objectContaining({ allowCancel: false })
    }));

    // Choose card
    const energyMap = [{ card: player.active.energies.cards[0], provides: [CardType.GRASS] }];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, energyMap));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.energies.cards).toEqual([]);
    expect(opponent.active.damage).toEqual(10);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.POISONED]);
  });

  it('Should use Poison Spurt attack and cancel prompt', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Poison Spurt'));

    // Choose energy prompt
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose energy',
      playerId: player.id,
      message: GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      cost: [CardType.GRASS],
      options: jasmine.objectContaining({ allowCancel: false })
    }));

    // Choose card
    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.energies.cards).toEqual(TestUtils.makeEnergies([CardType.GRASS]));
    expect(opponent.active.damage).toEqual(10);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.POISONED]);
  });

});
