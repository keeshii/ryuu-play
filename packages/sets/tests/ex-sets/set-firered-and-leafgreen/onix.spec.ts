import {
  AttackAction,
  CardType,
  GameMessage,
  PassTurnAction,
  PokemonSlot,
  ResolvePromptAction,
  Simulator,
  SlotType,
} from '@ptcg/common';

import { Onix } from '../../../src/ex-sets/set-firered-and-leafgreen/onix';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from "../../test-utils";

describe('Diglett RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new Onix()],
      [CardType.FIGHTING, CardType.COLORLESS],
    );
  });

  it('Should use Rock Throw attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Rock Throw'));
 
    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });

  it('Should use Tunneling attack - damage 2 benched', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    opponent.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);
    opponent.bench[1] = TestUtils.pokemonSlot([new TestPokemon()]);

    // attack
    sim.dispatch(new AttackAction(1, 'Tunneling'));
    
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
      slots: [SlotType.BENCH],
      options: jasmine.objectContaining({ min: 0, max: 2, allowCancel: false })
    }));

    // Choose Pokemon
    const selected: PokemonSlot[] = [opponent.bench[0], opponent.bench[1]];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, selected));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.bench[0].damage).toEqual(10);
    expect(opponent.bench[1].damage).toEqual(10);
  });

  it('Should use Tunneling attack when empty bench', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Tunneling'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
  });

  it('Should use Tunneling attack - canceled', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    opponent.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);
    opponent.bench[1] = TestUtils.pokemonSlot([new TestPokemon()]);

    // attack
    sim.dispatch(new AttackAction(1, 'Tunneling'));
    
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
      slots: [SlotType.BENCH],
      options: jasmine.objectContaining({ min: 0, max: 2, allowCancel: false })
    }));

    // Cancel prompt
    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.bench[0].damage).toEqual(0);
    expect(opponent.bench[1].damage).toEqual(0);
  });

  it('Should block attack during the next turn', () => {
    const { player } = TestUtils.getAll(sim);

    // Attack
    sim.dispatch(new AttackAction(1, 'Tunneling'));

    // End opponent's turn
    sim.dispatch(new PassTurnAction(2));

    let message = '';
    try {
      // Try to attack again
      sim.dispatch(new AttackAction(1, 'Rock Throw'));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.BLOCKED_BY_EFFECT);
  });
});
