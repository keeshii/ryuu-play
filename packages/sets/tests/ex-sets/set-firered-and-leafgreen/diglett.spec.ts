import {
  AttackAction,
  CardType,
  GameMessage,
  PokemonSlot,
  ResolvePromptAction,
  Simulator,
  SlotType,
} from '@ptcg/common';

import { Diglett } from '../../../src/ex-sets/set-firered-and-leafgreen/diglett';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from "../../test-utils";

describe('Diglett RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new Diglett()],
      [CardType.COLORLESS],
    );
  });

  // Dig Under () - Choose 1 of your opponent's Pokémon. This attack does 10 damage to that Pokémon. This attack's
  // damage isn't affected by Weakness or Resistance.
  it('Should use Dig Under attack - active', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Dig Under'));
    
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
      slots: [SlotType.ACTIVE, SlotType.BENCH],
      options: jasmine.objectContaining({ allowCancel: false })
    }));

    // Choose Pokemon
    const selected: PokemonSlot[] = [opponent.active];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, selected));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });

  it('Should use Dig Under attack - benched', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);

    const testPokemon = new TestPokemon();
    testPokemon.weakness = [{ type: CardType.FIGHTING }];
    opponent.bench[0] = TestUtils.pokemonSlot([testPokemon]);

    // attack
    sim.dispatch(new AttackAction(1, 'Dig Under'));
    
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
      slots: [SlotType.ACTIVE, SlotType.BENCH],
      options: jasmine.objectContaining({ allowCancel: false })
    }));

    // Choose Pokemon
    const selected: PokemonSlot[] = [opponent.bench[0]];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, selected));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    expect(opponent.bench[0].damage).toEqual(10);
  });

  it('Should use Dig Under attack - canceled', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Dig Under'));
    
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
      slots: [SlotType.ACTIVE, SlotType.BENCH],
      options: jasmine.objectContaining({ allowCancel: false })
    }));

    // Choose Pokemon (should be blocked)
    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
  });
  
});
