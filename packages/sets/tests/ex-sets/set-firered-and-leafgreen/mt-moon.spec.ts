import {
  GameMessage,
  PowerType,
  Simulator,
  UseAbilityAction,
} from "@ptcg/common";
import { MtMoon } from "../../../src/ex-sets/set-firered-and-leafgreen/mt-moon";
import { TestPokemon } from "../../test-cards/test-pokemon";

import { TestUtils } from "../../test-utils";

class TestPokemonWithPowerInPlay extends TestPokemon {
  public powers = [
    {
      name: 'Test Power',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text: 'Does nothing.'
    },
  ];
  constructor(hp: number, powerType: PowerType) {
    super();
    this.hp = hp;
    this.powers[0].powerType = powerType;
  }
}

class TestPokemonWithPowerFromDiscard extends TestPokemon {
  public hp = 60;

  public powers = [
    {
      name: 'Test Power',
      powerType: PowerType.POKEPOWER,
      useFromDiscard: true,
      text: 'Does nothing.'
    },
  ];
}


describe('Mt. Moon RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
    const state = sim.store.state;

    state.players[0].stadium.cards = [
      new MtMoon()
    ];
  });

  it('Should block PokePower for Pokémon with HP < 70', () => {
    const { player } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [new TestPokemonWithPowerInPlay(60, PowerType.POKEPOWER)]);
    const target = TestUtils.target(sim, player.active);

    let message: string = '';
    try {
      // Use ability
      sim.dispatch(new UseAbilityAction(1, 'Test Power', target));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.BLOCKED_BY_EFFECT);
  });

  it('Should not block powers other than PokePower', () => {
    const { player } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [new TestPokemonWithPowerInPlay(60, PowerType.ABILITY)]);
    const target = TestUtils.target(sim, player.active);

    expect(() => sim.dispatch(new UseAbilityAction(1, 'Test Power', target)))
      .not.toThrow();
  });

  it('Should not block PokePower for Pokémon with HP >= 70', () => {
    const { player } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [new TestPokemonWithPowerInPlay(70, PowerType.POKEPOWER)]);
    const target = TestUtils.target(sim, player.active);

    expect(() => sim.dispatch(new UseAbilityAction(1, 'Test Power', target)))
      .not.toThrow();
  });

  it('Should not block PokePower used from discard', () => {
    const { player } = TestUtils.getAll(sim);
    player.discard.cards = [new TestPokemonWithPowerFromDiscard()];
    const target = TestUtils.target(sim, player.discard);

    sim.dispatch(new UseAbilityAction(1, 'Test Power', target));

    expect(() => sim.dispatch(new UseAbilityAction(1, 'Test Power', target)))
      .not.toThrow();
  });

});
