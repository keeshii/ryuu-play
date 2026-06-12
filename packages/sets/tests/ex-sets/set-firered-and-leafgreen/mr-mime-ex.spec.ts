import {
  AttackAction,
  CardType,
  Simulator
} from '@ptcg/common';
import { MrMimeEx } from '../../../src/ex-sets/set-firered-and-leafgreen/mr-mime-ex';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestPokemonBlockPowers } from '../../test-cards/test-pokemon-block-powers';
import { TestUtils } from '../../test-utils';

class TestPokemonStrong30 extends TestPokemon {
  public attacks = [
    {
      name: 'Test attack',
      cost: [],
      damage: '30',
      text: ''
    }
  ];
}

class TestPokemonStrong40 extends TestPokemon {
  public attacks = [
    {
      name: 'Test attack',
      cost: [],
      damage: '40',
      text: ''
    }
  ];
}

describe('Mr. Mime ex RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(sim, [new MrMimeEx()], [CardType.PSYCHIC, CardType.COLORLESS]);
    TestUtils.setDefending(sim, [new TestPokemonStrong30()]);
  });

  it('Should prevent odd damage amounts with Magic Odds', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    TestUtils.setActivePlayer(sim, opponent);

    sim.dispatch(new AttackAction(2, 'Test attack'));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active.damage).toEqual(0);
  });

  it('Should not prevent even damage amounts with Magic Odds', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    TestUtils.setDefending(sim, [new TestPokemonStrong40()]);
    TestUtils.setActivePlayer(sim, opponent);

    sim.dispatch(new AttackAction(2, 'Test attack'));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active.damage).toEqual(40);
  });

  it('Should not prevent damage when Magic Odds is blocked', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemonBlockPowers()]);
    TestUtils.setActivePlayer(sim, opponent);

    sim.dispatch(new AttackAction(2, 'Test attack'));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active.damage).toEqual(30);
  });

  it('Should not prevent damage when Mr. Mime has evolved', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    player.active.pokemons.cards = [new MrMimeEx(), new TestPokemon()];
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemonBlockPowers()]);
    TestUtils.setActivePlayer(sim, opponent);

    sim.dispatch(new AttackAction(2, 'Test attack'));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active.damage).toEqual(30);
  });

  it('Should use Breakdown to place damage counters equal to opponent hand size', () => {
    const { opponent } = TestUtils.getAll(sim);
    opponent.hand.cards = [new TestPokemon(), new TestPokemon(), new TestPokemon()];

    sim.dispatch(new AttackAction(1, 'Breakdown'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
  });
});
