import {
  AttackAction,
  AttackEffect,
  CardAssign,
  CardList,
  CardType,
  DealDamageEffect,
  Effect,
  EnergyType,
  GameMessage,
  PlayerType,
  PokemonCard,
  ResolvePromptAction,
  Simulator, SlotType, State, StoreLike, SuperType, TrainerCard,
} from '@ptcg/common';

import { Expall } from '../../../src/ex-sets/set-firered-and-leafgreen/expall';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from "../../test-utils";

describe('EXP.ALL RG', () => {
  let sim: Simulator;
  let trainerCard: TrainerCard;
  let defending: PokemonCard;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
    trainerCard = new Expall();

    const state = sim.store.state;
    const opponent = state.players[1];
    opponent.bench[0] = TestUtils.pokemonSlot([new TestPokemon()], [], [trainerCard]);

    defending = new TestPokemon();
    defending.hp = 10;

    opponent.active = TestUtils.pokemonSlot([defending], [CardType.WATER]);
  });

  // During your opponent's turn, if 1 of your Active Pokémon is Knocked Out by your opponent's attack, you may
  // take 1 basic Energy card attached to that Knocked Out Pokémon and attach it to the Pokémon with EXP.ALL
  // attached to it. If you do, discard EXP.ALL.
  it('Should activate EXP.ALL', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    const defendingEnergies = new CardList();
    defendingEnergies.cards = opponent.active.energies.cards.slice();

    // play card
    sim.dispatch(new AttackAction(1, 'Test attack'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Attach energy',
      playerId: opponent.id,
      message: GameMessage.ATTACH_ENERGY_TO_BENCH,
      playerType: PlayerType.BOTTOM_PLAYER,
      slots: [SlotType.BENCH],
      cardList: defendingEnergies,
      filter: { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
      options: jasmine.objectContaining({
        allowCancel: true,
        min: 1,
        max: 1,
        differentTargets: true,
        blockedTo: [],
      })
    }));

    const cardAssigns: CardAssign[] = [{
      to: TestUtils.target(sim, opponent.bench[0], opponent),
      card: defendingEnergies.cards[0]
    }];

    // Attach energy
    sim.dispatch(new ResolvePromptAction(prompts[0].id, cardAssigns));

    // Pokemon is KO, get prize card and select new active
    // Player gets prize card
    expect(prompts.length).toEqual(3);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Choose prize',
      playerId: player.id,
      message: GameMessage.CHOOSE_PRIZE_CARD,
      options: jasmine.objectContaining({ count: 1 })
    }));

    // Opponent selects new active
    expect(prompts[2]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: opponent.id,
      message: GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
      slots: [SlotType.BENCH],
      options: jasmine.objectContaining({ min: 1, allowCancel: false })
    }));

    // Get prize
    const prizeSlot = player.prizes[0];
    sim.dispatch(new ResolvePromptAction(prompts[1].id, [prizeSlot]));

    // New active
    const newActive = opponent.bench[0];
    sim.dispatch(new ResolvePromptAction(prompts[2].id, [newActive]));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active).toEqual(TestUtils.pokemonSlot(
      [new TestPokemon()],
      [CardType.WATER],
      [trainerCard]
    ));
    expect(opponent.discard.cards).toEqual([defending]);
    expect(player.getPrizeLeft()).toEqual(5);
    expect(opponent.getPrizeLeft()).toEqual(6);
  });

  it('Should activate EXP.ALL - attached to defending', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    opponent.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);
    opponent.active.trainers.cards = [trainerCard];
    const defendingEnergies = opponent.active.energies.cards.slice();

    // play card
    sim.dispatch(new AttackAction(1, 'Test attack'));

    // Simple KO, EXP.ALL not activated

    // Pokemon is KO, get prize card and select new active
    // Player gets prize card
    expect(prompts.length).toEqual(2);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose prize',
      playerId: player.id,
      message: GameMessage.CHOOSE_PRIZE_CARD,
      options: jasmine.objectContaining({ count: 1 })
    }));

    // Opponent selects new active
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: opponent.id,
      message: GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
      slots: [SlotType.BENCH],
      options: jasmine.objectContaining({ min: 1, allowCancel: false })
    }));

    // Get prize
    const prizeSlot = player.prizes[0];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, [prizeSlot]));

    // New active
    const newActive = opponent.bench[0];
    sim.dispatch(new ResolvePromptAction(prompts[1].id, [newActive]));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active).toEqual(TestUtils.pokemonSlot([new TestPokemon()]));
    expect(opponent.discard.cards).toEqual([defending, ...defendingEnergies, trainerCard]);
    expect(player.getPrizeLeft()).toEqual(5);
    expect(opponent.getPrizeLeft()).toEqual(6);
  });

  it('Should activate EXP.ALL - canceled', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    const defendingEnergies = new CardList();
    defendingEnergies.cards = opponent.active.energies.cards.slice();

    // play card
    sim.dispatch(new AttackAction(1, 'Test attack'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Attach energy',
      playerId: opponent.id,
      message: GameMessage.ATTACH_ENERGY_TO_BENCH,
      playerType: PlayerType.BOTTOM_PLAYER,
      slots: [SlotType.BENCH],
      cardList: defendingEnergies,
      filter: { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
      options: jasmine.objectContaining({
        allowCancel: true,
        min: 1,
        max: 1,
        differentTargets: true,
        blockedTo: [],
      })
    }));

    // Attach energy
    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    // Pokemon is KO, get prize card and select new active
    // Player gets prize card
    expect(prompts.length).toEqual(3);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Choose prize',
      playerId: player.id,
      message: GameMessage.CHOOSE_PRIZE_CARD,
      options: jasmine.objectContaining({ count: 1 })
    }));

    // Opponent selects new active
    expect(prompts[2]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: opponent.id,
      message: GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
      slots: [SlotType.BENCH],
      options: jasmine.objectContaining({ min: 1, allowCancel: false })
    }));

    // Get prize
    const prizeSlot = player.prizes[0];
    sim.dispatch(new ResolvePromptAction(prompts[1].id, [prizeSlot]));

    // New active
    const newActive = opponent.bench[0];
    sim.dispatch(new ResolvePromptAction(prompts[2].id, [newActive]));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active).toEqual(TestUtils.pokemonSlot(
      [new TestPokemon()],
      [],
      [trainerCard]
    ));
    expect(opponent.discard.cards).toEqual([defending, ...defendingEnergies.cards]);
    expect(player.getPrizeLeft()).toEqual(5);
    expect(opponent.getPrizeLeft()).toEqual(6);
  });


  it('Should activate EXP.ALL - more than one EXP.ALL', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    opponent.active = TestUtils.pokemonSlot([defending], [CardType.WATER, CardType.WATER]);
    opponent.bench[1] = TestUtils.pokemonSlot([new TestPokemon()], [], [new Expall()]);
    
    const defendingEnergies = new CardList();
    defendingEnergies.cards = opponent.active.energies.cards.slice();

    // play card
    sim.dispatch(new AttackAction(1, 'Test attack'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Attach energy',
      playerId: opponent.id,
      message: GameMessage.ATTACH_ENERGY_TO_BENCH,
      playerType: PlayerType.BOTTOM_PLAYER,
      slots: [SlotType.BENCH],
      cardList: defendingEnergies,
      filter: { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
      options: jasmine.objectContaining({
        allowCancel: true,
        min: 1,
        max: 2,
        differentTargets: true,
        blockedTo: [],
      })
    }));

    const cardAssigns: CardAssign[] = [{
      to: TestUtils.target(sim, opponent.bench[0], opponent),
      card: defendingEnergies.cards[0]
    }, {
      to: TestUtils.target(sim, opponent.bench[1], opponent),
      card: defendingEnergies.cards[1]
    }];

    // Attach energy
    sim.dispatch(new ResolvePromptAction(prompts[0].id, cardAssigns));

    // Pokemon is KO, get prize card and select new active
    // Player gets prize card
    expect(prompts.length).toEqual(3);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Choose prize',
      playerId: player.id,
      message: GameMessage.CHOOSE_PRIZE_CARD,
      options: jasmine.objectContaining({ count: 1 })
    }));

    // Opponent selects new active
    expect(prompts[2]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: opponent.id,
      message: GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
      slots: [SlotType.BENCH],
      options: jasmine.objectContaining({ min: 1, allowCancel: false })
    }));

    // Get prize
    const prizeSlot = player.prizes[0];
    sim.dispatch(new ResolvePromptAction(prompts[1].id, [prizeSlot]));

    // New active
    const newActive = opponent.bench[0];
    sim.dispatch(new ResolvePromptAction(prompts[2].id, [newActive]));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active).toEqual(TestUtils.pokemonSlot(
      [new TestPokemon()],
      [CardType.WATER],
      [trainerCard]
    ));
    expect(opponent.bench[1]).toEqual(TestUtils.pokemonSlot(
      [new TestPokemon()],
      [CardType.WATER],
      [trainerCard]
    ));
    expect(opponent.discard.cards).toEqual([defending]);
    expect(player.getPrizeLeft()).toEqual(5);
    expect(opponent.getPrizeLeft()).toEqual(6);
  });

  it('Should activate EXP.ALL - self KO', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    opponent.bench[0] = TestUtils.pokemonSlot([]);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()], [], [trainerCard]);

    // Hurt itself
    const attacking = new TestPokemon();
    attacking.reduceEffect = function (store: StoreLike, state: State, effect: Effect) {
      if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
        effect.damage = 0;
        const dealDamage = new DealDamageEffect(effect, 400);
        dealDamage.target = effect.player.active;
        store.reduceEffect(state, dealDamage);
      }
      return state;
    };
    player.active = TestUtils.pokemonSlot([attacking], [CardType.WATER]);
    const energies = player.active.energies.cards.slice();

    // play card
    sim.dispatch(new AttackAction(1, 'Test attack'));

    // Simple KO, EXP.ALL not activated

    // Pokemon is KO, get prize card and select new active
    // Player selects new active
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
      slots: [SlotType.BENCH],
      options: jasmine.objectContaining({ min: 1, allowCancel: false })
    }));
    
    // Opponent gets prize card
    expect(prompts.length).toEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Choose prize',
      playerId: opponent.id,
      message: GameMessage.CHOOSE_PRIZE_CARD,
      options: jasmine.objectContaining({ count: 1 })
    }));

    // New active
    const newActive = player.bench[0];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, [newActive]));

    // Get prize
    const prizeSlot = opponent.prizes[0];
    sim.dispatch(new ResolvePromptAction(prompts[1].id, [prizeSlot]));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot([new TestPokemon()], [], [trainerCard]));
    expect(player.discard.cards).toEqual([attacking, ...energies]);
    expect(player.getPrizeLeft()).toEqual(6);
    expect(opponent.getPrizeLeft()).toEqual(5);
  });

});
