import {
  AttackAction,
  CardType,
  GameMessage,
  ResolvePromptAction,
  RetreatAction,
  Simulator,
  SpecialCondition,
  UseAbilityAction,
} from '@ptcg/common';

import { Pidgeot } from '../../../src/ex-sets/set-firered-and-leafgreen/pidgeot';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

describe('Pidgeot RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Pidgeot()],
      [CardType.COLORLESS, CardType.COLORLESS],
    );
  });

  it('Should use Quick Search and add a card from deck to hand', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const selectedCard = new TestPokemon();

    player.deck.cards = [selectedCard];

    sim.dispatch(new UseAbilityAction(1, 'Quick Search', TestUtils.target(sim, player.active)));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_HAND,
      cards: player.deck,
      options: jasmine.objectContaining({ min: 1, max: 1, allowCancel: false })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, [selectedCard]));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.hand.cards).toEqual([selectedCard]);
    expect(player.deck.cards).toEqual([]);
  });

  it('Should not allow Quick Search when Pidgeot is affected by a Special Condition', () => {
    const { player } = TestUtils.getAll(sim);
    player.active.specialConditions.push(SpecialCondition.PARALYZED);

    let message = '';
    try {
      sim.dispatch(new UseAbilityAction(1, 'Quick Search', TestUtils.target(sim, player.active)));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.CANNOT_USE_POWER);
  });

  it('Should not allow Quick Search when deck is empty', () => {
    const { player } = TestUtils.getAll(sim);
    player.deck.cards = [];

    let message = '';
    try {
      sim.dispatch(new UseAbilityAction(1, 'Quick Search', TestUtils.target(sim, player.active)));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.CANNOT_USE_POWER);
  });

  it('Should use Quick Search and add cancel prompt', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    player.deck.cards = [new TestPokemon()];

    sim.dispatch(new UseAbilityAction(1, 'Quick Search', TestUtils.target(sim, player.active)));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_HAND,
      cards: player.deck,
      options: jasmine.objectContaining({ min: 1, max: 1, allowCancel: false })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.hand.cards).toEqual([]);
    expect(player.deck.cards).toEqual([new TestPokemon()]);
  });

  it('Should not allow Quick Search to be used more than once per turn', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const firstCard = new TestPokemon();
    player.deck.cards = [firstCard, new TestPokemon()];

    sim.dispatch(new UseAbilityAction(1, 'Quick Search', TestUtils.target(sim, player.active)));

    expect(prompts.length).toEqual(1);
    sim.dispatch(new ResolvePromptAction(prompts[0].id, [firstCard]));

    let message = '';
    try {
      sim.dispatch(new UseAbilityAction(1, 'Quick Search', TestUtils.target(sim, player.active)));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.POWER_ALREADY_USED);
  });

  it('Should use Clutch and block retreat until the end of opponent\'s next turn', () => {
    const { opponent } = TestUtils.getAll(sim);
    opponent.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    sim.dispatch(new AttackAction(1, 'Clutch'));

    let message = '';
    try {
      sim.dispatch(new RetreatAction(2, 0));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(message).toEqual(GameMessage.BLOCKED_BY_EFFECT);
    expect(opponent.active.damage).toEqual(40);
  });
});
