import {
  AttackAction,
  CardTransfer,
  CardType,
  GameMessage,
  PlayCardAction,
  ResolvePromptAction,
  Simulator,
} from '@ptcg/common';

import { ZapdosEx } from '../../../src/ex-sets/set-firered-and-leafgreen/zapdos-ex';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestPokemonBlockPowers } from '../../test-cards/test-pokemon-block-powers';
import { TestPokemonIgnoreAttackCost } from '../../test-cards/test-pokemon-ignore-attack-cost';
import { TestUtils } from "../../test-utils";

describe('Zapdos ex RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new ZapdosEx()],
      [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
    );
  });

  // Legendary Ascent - Once during your turn, when you put Zapdos ex from your hand onto your Bench, you may
  // switch 1 of your Active Pokémon with Zapdos ex. If you do, you may also move any number of basic Lightning
  // Energy cards attached to your Pokémon to Zapdos ex.
  it('Should use Legendary Ascent - canceled', () => {
    const { bench, player, prompts } = TestUtils.getAll(sim);
    const moltres = new ZapdosEx();
    const benchTarget = TestUtils.target(sim, bench[1]);

    TestUtils.setActive(sim, [new TestPokemon()], [CardType.LIGHTNING, CardType.LIGHTNING]);
    player.hand.cards = [moltres];

    sim.dispatch(new PlayCardAction(1, player.hand.cards.indexOf(moltres), benchTarget));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Confirm',
      playerId: player.id,
      message: GameMessage.WANT_TO_USE_ABILITY
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot(
      [new TestPokemon()],
      [CardType.LIGHTNING, CardType.LIGHTNING]
    ));
    expect(bench[1]).toEqual(TestUtils.pokemonSlot([moltres]));
  });

  it('Should use Legendary Ascent - switch and move energies', () => {
    const { bench, player, prompts } = TestUtils.getAll(sim);
    const moltres = new ZapdosEx();
    const benchTarget = TestUtils.target(sim, bench[1]);

    TestUtils.setActive(sim, [new TestPokemon()], [CardType.LIGHTNING, CardType.LIGHTNING]);
    bench[0] = TestUtils.pokemonSlot([new TestPokemon()], [CardType.LIGHTNING]);
    player.hand.cards = [moltres];

    sim.dispatch(new PlayCardAction(1, player.hand.cards.indexOf(moltres), benchTarget));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Confirm',
      playerId: player.id,
      message: GameMessage.WANT_TO_USE_ABILITY
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, true));

    expect(prompts.length).toEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Move energy',
      playerId: player.id,
      message: GameMessage.MOVE_ENERGY_TO_ACTIVE
    }));

    const selected: CardTransfer[] = [{
      from: TestUtils.target(sim, bench[0]),
      to: TestUtils.target(sim, player.active),
      card: bench[0].energies.cards[0]
    }];

    sim.dispatch(new ResolvePromptAction(prompts[1].id, selected));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot([moltres], [CardType.LIGHTNING]));
    expect(bench[0]).toEqual(TestUtils.pokemonSlot([new TestPokemon()]));
    expect(bench[1]).toEqual(TestUtils.pokemonSlot(
      [new TestPokemon()],
      [CardType.LIGHTNING, CardType.LIGHTNING]
    ));
  });

  it('Should use Legendary Ascent - blocked', () => {
    const { bench, player, prompts } = TestUtils.getAll(sim);
    const moltres = new ZapdosEx();
    const benchTarget = TestUtils.target(sim, bench[1]);

    TestUtils.setActive(sim, [new TestPokemonBlockPowers()], [CardType.LIGHTNING, CardType.LIGHTNING]);
    player.hand.cards = [moltres];

    sim.dispatch(new PlayCardAction(1, player.hand.cards.indexOf(moltres), benchTarget));

    expect(prompts.length).toEqual(0);
    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot(
      [new TestPokemonBlockPowers()],
      [CardType.LIGHTNING, CardType.LIGHTNING]
    ));
    expect(bench[1]).toEqual(TestUtils.pokemonSlot([moltres]));
  });


  // Electron Crush (50+) - You may discard an Energy card attached to Zapdos ex. If you do, this attack does 50
  // damage plus 20 more damage.
  it('Should use Electron Crush and discard energy to do more damage', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);

    TestUtils.setActive(sim, [new ZapdosEx()], [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS]);

    sim.dispatch(new AttackAction(1, 'Electron Crush'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      cards: player.active.energies,
      options: jasmine.objectContaining({ min: 1, max: 1, allowCancel: true })
    }));

    const selected = [player.active.energies.cards[0]];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, selected));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(70);
    expect(player.active.energies.cards.length).toEqual(2);
    expect(player.discard.cards.length).toEqual(1);
  });

  it('Should use Electron Crush without discarding energy', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);

    TestUtils.setActive(sim, [new ZapdosEx()], [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS]);

    sim.dispatch(new AttackAction(1, 'Electron Crush'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      cards: player.active.energies,
      options: jasmine.objectContaining({ min: 1, max: 1, allowCancel: true })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(50);
    expect(player.active.energies.cards.length).toEqual(3);
    expect(player.discard.cards.length).toEqual(0);
  });

  it('Should use Electron Crush without energies', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);

    TestUtils.setActive(sim, [new ZapdosEx()], []);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemonIgnoreAttackCost()]);

    sim.dispatch(new AttackAction(1, 'Electron Crush'));

    expect(prompts.length).toEqual(0);
    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(50);
    expect(player.active.energies.cards.length).toEqual(0);
    expect(player.discard.cards.length).toEqual(0);
  });

});
