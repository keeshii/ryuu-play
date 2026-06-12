import {
  GameMessage,
  PlayCardAction,
  ResolvePromptAction,
  Simulator,
  SpecialCondition,
  SlotType,
} from '@ptcg/common';

import { LifeHerb } from '../../../src/ex-sets/set-firered-and-leafgreen/life-herb';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Life Herb RG', () => {
  let sim: Simulator;
  let trainerCard: LifeHerb;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
    trainerCard = new LifeHerb();

    const state = sim.store.state;
    state.players[0].hand.cards = [trainerCard];
  });

  it('Should play Life Herb trainer card and heal active Pokémon after heads', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);

    player.active.damage = 80;
    player.active.addSpecialCondition(SpecialCondition.PARALYZED);

    sim.dispatch(new PlayCardAction(1, index, target));

    expect(prompts.length).toEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_HEAL,
      slots: [SlotType.ACTIVE, SlotType.BENCH],
      options: jasmine.objectContaining({ allowCancel: true })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[1].id, [player.active]));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active.damage).toEqual(20);
    expect(player.active.specialConditions).toEqual([]);
  });

  it('Should play Life Herb trainer card and choose bench Pokémon', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);

    player.active.damage = 0;
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()], [], [], 60);

    sim.dispatch(new PlayCardAction(1, index, target));

    expect(prompts.length).toEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_HEAL,
      slots: [SlotType.ACTIVE, SlotType.BENCH],
      options: jasmine.objectContaining({ allowCancel: true })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[1].id, [player.bench[0]]));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.bench[0].damage).toEqual(0);
  });

  it('Should play Life Herb trainer card and cancel choose Pokémon prompt', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);

    player.active.damage = 40;

    sim.dispatch(new PlayCardAction(1, index, target));

    expect(prompts.length).toEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_HEAL,
      slots: [SlotType.ACTIVE, SlotType.BENCH],
      options: jasmine.objectContaining({ allowCancel: true })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[1].id, null));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active.damage).toEqual(40);
  });

  it('Should play Life Herb trainer card but coin flip fails', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);
    TestUtils.setFlipResults(sim, [false]);

    player.active.damage = 40;

    sim.dispatch(new PlayCardAction(1, index, target));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Coin flip',
      playerId: player.id
    }));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.discard.cards).toEqual([trainerCard]);
    expect(player.active.damage).toEqual(40);
  });


  it('Should not be able to play Life Herb when no valid Pokémon exist', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim);
    const index = player.hand.cards.indexOf(trainerCard);

    player.active.damage = 0;
    player.active.specialConditions = [];

    let message = '';
    try {
      sim.dispatch(new PlayCardAction(1, index, target));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.CANNOT_PLAY_THIS_CARD);
  });
});
