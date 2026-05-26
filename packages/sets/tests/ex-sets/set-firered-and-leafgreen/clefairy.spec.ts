import {
  AttackAction,
  CardType,
  GameMessage,
  PokemonSlot,
  ResolvePromptAction,
  Simulator,
  SlotType
} from '@ptcg/common';

import { Clefairy } from '../../../src/ex-sets/set-firered-and-leafgreen/clefairy';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from "../../test-utils";

describe('Clefairy RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new Clefairy()],
      [CardType.COLORLESS, CardType.COLORLESS],
    );
  });

  // Gesture () - Choose 1 of your opponent's Benched Pokémon and switch it with the Defending Pokémon. Your
  // opponent chooses the Defending Pokémon to switch.
  it('Should use Gesture attack - no benched', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Gesture'));

    // No prompts

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
  });

  it('Should use Gesture attack - switch', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    opponent.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    // attack
    sim.dispatch(new AttackAction(1, 'Gesture'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_SWITCH,
      slots: [SlotType.BENCH],
      options: jasmine.objectContaining({ allowCancel: false })
    }));

    // Choose Pokemon
    const selected: PokemonSlot[] = [opponent.bench[0]];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, selected));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active).toBe(selected[0]);
  });

  // Moon Kick (20)
  it('Should use Moon Kick attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Moon Kick'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
  });

});
