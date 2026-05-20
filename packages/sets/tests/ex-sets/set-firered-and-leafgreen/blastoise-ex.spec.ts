import {
  AttachEnergyPrompt,
  AttackAction,
  CardAssign,
  CardType,
  ChooseCardsPrompt,
  EnergyType,
  GameMessage,
  ResolvePromptAction,
  Simulator,
  SpecialCondition,
  SuperType,
  UseAbilityAction,
} from "@ptcg/common";

import { BlastoiseEx } from "../../../src/ex-sets/set-firered-and-leafgreen/blastoise-ex";
import { TestEnergy } from "../../test-cards/test-energy";
import { TestPokemon } from "../../test-cards/test-pokemon";
import { TestUtils } from "../../test-utils";

describe('Blastoise ex RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new BlastoiseEx()],
      [CardType.WATER, CardType.WATER, CardType.WATER, CardType.COLORLESS]
    );
  });

  it('Should use Energy Rain ability - no energy in hand', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim, player.active);

    let message = '';
    try {
      // ability
      sim.dispatch(new UseAbilityAction(1, 'Energy Rain', target));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.CANNOT_USE_POWER);
  });

  it('Should use Energy Rain ability - affected by special condition', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim, player.active);

    player.active.addSpecialCondition(SpecialCondition.PARALYZED);
    player.hand.cards = [ new TestEnergy(CardType.WATER) ];

    let message = '';
    try {
      // ability
      sim.dispatch(new UseAbilityAction(1, 'Energy Rain', target));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.CANNOT_USE_POWER);
  });

  it('Should use Energy Rain ability - canceled', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim, player.active);

    player.hand.cards = [ new TestEnergy(CardType.WATER) ];

    // ability
    sim.dispatch(new UseAbilityAction(1, 'Energy Rain', target));

    const prompt = TestUtils.lastPrompt(sim) as AttachEnergyPrompt;
    expect(prompt).toEqual(jasmine.objectContaining({
      type: 'Attach energy',
      playerId: player.id,
      message: GameMessage.ATTACH_ENERGY_CARDS,
      cardList: player.hand,
      filter: {
        superType: SuperType.ENERGY,
        energyType: EnergyType.BASIC,
        name: 'Water Energy',
      },
      options: jasmine.objectContaining({ min: 1, max: 1, allowCancel: true })
    }));

    // Cancel prompt
    sim.dispatch(new ResolvePromptAction(prompt.id, null));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active.damage).toEqual(0);
    expect(player.active.energies.cards).toEqual(
      TestUtils.makeEnergies([CardType.WATER, CardType.WATER, CardType.WATER, CardType.COLORLESS]));
    expect(player.hand.cards).toEqual(
      TestUtils.makeEnergies([CardType.WATER]));
  });

  it('Should use Energy Rain ability - attach card', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim, player.active);

    player.hand.cards = [ new TestEnergy(CardType.WATER) ];

    // ability
    sim.dispatch(new UseAbilityAction(1, 'Energy Rain', target));

    const prompt = TestUtils.lastPrompt(sim) as AttachEnergyPrompt;
    expect(prompt).toEqual(jasmine.objectContaining({
      type: 'Attach energy',
      playerId: player.id,
      message: GameMessage.ATTACH_ENERGY_CARDS,
      cardList: player.hand,
      filter: {
        superType: SuperType.ENERGY,
        energyType: EnergyType.BASIC,
        name: 'Water Energy',
      },
      options: jasmine.objectContaining({ min: 1, max: 1, allowCancel: true })
    }));

    const cardAssigns: CardAssign[] = [{
      to: TestUtils.target(sim, player.active),
      card: player.hand.cards[0]
    }];

    // Assign card from hand
    sim.dispatch(new ResolvePromptAction(prompt.id, cardAssigns));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active.damage).toEqual(10);
    expect(player.active.energies.cards).toEqual(
      TestUtils.makeEnergies([CardType.WATER, CardType.WATER, CardType.WATER, CardType.COLORLESS, CardType.WATER]));
    expect(player.hand.cards).toEqual([]);
  });

  it('Should attack with Hyper Whirlpool - defending without energies', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Hyper Whirlpool'));

    // No prompts, just 80 damage
    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(80);
  });

  it('Should attack with Hyper Whirlpool - all tails', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [false]);
    
    TestUtils.setDefending(
      sim,
      [new TestPokemon()],
      [CardType.WATER, CardType.WATER]
    );

    // attack
    sim.dispatch(new AttackAction(1, 'Hyper Whirlpool'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(80);
    expect(opponent.active.energies.cards).toEqual(
      TestUtils.makeEnergies([CardType.WATER, CardType.WATER]));
  });

  it('Should attack with Hyper Whirlpool - energies more than heads', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [true, false]);
    
    TestUtils.setDefending(
      sim,
      [new TestPokemon()],
      [CardType.GRASS, CardType.FIRE]
    );

    // attack
    sim.dispatch(new AttackAction(1, 'Hyper Whirlpool'));
    
    const prompt = TestUtils.lastPrompt(sim) as ChooseCardsPrompt;
    expect(prompt).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: opponent.id,
      message: GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      cards: opponent.active.energies,
      options: jasmine.objectContaining({ min: 1, max: 1, allowCancel: false })
    }));

    // Move energies
    const selected = prompt.cards.cards.slice(0, 1); // first card selected
    sim.dispatch(new ResolvePromptAction(prompt.id, selected));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(80);
    expect(opponent.active.energies.cards).toEqual(
      TestUtils.makeEnergies([CardType.FIRE]));
  });

  it('Should attack with Hyper Whirlpool - heads more than energies', () => {
    const { opponent } = TestUtils.getAll(sim);
    TestUtils.setFlipResults(sim, [true, true, true, false]);
    
    TestUtils.setDefending(
      sim,
      [new TestPokemon()],
      [CardType.GRASS, CardType.FIRE]
    );

    // attack
    sim.dispatch(new AttackAction(1, 'Hyper Whirlpool'));
    
    const prompt = TestUtils.lastPrompt(sim) as ChooseCardsPrompt;
    expect(prompt).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: opponent.id,
      message: GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      cards: opponent.active.energies,
      options: jasmine.objectContaining({ min: 2, max: 2, allowCancel: false })
    }));

    // Move energies
    const selected = prompt.cards.cards.slice(); // all energies selected
    sim.dispatch(new ResolvePromptAction(prompt.id, selected));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(80);
    expect(opponent.active.energies.cards).toEqual([]);
  });

});
