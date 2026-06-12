import {
  AttackAction,
  CardType,
  GameMessage,
  ResolvePromptAction,
  Simulator,
  Stage,
  SuperType
} from '@ptcg/common';

import { Nidorina } from '../../../src/ex-sets/set-firered-and-leafgreen/nidorina';
import { Nidorino } from '../../../src/ex-sets/set-firered-and-leafgreen/nidorino';
import { NidoranFemale } from '../../../src/ex-sets/set-firered-and-leafgreen/nidoran-female';
import { TestUtils } from '../../test-utils';

describe('Nidorina RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Nidorina()],
      [CardType.GRASS, CardType.COLORLESS],
    );
  });

  it('Should use Scratch attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Scratch'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
  });

  it('Should use Fast Evolution and search for 2 evolution cards', () => {
    const { player, opponent } = TestUtils.getAll(sim);
    const nidorino = new Nidorino();
    const nidorina = new Nidorina();

    player.deck.cards = [nidorino, nidorina];

    sim.dispatch(new AttackAction(1, 'Fast Evolution'));

    let { prompts } = TestUtils.getAll(sim);
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_HAND,
      cards: player.deck,
      filter: [
        { superType: SuperType.POKEMON, stage: Stage.STAGE_1 },
        { superType: SuperType.POKEMON, stage: Stage.STAGE_2 }
      ],
      options: jasmine.objectContaining({ min: 0, max: 2, allowCancel: false })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, [nidorino, nidorina]));

    expect(prompts.length).toEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Show cards',
      playerId: opponent.id,
      message: GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards: [nidorino, nidorina]
    }));

    // Confirm show cards
    sim.dispatch(new ResolvePromptAction(prompts[1].id, true));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.hand.cards).toEqual([nidorino, nidorina]);
  });

  it('Should use Fast Evolution and search for 1 evolution card', () => {
    const { player, opponent, prompts } = TestUtils.getAll(sim);
    const nidorino = new Nidorino();

    player.deck.cards = [nidorino];

    sim.dispatch(new AttackAction(1, 'Fast Evolution'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_HAND,
      cards: player.deck,
      filter: [
        { superType: SuperType.POKEMON, stage: Stage.STAGE_1 },
        { superType: SuperType.POKEMON, stage: Stage.STAGE_2 }
      ],
      options: jasmine.objectContaining({ min: 0, max: 2, allowCancel: false })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, [nidorino]));

    expect(prompts.length).toEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Show cards',
      playerId: opponent.id,
      message: GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards: [nidorino]
    }));

    // Confirm show cards
    sim.dispatch(new ResolvePromptAction(prompts[1].id, true));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.hand.cards).toEqual([nidorino]);
  });

  it('Should use Fast Evolution - no evolution cards found', () => {
    const { player, opponent, prompts } = TestUtils.getAll(sim);
    const nidoranFemale = new NidoranFemale();

    player.deck.cards = [nidoranFemale];

    sim.dispatch(new AttackAction(1, 'Fast Evolution'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_HAND,
      cards: player.deck,
      filter: [
        { superType: SuperType.POKEMON, stage: Stage.STAGE_1 },
        { superType: SuperType.POKEMON, stage: Stage.STAGE_2 }
      ],
      options: jasmine.objectContaining({ min: 0, max: 2, allowCancel: false })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, []));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.hand.cards.length).toEqual(0);
  });

  it('Should use Fast Evolution - empty deck', () => {
    const { player, opponent } = TestUtils.getAll(sim);

    player.deck.cards = [];

    sim.dispatch(new AttackAction(1, 'Fast Evolution'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
  });

  it('Should use Fast Evolution - cancel prompt', () => {
    const { player, opponent, prompts } = TestUtils.getAll(sim);
    const nidorino = new Nidorino();

    player.deck.cards = [nidorino];

    sim.dispatch(new AttackAction(1, 'Fast Evolution'));

    expect(prompts.length).toEqual(1);

    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.hand.cards.length).toEqual(0);
  });
});
