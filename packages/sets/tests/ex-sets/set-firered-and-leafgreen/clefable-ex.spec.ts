import {
  AttackAction,
  CardType,
  GameMessage,
  PokemonCard,
  ResolvePromptAction,
  Simulator
} from "@ptcg/common";
import { ClefableEx } from "../../../src/ex-sets/set-firered-and-leafgreen/clefable-ex";

import { TestUtils } from "../../test-utils";

describe('Clefable ex RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [ new ClefableEx() ],
      [ CardType.COLORLESS, CardType.COLORLESS ]
    );
  });

  it('Should use Metronome - defending without attacks', () => {
    const { opponent } = TestUtils.getAll(sim);
    const defending = opponent.active.getPokemonCard() as PokemonCard;
    defending.attacks = [];

    // attack
    sim.dispatch(new AttackAction(1, 'Metronome'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
  });

  it('Should use Metronome - canceled', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    const defending = opponent.active.getPokemonCard() as PokemonCard;

    // attack
    sim.dispatch(new AttackAction(1, 'Metronome'));

    // choose attack
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose attack',
      playerId: player.id,
      message: GameMessage.CHOOSE_ATTACK_TO_COPY,
      cards: [defending],
      options: jasmine.objectContaining({ allowCancel: true })
    }));

    // No attack selected
    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
  });

  it('Should use Metronome - defending with an attack', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    const defending = opponent.active.getPokemonCard() as PokemonCard;

    // attack
    sim.dispatch(new AttackAction(1, 'Metronome'));

    // choose attack
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose attack',
      playerId: player.id,
      message: GameMessage.CHOOSE_ATTACK_TO_COPY,
      cards: [defending],
      options: jasmine.objectContaining({ allowCancel: true })
    }));

    // Selected attack "Test attack - 10"
    sim.dispatch(new ResolvePromptAction(prompts[0].id, defending.attacks[0]));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });

  it('Should use Moon Impact', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Moon Impact'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(40);
  });

});
