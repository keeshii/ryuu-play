import {
  AttackAction,
  CardType,
  GameMessage,
  PassTurnAction,
  PokemonSlot,
  ResolvePromptAction,
  Simulator,
  SlotType,
} from "@ptcg/common";
import { Butterfree } from "../../../src/ex-sets/set-firered-and-leafgreen/butterfree";
import { TestPokemon } from "../../test-cards/test-pokemon";
import { TestPokemonBlockPowers } from "../../test-cards/test-pokemon-block-powers";

import { TestUtils } from "../../test-utils";

describe('Butterfree RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Butterfree()],
      [CardType.COLORLESS, CardType.COLORLESS]
    );
  });

  it('Should use Sooth Dust ability - heal', () => {
    const { opponent, player } = TestUtils.getAll(sim);

    player.active.damage = 10;
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);
    player.bench[0].damage = 20;

    // pass turn
    sim.dispatch(new PassTurnAction(1));

    // heal 10 damage from each Pokemon
    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.damage).toEqual(0);
    expect(player.bench[0].damage).toEqual(10);
  });

  it('Should use Sooth Dust ability - no damaged Pokemon', () => {
    const { opponent, player } = TestUtils.getAll(sim);

    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    // pass turn
    sim.dispatch(new PassTurnAction(1));

    // heal 10 damage from each Pokemon
    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.damage).toEqual(0);
    expect(player.bench[0].damage).toEqual(0);
  });

  it('Should use Sooth Dust ability - ability blocked', () => {
    const { opponent, player } = TestUtils.getAll(sim);

    player.active.damage = 10;
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemonBlockPowers()]);

    // pass turn
    sim.dispatch(new PassTurnAction(1));

    // heal 10 damage from each Pokemon
    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.damage).toEqual(10);
  });

  it('Should use Whirlwind - no benched Pokemon', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Whirlwind'));

    // No prompts

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
  });

  it('Should use Whirlwind - benched Pokemon', () => {
    const { opponent, prompts } = TestUtils.getAll(sim);

    opponent.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    const active = opponent.active;
    const benched = opponent.bench[0];

    // attack
    sim.dispatch(new AttackAction(1, 'Whirlwind'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: opponent.id,
      message: GameMessage.CHOOSE_POKEMON_TO_SWITCH,
      slots: [SlotType.BENCH],
      options: jasmine.objectContaining({ allowCancel: false })
    }));

    // Choose Pokemon
    const selected: PokemonSlot[] = [opponent.bench[0]];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, selected));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
    expect(opponent.active).toBe(benched);
    expect(opponent.bench[0].damage).toEqual(0);
    expect(opponent.bench[0]).toBe(active);
  });

});
