import {
  AttackAction,
  CardType,
  GameMessage,
  PokemonCard,
  RetreatAction,
  Simulator,
} from '@ptcg/common';

import { Dugtrio } from '../../../src/ex-sets/set-firered-and-leafgreen/dugtrio';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from "../../test-utils";

describe('Dugtrio RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new Dugtrio()],
      [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
    );
  });

  // Sonicboom (30) - This attack's damage isn't affected by Weakness or Resistance.
  it('Should use Sonicboom attack', () => {
    const { opponent } = TestUtils.getAll(sim);
    const defending = opponent.active.getPokemonCard() as PokemonCard;
    defending.weakness = [{ type: CardType.FIGHTING }];
    defending.resistance = [{ type: CardType.FIGHTING, value: -30 }];

    // attack
    sim.dispatch(new AttackAction(1, 'Sonicboom'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
  });

  it('Should use Sonicboom attack - not blocks retreat', () => {
    const { opponent } = TestUtils.getAll(sim);
    opponent.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    // attack
    sim.dispatch(new AttackAction(1, 'Sonicboom'));

    // retreat
    sim.dispatch(new RetreatAction(2, 0));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    expect(opponent.bench[0].damage).toEqual(30);
  });

  // Rumble (50) - The Defending Pokémon can't retreat until the end of your opponent's next turn.
  it('Should use Rumble attack', () => {
    const { opponent } = TestUtils.getAll(sim);
    opponent.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    // attack
    sim.dispatch(new AttackAction(1, 'Rumble'));

    let message = ''
    try {
      // retreat
      sim.dispatch(new RetreatAction(2, 0));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(message).toEqual(GameMessage.BLOCKED_BY_EFFECT);
    expect(opponent.active.damage).toEqual(50);
  });

});
