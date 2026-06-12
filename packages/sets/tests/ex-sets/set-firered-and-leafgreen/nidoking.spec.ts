import {
  AttackAction,
  AttackEffect,
  CardType,
  DealDamageEffect,
  Effect,
  GameMessage,
  PassTurnAction,
  PlayerType,
  ResolvePromptAction,
  Simulator,
  SlotType,
  SpecialCondition,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

import { Nidoking } from '../../../src/ex-sets/set-firered-and-leafgreen/nidoking';
import { Nidorino } from '../../../src/ex-sets/set-firered-and-leafgreen/nidorino';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestPokemonBlockPowers } from '../../test-cards/test-pokemon-block-powers';
import { TestUtils } from '../../test-utils';

class NidorinoAttackBench extends Nidorino {
  public attacks = [    {
    name: 'Damage Bench',
    cost: [],
    damage: '',
    text: 'Does 30 damage to Bench.'
  }]
  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.bench.forEach(benched => {
        if (benched.pokemons.cards.length > 0) {
          const dealDamage = new DealDamageEffect(effect, 30);
          dealDamage.target = benched;
          store.reduceEffect(state, dealDamage);
        }
      });
    }

    return state;
  }
}

describe('Nidoking RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Nidoking()],
      [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
    );
  });

  it('Should use Earth Poison attack and poison the Defending Pokémon if it already has damage', () => {
    const { opponent } = TestUtils.getAll(sim);
    opponent.active.damage = 10;

    sim.dispatch(new AttackAction(1, 'Earth Poison'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(60); // 40 + 10 (already there) + 10 (poison)
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.POISONED]);
  });

  it('Should use Earth Poison attack without poisoning when the Defending Pokémon has no damage', () => {
    const { opponent } = TestUtils.getAll(sim);
    opponent.active.damage = 0;

    sim.dispatch(new AttackAction(1, 'Earth Poison'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(40);
    expect(opponent.active.specialConditions).toEqual([]);
  });

  it('Should power up a Nidorino attack while Nidoking is in play', () => {
    const { opponent, player } = TestUtils.getAll(sim);

    TestUtils.setActive(
      sim,
      [new Nidorino()],
      [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    );
    player.bench[0] = TestUtils.pokemonSlot([new Nidoking()]);

    opponent.active.damage = 0;

    sim.dispatch(new AttackAction(1, 'Rend'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(40);
  });

  it('Should not power up a Nidorino attack when powers are blocked', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    opponent.bench[0] = TestUtils.pokemonSlot([new TestPokemonBlockPowers()]);

    TestUtils.setActive(
      sim,
      [new Nidorino()],
      [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    );
    player.bench[0] = TestUtils.pokemonSlot([new Nidoking()]);

    opponent.active.damage = 0;

    sim.dispatch(new AttackAction(1, 'Rend'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
  });

  it('Should not power up a Nidorino attack when Nidoking has evolved', () => {
    const { opponent, player } = TestUtils.getAll(sim);

    TestUtils.setActive(
      sim,
      [new Nidorino()],
      [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    );
    player.bench[0] = TestUtils.pokemonSlot([new Nidoking(), new TestPokemon()]);

    opponent.active.damage = 0;

    sim.dispatch(new AttackAction(1, 'Rend'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
  });

  it('Should not power up a Nidorino attack when damaging opponent\'s bench', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    opponent.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    TestUtils.setActive(
      sim,
      [new NidorinoAttackBench()],
      [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    );
    player.bench[0] = TestUtils.pokemonSlot([new Nidoking()]);

    sim.dispatch(new AttackAction(1, 'Damage Bench'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.bench[0].damage).toEqual(30);
  });

  it('Should use Bound Crush and choose an opponent\'s Pokémon', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    opponent.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    sim.dispatch(new AttackAction(1, 'Bound Crush'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
      playerType: PlayerType.TOP_PLAYER,
      slots: [SlotType.ACTIVE, SlotType.BENCH],
      options: jasmine.objectContaining({ allowCancel: false })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, [opponent.bench[0]]));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.bench[0].damage).toEqual(60);
  });

  it('Should block Bound Crush during the next turn', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Bound Crush'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
      playerType: PlayerType.TOP_PLAYER,
      slots: [SlotType.ACTIVE, SlotType.BENCH],
      options: jasmine.objectContaining({ allowCancel: false })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, [opponent.active]));

    sim.dispatch(new PassTurnAction(2));

    let message = '';
    try {
      sim.dispatch(new AttackAction(1, 'Bound Crush'));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.BLOCKED_BY_EFFECT);
  });
});
