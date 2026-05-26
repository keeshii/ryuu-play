import {
  AttackAction,
  CardType,
  GameMessage,
  ResolvePromptAction,
  Simulator,
  UseAbilityAction
} from '@ptcg/common';

import { Ditto } from '../../../src/ex-sets/set-firered-and-leafgreen/ditto';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestPokemonBlockPowers } from '../../test-cards/test-pokemon-block-powers';
import { TestPokemonEx } from '../../test-cards/test-pokemon-ex';
import { TestUtils } from "../../test-utils";

describe('Ditto RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new Ditto()],
      [CardType.COLORLESS],
    );
  });

  // Form Variation - Once during your turn (before your attack), you may search your discard pile for a Basic
  // Pokémon (excluding Pokémon-ex and Ditto) and switch it with Ditto. (Any cards attached to Ditto, damage
  // counters, Special Conditions, and effects on it are now on the new Pokémon.) Place Ditto in the discard pile.
  it('Should use Form Variation ability', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim, player.active);

    const testPokemonEx = new TestPokemonEx();
    player.discard.cards = [new TestPokemon(), testPokemonEx];

    // ability
    sim.dispatch(new UseAbilityAction(1, 'Form Variation' , target));

    // Choose card prompt
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_SWITCH,
      cards: player.discard,
      options: jasmine.objectContaining({
        allowCancel: true,
        min: 1,
        max: 1,
        blocked: [player.discard.cards.indexOf(testPokemonEx)]
      })
    }));

    // Choose card
    sim.dispatch(new ResolvePromptAction(prompts[0].id, [player.discard.cards[0]]));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot([new TestPokemon()], [CardType.COLORLESS]));
    expect(player.discard.cards).toEqual([testPokemonEx, new Ditto()]);
  });

  it('Should use Form Variation ability - canceled', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim, player.active);

    player.discard.cards = [new TestPokemon()];

    // ability
    sim.dispatch(new UseAbilityAction(1, 'Form Variation' , target));

    // Choose card prompt
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_SWITCH,
      cards: player.discard,
      options: jasmine.objectContaining({
        allowCancel: true,
        min: 1,
        max: 1,
        blocked: []
      })
    }));

    // Choose card
    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(player.active).toEqual(TestUtils.pokemonSlot([new Ditto()], [CardType.COLORLESS]));
    expect(player.discard.cards).toEqual([new TestPokemon()]);
  });

  it('Should use Form Variation ability - blocked', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim, player.active);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemonBlockPowers()]);

    let message = ''
    try {
      // ability
      sim.dispatch(new UseAbilityAction(1, 'Form Variation' , target));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.CANNOT_USE_POWER);
  });

  it('Should use Form Variation ability - no valid pokemon in discard', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim, player.active);

    const testPokemonEx = new TestPokemonEx();
    player.discard.cards = [testPokemonEx, new Ditto()];

    let message = ''
    try {
      // ability
      sim.dispatch(new UseAbilityAction(1, 'Form Variation' , target));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.CANNOT_USE_POWER);
  });

  // Energy Ball (10+) - Does 10 damage plus 10 more damage for each Energy attached to Ditto but not used to pay
  // for this attack's Energy cost. You can't add more then 20 damage in this way.
  it('Should use Energy Ball attack', () => {
    const { opponent } = TestUtils.getAll(sim);

    // attack
    sim.dispatch(new AttackAction(1, 'Energy Ball'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(10);
  });

  it('Should use Energy Ball attack - one more energy', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    player.active.energies.cards = TestUtils.makeEnergies([CardType.COLORLESS, CardType.COLORLESS]);

    // attack
    sim.dispatch(new AttackAction(1, 'Energy Ball'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(20);
  });

  it('Should use Energy Ball attack - three more energy', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    player.active.energies.cards = TestUtils.makeEnergies([
      CardType.COLORLESS,
      CardType.COLORLESS,
      CardType.COLORLESS,
      CardType.COLORLESS
    ]);

    // attack
    sim.dispatch(new AttackAction(1, 'Energy Ball'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
  });

});
