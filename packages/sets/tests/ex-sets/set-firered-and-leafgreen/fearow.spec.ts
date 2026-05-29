import {
  AttackAction,
  CardType,
  GameMessage,
  PlayerType,
  PokemonSlot,
  ResolvePromptAction,
  RetreatAction,
  Simulator,
  SlotType
} from '@ptcg/common';

import { Fearow } from '../../../src/ex-sets/set-firered-and-leafgreen/fearow';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestPokemonBlockPowers } from '../../test-cards/test-pokemon-block-powers';
import { TestUtils } from "../../test-utils";

describe('Fearow RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
    sim.store.state.turn = 1;

   TestUtils.setActive(
      sim,
      [new Fearow()],
      [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    );
  });

  // Free Flight - If Fearow has no Energy attached to it, Fearow's Retreat Cost is 0.
  it('Should use Free Flight ability', () => {
    const { player } = TestUtils.getAll(sim);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);
    player.active.energies.cards = [];

    // retreat
    sim.dispatch(new RetreatAction(1, 0));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot([new TestPokemon()]));
    expect(player.bench[0]).toEqual(TestUtils.pokemonSlot([new Fearow()]));
  });
  
  it('Should use Free Flight ability - energies attached', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    // retreat
    sim.dispatch(new RetreatAction(1, 0));

    // Choose energy prompt
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose energy',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_SWITCH,
      cost: [CardType.COLORLESS]
    }));

    // Choose card
    const energyMap = [{ card: player.active.energies.cards[0], provides: [ CardType.COLORLESS ] }];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, energyMap));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot([new TestPokemon()]));
    expect(player.bench[0]).toEqual(TestUtils.pokemonSlot(
      [new Fearow()],
      [CardType.COLORLESS, CardType.COLORLESS]
    ));
  });

  it('Should use Free Flight ability - evolved', () => {
    const { player } = TestUtils.getAll(sim);
    const testPokemonWithRetreat = new TestPokemon();
    testPokemonWithRetreat.retreat = [CardType.COLORLESS];
    player.active = TestUtils.pokemonSlot([new Fearow(), testPokemonWithRetreat]);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    let message = ''
    try {
      // retreat
      sim.dispatch(new RetreatAction(1, 0));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.NOT_ENOUGH_ENERGY);
    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot([new Fearow(), testPokemonWithRetreat]));
    expect(player.bench[0]).toEqual(TestUtils.pokemonSlot([new TestPokemon()]));
  });

  it('Should use Free Flight ability - blocked', () => {
    const { player } = TestUtils.getAll(sim);
    player.active.energies.cards = [];
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemonBlockPowers()]);

    let message = ''
    try {
      // retreat
      sim.dispatch(new RetreatAction(1, 0));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.NOT_ENOUGH_ENERGY);
    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot([new Fearow()]));
    expect(player.bench[0]).toEqual(TestUtils.pokemonSlot([new TestPokemonBlockPowers()]));
  });

  // Shot Air (10) - Does 20 damage to 1 of your opponent's Benched Pokémon. (Don't apply Weakness and Resistance
  // for Benched Pokémon.)
  it('Should use Shot Air attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Shot Air'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });

  it('Should use Shot Air attack - with bench', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    opponent.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    // attack
    sim.dispatch(new AttackAction(1, 'Shot Air'));
    
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
      playerType: PlayerType.TOP_PLAYER,
      slots: [SlotType.BENCH],
      options: jasmine.objectContaining({ allowCancel: false })
    }));

    // Choose Pokemon
    const selected: PokemonSlot[] = [opponent.bench[0]];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, selected));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
    expect(opponent.bench[0].damage).toEqual(20);
  });

  it('Should use Shot Air attack - canceled', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    opponent.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    // attack
    sim.dispatch(new AttackAction(1, 'Shot Air'));
    
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
      playerType: PlayerType.TOP_PLAYER,
      slots: [SlotType.BENCH],
      options: jasmine.objectContaining({ allowCancel: false })
    }));

    // Choose Pokemon, illegal action
    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
    expect(opponent.bench[0].damage).toEqual(0);
  });

  // Drill Peck (50)
  it('Should use Drill Peck attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Drill Peck'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(50);
  });

});
