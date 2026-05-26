import {
  AttackAction,
  CardAssign,
  CardType,
  CheckProvidedEnergyEffect,
  Effect,
  EnergyType,
  GameMessage,
  PlayerType,
  PokemonSlot,
  ResolvePromptAction,
  Simulator,
  SlotType,
  SpecialCondition,
  State,
  StoreLike,
  SuperType,
  UseAbilityAction
} from '@ptcg/common';

import { ElectrodeEx } from '../../../src/ex-sets/set-firered-and-leafgreen/electrode-ex';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestPokemonEx } from '../../test-cards/test-pokemon-ex';
import { TestPokemonIgnoreAttackCost } from '../../test-cards/test-pokemon-ignore-attack-cost';
import { TestUtils } from "../../test-utils";

describe('Electrode ex RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new ElectrodeEx()],
      [CardType.LIGHTNING, CardType.COLORLESS],
    );
  });

  // Extra Energy Bomb - Once during your turn (before your attack), you may discard Electrode ex and all the
  // cards attached to it (this counts as Knocking Out Electrode ex). If you do, search your discard pile for 5
  // Energy cards and attach them to any of your Pokémon (excluding Pokémon-ex) in any way you like. This power
  // can't be used if Electrode ex is affected by a Special Condition.
  it('Should use Extra Energy Bomb ability', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim, player.active);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    // ability
    sim.dispatch(new UseAbilityAction(1, 'Extra Energy Bomb' , target));

    // Pokemon is KO, get prize card and select new active
    // Player selects new active
    expect(prompts.length).toEqual(2);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
      slots: [SlotType.BENCH],
      options: jasmine.objectContaining({ min: 1, allowCancel: false })
    }));
    
    // Opponent gets prize card
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Choose prize',
      playerId: opponent.id,
      message: GameMessage.CHOOSE_PRIZE_CARD,
      options: jasmine.objectContaining({ count: 2 })
    }));

    // New active
    const newActive = player.bench[0];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, [newActive]));

    // Get prize
    const prizes = opponent.prizes.slice(0, 2);
    sim.dispatch(new ResolvePromptAction(prompts[1].id, prizes));

    // Attach energies from discard
    expect(prompts.length).toEqual(3);
    expect(prompts[2]).toEqual(jasmine.objectContaining({
      type: 'Attach energy',
      playerId: player.id,
      message: GameMessage.ATTACH_ENERGY_CARDS,
      playerType: PlayerType.BOTTOM_PLAYER,
      slots: [SlotType.ACTIVE, SlotType.BENCH],
      cardList: player.discard,
      filter:       {
        superType: SuperType.ENERGY,
        energyType: EnergyType.BASIC
      },
      options: jasmine.objectContaining({ allowCancel: false, min: 2, max: 2, blockedTo: [] })
    }));

    const cardAssigns: CardAssign[] = player.discard.cards
      .filter(card => card.superType === SuperType.ENERGY)
      .map(card => ({ to: target, card }));
    sim.dispatch(new ResolvePromptAction(prompts[2].id, cardAssigns));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot(
      [new TestPokemon()],
      [CardType.LIGHTNING, CardType.COLORLESS]
    ));
    expect(player.discard.cards).toEqual([new ElectrodeEx()]);
    expect(player.getPrizeLeft()).toEqual(6);
    expect(opponent.getPrizeLeft()).toEqual(4);
  });

  it('Should use Extra Energy Bomb ability - only pokemon ex in play', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim, player.active);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemonEx()]);

    // ability
    sim.dispatch(new UseAbilityAction(1, 'Extra Energy Bomb' , target));

    // Pokemon is KO, get prize card and select new active
    // Player selects new active
    expect(prompts.length).toEqual(2);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
      slots: [SlotType.BENCH],
      options: jasmine.objectContaining({ min: 1, allowCancel: false })
    }));
    
    // Opponent gets prize card
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Choose prize',
      playerId: opponent.id,
      message: GameMessage.CHOOSE_PRIZE_CARD,
      options: jasmine.objectContaining({ count: 2 })
    }));

    // New active
    const newActive = player.bench[0];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, [newActive]));

    // Get prize
    const prizes = opponent.prizes.slice(0, 2);
    sim.dispatch(new ResolvePromptAction(prompts[1].id, prizes));

    // Nothing left to do, no more prompts

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot([new TestPokemonEx()]));
    expect(player.discard.cards).toEqual([
      new ElectrodeEx(),
      ...TestUtils.makeEnergies([CardType.LIGHTNING, CardType.COLORLESS])
    ]);
    expect(player.getPrizeLeft()).toEqual(6);
    expect(opponent.getPrizeLeft()).toEqual(4);
  });

  it('Should use Extra Energy Bomb ability - no energies', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim, player.active);
    player.active.energies.cards = [];
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    // ability
    sim.dispatch(new UseAbilityAction(1, 'Extra Energy Bomb' , target));

    // Pokemon is KO, get prize card and select new active
    // Player selects new active
    expect(prompts.length).toEqual(2);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
      slots: [SlotType.BENCH],
      options: jasmine.objectContaining({ min: 1, allowCancel: false })
    }));
    
    // Opponent gets prize card
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Choose prize',
      playerId: opponent.id,
      message: GameMessage.CHOOSE_PRIZE_CARD,
      options: jasmine.objectContaining({ count: 2 })
    }));

    // New active
    const newActive = player.bench[0];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, [newActive]));

    // Get prize
    const prizes = opponent.prizes.slice(0, 2);
    sim.dispatch(new ResolvePromptAction(prompts[1].id, prizes));

    // Nothing left to do, no more prompts

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot([new TestPokemon()]));
    expect(player.discard.cards).toEqual([new ElectrodeEx()]);
    expect(player.getPrizeLeft()).toEqual(6);
    expect(opponent.getPrizeLeft()).toEqual(4);
  });

  it('Should use Extra Energy Bomb ability - canceled', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim, player.active);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    // ability
    sim.dispatch(new UseAbilityAction(1, 'Extra Energy Bomb' , target));

    // Pokemon is KO, get prize card and select new active
    // Player selects new active
    expect(prompts.length).toEqual(2);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
      slots: [SlotType.BENCH],
      options: jasmine.objectContaining({ min: 1, allowCancel: false })
    }));
    
    // Opponent gets prize card
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Choose prize',
      playerId: opponent.id,
      message: GameMessage.CHOOSE_PRIZE_CARD,
      options: jasmine.objectContaining({ count: 2 })
    }));

    // New active
    const newActive = player.bench[0];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, [newActive]));

    // Get prize
    const prizes = opponent.prizes.slice(0, 2);
    sim.dispatch(new ResolvePromptAction(prompts[1].id, prizes));

    // Attach energies from discard
    expect(prompts.length).toEqual(3);
    expect(prompts[2]).toEqual(jasmine.objectContaining({
      type: 'Attach energy',
      playerId: player.id,
      message: GameMessage.ATTACH_ENERGY_CARDS,
      playerType: PlayerType.BOTTOM_PLAYER,
      slots: [SlotType.ACTIVE, SlotType.BENCH],
      cardList: player.discard,
      filter:       {
        superType: SuperType.ENERGY,
        energyType: EnergyType.BASIC
      },
      options: jasmine.objectContaining({ allowCancel: false, min: 2, max: 2, blockedTo: [] })
    }));

    // illegal move
    sim.dispatch(new ResolvePromptAction(prompts[2].id, null));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot([new TestPokemon()]));
    expect(player.discard.cards).toEqual([
      new ElectrodeEx(),
      ...TestUtils.makeEnergies([CardType.LIGHTNING, CardType.COLORLESS])
    ]);
    expect(player.getPrizeLeft()).toEqual(6);
    expect(opponent.getPrizeLeft()).toEqual(4);
  });

  it('Should use Extra Energy Bomb ability - blocked by special condition', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim, player.active);

    player.active.addSpecialCondition(SpecialCondition.PARALYZED);

    let message = ''
    try {
      // ability
      sim.dispatch(new UseAbilityAction(1, 'Extra Energy Bomb' , target));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.CANNOT_USE_POWER);
  });

  // Crush and Burn (30+) - You may discard as many Energy as you like attached to your Pokémon in play. If you
  // do, this attack does 30 damage plus 20 more damage for each Energy you discarded.
  it('Should use Crush and Burn attack - discard 2 energy cards', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Crush and Burn'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
      slots: [SlotType.ACTIVE, SlotType.BENCH],
      options: jasmine.objectContaining({ min: 0, max: 1, allowCancel: true, blocked: [] })
    }));

    // Choose Pokemon
    const selected: PokemonSlot[] = [player.active];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, selected));
 
    // Choose card prompt
    expect(prompts.length).toEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_DISCARD,
      cards: player.active.energies,
      options: jasmine.objectContaining({ allowCancel: true })
    }));

    // Choose card
    const cards = player.active.energies.cards.slice();
    sim.dispatch(new ResolvePromptAction(prompts[1].id, cards));

    // No energies, no more prompts

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(70);
    expect(player.active.energies.cards).toEqual(TestUtils.makeEnergies([]));
  });

  it('Should use Crush and Burn attack - energies provides nothing', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    const testPokemonEnergiesProviesNothing = new TestPokemon();
    
    testPokemonEnergiesProviesNothing.reduceEffect = function (store: StoreLike, state: State, effect: Effect) {
      if (effect instanceof CheckProvidedEnergyEffect) {
        effect.energyMap = [];
      }
      return state;
    }

    opponent.bench[0] = TestUtils.pokemonSlot([testPokemonEnergiesProviesNothing]);
    opponent.bench[1] = TestUtils.pokemonSlot([new TestPokemonIgnoreAttackCost()]);

    // attack
    sim.dispatch(new AttackAction(1, 'Crush and Burn'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
      slots: [SlotType.ACTIVE, SlotType.BENCH],
      options: jasmine.objectContaining({ min: 0, max: 1, allowCancel: true, blocked: [] })
    }));

    // Choose Pokemon
    const selected: PokemonSlot[] = [player.active];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, selected));
 
    // Choose card prompt
    expect(prompts.length).toEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_DISCARD,
      cards: player.active.energies,
      options: jasmine.objectContaining({ allowCancel: true })
    }));

    // Choose card
    const cards = player.active.energies.cards.slice();
    sim.dispatch(new ResolvePromptAction(prompts[1].id, cards));

    // No energies, no more prompts

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
    expect(player.active.energies.cards).toEqual(TestUtils.makeEnergies([]));
  });

  it('Should use Crush and Burn attack - no energy selected', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Crush and Burn'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
      slots: [SlotType.ACTIVE, SlotType.BENCH],
      options: jasmine.objectContaining({ min: 0, max: 1, allowCancel: true, blocked: [] })
    }));

    // Choose Pokemon
    const selected: PokemonSlot[] = [player.active];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, selected));
 
    // Choose card prompt
    expect(prompts.length).toEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_DISCARD,
      cards: player.active.energies,
      options: jasmine.objectContaining({ allowCancel: true })
    }));

    // Choose card
    sim.dispatch(new ResolvePromptAction(prompts[1].id, null));

    expect(prompts.length).toEqual(3);
    expect(prompts[2]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
      slots: [SlotType.ACTIVE, SlotType.BENCH],
      options: jasmine.objectContaining({ min: 0, max: 1, allowCancel: true, blocked: [] })
    }));

    // Choose Pokemon
    sim.dispatch(new ResolvePromptAction(prompts[2].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
    expect(player.active.energies.cards).toEqual(TestUtils.makeEnergies([CardType.LIGHTNING, CardType.COLORLESS]));
  });
  
  it('Should use Crush and Burn attack - no pokemon selected', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Crush and Burn'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
      slots: [SlotType.ACTIVE, SlotType.BENCH],
      options: jasmine.objectContaining({ min: 0, max: 1, allowCancel: true, blocked: [] })
    }));

    // Choose Pokemon
    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
    expect(player.active.energies.cards).toEqual(TestUtils.makeEnergies([CardType.LIGHTNING, CardType.COLORLESS]));
  });
  
  it('Should use Crush and Burn attack - no Pokemon with energies', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    player.active.energies.cards = [];
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemonIgnoreAttackCost()]);

    // attack
    sim.dispatch(new AttackAction(1, 'Crush and Burn'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
    expect(player.active.energies.cards).toEqual(TestUtils.makeEnergies([]));
  });

});
