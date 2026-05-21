import {
  AttackAction,
  CardType,
  Simulator,
  GameMessage,
  ResolvePromptAction,
  PlayCardAction,
  CardTransfer
} from "@ptcg/common";

import { ArticunoEx } from "../../../src/ex-sets/set-firered-and-leafgreen/articuno-ex";
import { TestPokemon } from "../../test-cards/test-pokemon";
import { TestPokemonBlockPowers } from "../../test-cards/test-pokemon-block-powers";
import { TestPokemonIgnoreAttackCost } from "../../test-cards/test-pokemon-ignore-attack-cost";
import { TestUtils } from "../../test-utils";

describe('Articuno ex RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new ArticunoEx()],
      [CardType.WATER, CardType.WATER, CardType.COLORLESS]
    );
  });


  it('Should use Legendary Ascent - canceled', () => {
    const { bench, player, prompts } = TestUtils.getAll(sim);
    const articuno = new ArticunoEx();
    const benchTarget = TestUtils.target(sim, bench[1]);

    TestUtils.setActive(
      sim,
      [new TestPokemon()],
      [CardType.WATER, CardType.WATER]
    );

    player.hand.cards = [articuno];

    // play Articuno from hand to bench 1
    sim.dispatch(new PlayCardAction(1, player.hand.cards.indexOf(articuno), benchTarget));

    // first, the player discards energy from articuno-ex
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Confirm',
      playerId: player.id,
      message: GameMessage.WANT_TO_USE_ABILITY
    }));

    // Choose an energy to discard
    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();

    expect(player.active).toEqual(
      TestUtils.pokemonSlot(
        [new TestPokemon()],
        [CardType.WATER, CardType.WATER]
      ));

    expect(player.bench[1]).toEqual(TestUtils.pokemonSlot([articuno]));
  });

  it('Should use Legendary Ascent - without energies', () => {
    const { bench, player, prompts } = TestUtils.getAll(sim);
    const articuno = new ArticunoEx();
    const benchTarget = TestUtils.target(sim, bench[1]);

    TestUtils.setActive(sim, [new TestPokemon()]);

    player.hand.cards = [articuno];

    // play Articuno from hand to bench 1
    sim.dispatch(new PlayCardAction(1, player.hand.cards.indexOf(articuno), benchTarget));

    // first, the player discards energy from articuno-ex
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Confirm',
      playerId: player.id,
      message: GameMessage.WANT_TO_USE_ABILITY
    }));

    // Confirm
    sim.dispatch(new ResolvePromptAction(prompts[0].id, true));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot([articuno]));
    expect(player.bench[1]).toEqual(TestUtils.pokemonSlot([new TestPokemon()]));
  });

  it('Should use Legendary Ascent - switch and move energies', () => {
    const { bench, player, prompts } = TestUtils.getAll(sim);
    const articuno = new ArticunoEx();
    const benchTarget = TestUtils.target(sim, bench[1]);

    TestUtils.setActive(
      sim,
      [new TestPokemon()],
      [CardType.WATER]
    );

    bench[0] = TestUtils.pokemonSlot([new TestPokemon()], [CardType.WATER]);

    player.hand.cards = [articuno];

    // play Articuno from hand to bench 1
    sim.dispatch(new PlayCardAction(1, player.hand.cards.indexOf(articuno), benchTarget));

    // first, the player discards energy from articuno-ex
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Confirm',
      playerId: player.id,
      message: GameMessage.WANT_TO_USE_ABILITY
    }));

    // Confirm
    sim.dispatch(new ResolvePromptAction(prompts[0].id, true));

    // first, the player discards energy from articuno-ex
    expect(prompts.length).toEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Move energy',
      playerId: player.id,
      message: GameMessage.MOVE_ENERGY_TO_ACTIVE
    }));

    const transfers: CardTransfer[] = [{
      from: TestUtils.target(sim, bench[0]),
      to: TestUtils.target(sim, player.active),
      card: player.bench[0].energies.cards[0]
    }];

    // Move energies
    sim.dispatch(new ResolvePromptAction(prompts[1].id, transfers));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();

    expect(player.active).toEqual(TestUtils.pokemonSlot(
      [articuno],
      [CardType.WATER]
    ));
    expect(player.bench[0]).toEqual(TestUtils.pokemonSlot(
      [new TestPokemon()]
    ));
    expect(player.bench[1]).toEqual(TestUtils.pokemonSlot(
      [new TestPokemon()],
      [CardType.WATER]
    ));
  });

  it('Should use Legendary Ascent - switch and don\'t move energies', () => {
    const { bench, player, prompts } = TestUtils.getAll(sim);
    const articuno = new ArticunoEx();
    const benchTarget = TestUtils.target(sim, bench[1]);

    TestUtils.setActive(
      sim,
      [new TestPokemon()],
      [CardType.WATER]
    );

    bench[0] = TestUtils.pokemonSlot([new TestPokemon()], [CardType.WATER]);

    player.hand.cards = [articuno];

    // play Articuno from hand to bench 1
    sim.dispatch(new PlayCardAction(1, player.hand.cards.indexOf(articuno), benchTarget));

    // first, the player discards energy from articuno-ex
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Confirm',
      playerId: player.id,
      message: GameMessage.WANT_TO_USE_ABILITY
    }));

    // Confirm
    sim.dispatch(new ResolvePromptAction(prompts[0].id, true));

    // first, the player discards energy from articuno-ex
    expect(prompts.length).toEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Move energy',
      playerId: player.id,
      message: GameMessage.MOVE_ENERGY_TO_ACTIVE
    }));

    // Move energies
    sim.dispatch(new ResolvePromptAction(prompts[1].id, null));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot([articuno]));

    expect(player.active).toEqual(TestUtils.pokemonSlot(
      [articuno]
    ));
    expect(player.bench[0]).toEqual(TestUtils.pokemonSlot(
      [new TestPokemon()],
      [CardType.WATER]
    ));
    expect(player.bench[1]).toEqual(TestUtils.pokemonSlot(
      [new TestPokemon()],
      [CardType.WATER]
    ));
  });

  it('Should use Legendary Ascent - blocked', () => {
    const { bench, player, prompts } = TestUtils.getAll(sim);
    const articuno = new ArticunoEx();
    const benchTarget = TestUtils.target(sim, bench[1]);

    TestUtils.setActive(
      sim,
      [new TestPokemonBlockPowers()],
      [CardType.WATER, CardType.WATER]
    );

    player.hand.cards = [articuno];

    // play Articuno from hand to bench 1
    sim.dispatch(new PlayCardAction(1, player.hand.cards.indexOf(articuno), benchTarget));

    // no prompt at all
    expect(prompts.length).toEqual(0);
    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();

    expect(player.active).toEqual(
      TestUtils.pokemonSlot(
        [new TestPokemonBlockPowers()],
        [CardType.WATER, CardType.WATER]
      ));

    expect(player.bench[1]).toEqual(TestUtils.pokemonSlot([articuno]));
  });

  it('Should use Cold Crush - opponent has no energies', () => {
    const { player, opponent, prompts } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Cold Crush'));

    // first, the player discards energy from articuno-ex
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      cards: player.active.energies
    }));

    // Choose an energy to discard
    const selected = player.active.energies.cards[0];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, [selected]));

    // Opponent has no energies, so no more prompts
    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.energies.cards).toEqual(TestUtils.makeEnergies([CardType.WATER, CardType.COLORLESS]));
    expect(player.discard.cards).toEqual(TestUtils.makeEnergies([CardType.WATER]));
  });

  it('Should use Cold Crush - opponent discards energies', () => {
    const { player, opponent, prompts } = TestUtils.getAll(sim);

    TestUtils.setDefending(
      sim,
      [new TestPokemon()],
      [CardType.WATER]
    );

    // attack
    sim.dispatch(new AttackAction(1, 'Cold Crush'));

    // first, the player discards energy from articuno-ex
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      cards: player.active.energies
    }));

    // Choose an energy to discard
    const selected = player.active.energies.cards[0];
    sim.dispatch(new ResolvePromptAction(prompts[0].id, [selected]));

    // first, the player discards energy from articuno-ex
    expect(prompts.length).toEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: opponent.id,
      message: GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      cards: opponent.active.energies
    }));

    // Choose an energy to discard
    const opponentSelected = opponent.active.energies.cards[0];
    sim.dispatch(new ResolvePromptAction(prompts[1].id, [opponentSelected]));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();

    expect(player.active).toEqual(
      TestUtils.pokemonSlot(
        [new ArticunoEx()],
        [CardType.WATER, CardType.COLORLESS]
      ));

    const expectedDefending = TestUtils.pokemonSlot([new TestPokemon()]);
    expectedDefending.damage = 50;
    expect(opponent.active).toEqual(expectedDefending);

    expect(player.discard.cards).toEqual(TestUtils.makeEnergies([CardType.WATER]));
    expect(opponent.discard.cards).toEqual(TestUtils.makeEnergies([CardType.WATER]));
  });

  it('Should use Cold Crush - player not discards energies', () => {
    const { player, opponent, prompts } = TestUtils.getAll(sim);

    TestUtils.setDefending(
      sim,
      [new TestPokemon()],
      [CardType.WATER]
    );

    // attack
    sim.dispatch(new AttackAction(1, 'Cold Crush'));

    // first, the player discards energy from articuno-ex
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      cards: player.active.energies
    }));

    // Choose an energy to discard
    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();

    expect(player.active).toEqual(
      TestUtils.pokemonSlot(
        [new ArticunoEx()],
        [CardType.WATER, CardType.WATER, CardType.COLORLESS]
      ));

    const expectedDefending = TestUtils.pokemonSlot(
      [new TestPokemon()],
      [CardType.WATER]
    );
    expectedDefending.damage = 50;
    expect(opponent.active).toEqual(expectedDefending);

    expect(player.discard.cards).toEqual([]);
    expect(opponent.discard.cards).toEqual([]);
  });

  it('Should use Cold Crush - player has no energies', () => {
    const { player, opponent } = TestUtils.getAll(sim);
    player.bench[0].pokemons.cards = [ new TestPokemonIgnoreAttackCost() ];
    player.active.energies.cards = [];

    TestUtils.setDefending(
      sim,
      [new TestPokemon()],
      [CardType.WATER]
    );

    // attack
    sim.dispatch(new AttackAction(1, 'Cold Crush'));

    // Player has no energies, no prompt

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();

    expect(player.active).toEqual(TestUtils.pokemonSlot([new ArticunoEx()]));

    const expectedDefending = TestUtils.pokemonSlot(
      [new TestPokemon()],
      [CardType.WATER]
    );
    expectedDefending.damage = 50;
    expect(opponent.active).toEqual(expectedDefending);

    expect(player.discard.cards).toEqual([]);
    expect(opponent.discard.cards).toEqual([]);
  });

});
