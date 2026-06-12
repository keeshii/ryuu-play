import {
  AttackAction,
  CardType,
  Simulator
} from '@ptcg/common';
import { Metapod } from '../../../src/ex-sets/set-firered-and-leafgreen/metapod';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestPokemonBlockPowers } from '../../test-cards/test-pokemon-block-powers';
import { TestUtils } from '../../test-utils';

class TestPokemonStrong extends TestPokemon {
  public attacks = [
    {
      name: 'Test attack',
      cost: [],
      damage: '50',
      text: ''
    }
  ];
}

describe('Metapod RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Metapod()],
      [CardType.GRASS, CardType.GRASS, CardType.GRASS]
    );
    TestUtils.setDefending(sim, [new TestPokemonStrong()]);
  });

  it('Should reduce damage by up to 30 using Energy Protection', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    TestUtils.setActivePlayer(sim, opponent); // Opponent's turn

    sim.dispatch(new AttackAction(2, 'Test attack'));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active.damage).toEqual(20);
  });

  it('Should not reduce damage when Metapod has evolved', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    player.active.pokemons.cards = [new Metapod(), new TestPokemon()];
    TestUtils.setActivePlayer(sim, opponent); // Opponent's turn

    sim.dispatch(new AttackAction(2, 'Test attack'));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active.damage).toEqual(50);
  });

  it('Should not reduce damage when Energy Protection is blocked', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemonBlockPowers()]);
    TestUtils.setActivePlayer(sim, opponent); // Opponent's turn

    sim.dispatch(new AttackAction(2, 'Test attack'));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active.damage).toEqual(50);
  });

  it('Should use Sharpen - 20 damage', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Sharpen'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
  });
});
