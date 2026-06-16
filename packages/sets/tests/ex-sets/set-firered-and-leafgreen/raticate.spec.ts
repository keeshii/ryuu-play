import {
  AttackAction,
  CardType,
  GameMessage,
  PassTurnAction,
  ResolvePromptAction,
  Simulator,
  SpecialCondition,
  TrainerCard,
} from '@ptcg/common';
import { Raticate } from '../../../src/ex-sets/set-firered-and-leafgreen/raticate';
import { TestEnergy } from '../../test-cards/test-energy';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestPokemonBlockPowers } from '../../test-cards/test-pokemon-block-powers';
import { TestUtils } from '../../test-utils';

class TestTrainer extends TrainerCard {
  public set: string = 'TEST';
  public name: string = 'Trainer';
  public fullName: string = 'Trainer TEST';
}

describe('Raticate RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Raticate()],
      [CardType.COLORLESS]
    );
  });

  it('Should use Pickup attack and retrieve cards from discard', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    const pokemonCard = new TestPokemon();
    const trainerCard = new TestTrainer();
    const energyCard = new TestEnergy(CardType.COLORLESS);

    player.discard.cards = [pokemonCard, trainerCard, energyCard];

    sim.dispatch(new AttackAction(1, 'Pickup'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_HAND,
      cards: player.discard,
      options: jasmine.objectContaining({
        min: 3,
        max: 3,
        allowCancel: false,
        maxPokemons: 1,
        maxEnergies: 1,
        maxTrainers: 1
      })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, [pokemonCard, trainerCard, energyCard]));

    expect(prompts.length).toBeGreaterThanOrEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Show cards',
      playerId: opponent.id,
      message: GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards: [pokemonCard, trainerCard, energyCard]
    }));

    sim.dispatch(new ResolvePromptAction(prompts[1].id, true));

    expect(prompts.length).toBeGreaterThanOrEqual(3);
    expect(prompts[2]).toEqual(jasmine.objectContaining({
      type: 'Shuffle deck',
      playerId: player.id
    }));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.discard.cards).toEqual([]);
    expect(player.deck.cards).toContain(pokemonCard);
    expect(player.deck.cards).toContain(trainerCard);
    expect(player.deck.cards).toContain(energyCard);
  });

  it('Should use Pickup attack and cancel prompt', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    const pokemonCard = new TestPokemon();

    player.discard.cards = [pokemonCard];

    sim.dispatch(new AttackAction(1, 'Pickup'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_HAND,
      cards: player.discard,
      options: jasmine.objectContaining({
        min: 1,
        max: 1,
        allowCancel: false,
        maxPokemons: 1,
        maxEnergies: 0,
        maxTrainers: 0
      })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.discard.cards).toEqual([pokemonCard]);
    expect(player.deck.cards).not.toContain(pokemonCard);
  });

  it('Should use Pickup attack when discard is empty', () => {
    const { opponent, player } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Pickup'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.discard.cards).toEqual([]);
  });

  it('Should use Quick Attack and do 10 damage on heads', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Quick Attack'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(50);
  });

  it('Should use Quick Attack and do 10 damage on tails', () => {
    const { opponent } = TestUtils.getAll(sim);

    TestUtils.setFlipResults(sim, [false]);
    sim.dispatch(new AttackAction(1, 'Quick Attack'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });

  it('Should use Thick Skin and remove special conditions between turns', () => {
    const { opponent, player } = TestUtils.getAll(sim);

    player.active.specialConditions.push(SpecialCondition.POISONED);
    player.active.specialConditions.push(SpecialCondition.CONFUSED);
    opponent.active.specialConditions.push(SpecialCondition.POISONED);

    sim.dispatch(new PassTurnAction(1));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.specialConditions).toEqual([]);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.POISONED]);
  });

  it('Should not remove special conditions when Thick Skin is blocked', () => {
    const { opponent, player } = TestUtils.getAll(sim);

    player.bench[0] = TestUtils.pokemonSlot([new TestPokemonBlockPowers()]);
    player.active.specialConditions.push(SpecialCondition.POISONED);

    sim.dispatch(new PassTurnAction(1));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.specialConditions).toEqual([SpecialCondition.POISONED]);
  });
});
