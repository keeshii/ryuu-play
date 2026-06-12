import {
  AttackAction,
  CardType,
  GameMessage,
  ResolvePromptAction,
  Simulator,
  Stage,
} from '@ptcg/common';

import { Magikarp } from '../../../src/ex-sets/set-firered-and-leafgreen/magikarp';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

class TestStage1Magikarp extends TestPokemon {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Magikarp';
  public name = 'Test Gyarados';
  public fullName = 'Test Gyarados TEST';
}

describe('Magikarp RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Magikarp()],
      [CardType.WATER, CardType.WATER],
    );
  });

  it('Should use Surprise Attack and deal 10 damage on heads', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Surprise Attack'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });

  it('Should use Surprise Attack and do nothing on tails', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [false]);

    sim.dispatch(new AttackAction(1, 'Surprise Attack'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
  });

  it('Should use Ascension and evolve into a Stage 1 Pokémon', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const stage1 = new TestStage1Magikarp();

    player.hand.cards = [new Magikarp()];
    player.deck.cards.push(stage1);

    // play attack
    sim.dispatch(new AttackAction(1, 'Ascension'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_EVOLVE,
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, [stage1]));

    expect(prompts.length).toEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Shuffle deck',
      playerId: player.id,
    }));

    expect(player.active.pokemons.cards).toContain(stage1);
    expect(player.active.pokemonPlayedTurn).toEqual(sim.store.state.turn - 1);
  });

  it('Should use Ascension and shuffle without evolving when prompt is canceled', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const stage1 = new TestStage1Magikarp();

    player.deck.cards.push(stage1);

    sim.dispatch(new AttackAction(1, 'Ascension'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_EVOLVE,
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(prompts.length).toEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Shuffle deck',
      playerId: player.id,
    }));
    expect(player.active.pokemons.cards.length).toEqual(1);
  });

  it('Should use Ascension and do nothing when deck is empty', () => {
    const { player } = TestUtils.getAll(sim);
    player.deck.cards = [];

    sim.dispatch(new AttackAction(1, 'Ascension'));

    const { prompts } = TestUtils.getAll(sim);
    expect(prompts.length).toEqual(0);
    expect(player.active.pokemons.cards.length).toEqual(1);
  });
});
