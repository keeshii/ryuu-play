import {
  AttackAction,
  CardType,
  Simulator,
  TrainerCard,
  TrainerType,
  ResolvePromptAction,
  GameMessage,
  SlotType,
  PlayerType,
  SuperType
} from '@ptcg/common';

import { Farfetchd } from '../../../src/ex-sets/set-firered-and-leafgreen/farfetchd';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from '../../test-utils';

class TestTool extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;
  public set = 'TEST';
  public name = 'Tool';
  public fullName = 'Tool TEST';
}

describe('Farfetch\'d RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Farfetchd()],
      [CardType.COLORLESS],
    );
  });

  // Hoard () - Search your deck for up to 2 Pokémon Tool cards and attach them to any of your Pokémon (excluding
  // Pokémon that already have a Pokémon Tool attached to them). Shuffle your deck afterward.
  it('Should use Hoard attack and attach a Tool to active Pokémon', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);

    // Put a Tool card on top of the deck
    const toolCard = new TestTool();
    player.deck.cards = [ toolCard, ...player.deck.cards ];

    // attack
    sim.dispatch(new AttackAction(1, 'Hoard'));

    // There should be prompts to choose cards and then choose a Pokemon to attach to
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_ATTACH,
      filter: { superType: SuperType.TRAINER, trainerType: TrainerType.TOOL },
      cards: player.deck,
      options: jasmine.objectContaining({ min: 0, max: 1, allowCancel: true })
    }));

    // Choose the top card by index
    sim.dispatch(new ResolvePromptAction(prompts[0].id, [toolCard]));

    // Validate ChoosePokemonPrompt parameters
    expect(prompts.length).toEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS,
      playerType: PlayerType.BOTTOM_PLAYER,
      slots: [ SlotType.ACTIVE, SlotType.BENCH ],
      options: jasmine.objectContaining({ allowCancel: true, blocked: [] })
    }));

    // choose active as target (pass PokemonSlot directly)
    sim.dispatch(new ResolvePromptAction(prompts[1].id, [player.active]));

    // Finally, optional shuffle prompt - resolve if present
    expect(prompts.length).toEqual(3);
    expect(prompts[2]).toEqual(jasmine.objectContaining({
      type: 'Shuffle deck',
      playerId: player.id
    }));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    // Active Pokemon should have one Tool attached (there's only one Pokemon in play)
    expect(player.active.trainers.cards).toEqual([toolCard]);
  });

  it('Should use Hoard attack - canceled', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);

    // Put a Tool card on top of the deck
    const toolCard = new TestTool();
    player.deck.cards = [ toolCard, ...player.deck.cards ];

    // attack
    sim.dispatch(new AttackAction(1, 'Hoard'));

    // There should be prompts to choose cards and then choose a Pokemon to attach to
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_ATTACH,
      filter: { superType: SuperType.TRAINER, trainerType: TrainerType.TOOL },
      cards: player.deck,
      options: jasmine.objectContaining({ min: 0, max: 1, allowCancel: true })
    }));

    // Choose the top card by index
    sim.dispatch(new ResolvePromptAction(prompts[0].id, [toolCard]));

    // Validate ChoosePokemonPrompt parameters
    expect(prompts.length).toEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Choose pokemon',
      playerId: player.id,
      message: GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS,
      playerType: PlayerType.BOTTOM_PLAYER,
      slots: [ SlotType.ACTIVE, SlotType.BENCH ],
      options: jasmine.objectContaining({ allowCancel: true, blocked: [] })
    }));

    // No Pokemon selected
    sim.dispatch(new ResolvePromptAction(prompts[1].id, null));

    // Once again ask for card to attach
    expect(prompts.length).toEqual(3);
    expect(prompts[2]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_ATTACH,
      filter: { superType: SuperType.TRAINER, trainerType: TrainerType.TOOL },
      cards: player.deck,
      options: jasmine.objectContaining({ min: 0, max: 1, allowCancel: true })
    }));

    // No card selected
    sim.dispatch(new ResolvePromptAction(prompts[2].id, null));

    // Finally, optional shuffle prompt - resolve if present
    expect(prompts.length).toEqual(4);
    expect(prompts[3]).toEqual(jasmine.objectContaining({
      type: 'Shuffle deck',
      playerId: player.id
    }));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    // Active Pokemon should have one Tool attached (there's only one Pokemon in play)
    expect(player.active.trainers.cards).toEqual([]);
  });

  it('Should use Hoard attack - empty deck', () => {
    const { opponent, player } = TestUtils.getAll(sim);

    // Player's deck is empty
    player.deck.cards = [];

    // attack
    sim.dispatch(new AttackAction(1, 'Hoard'));

    // No prompts

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    expect(player.active.trainers.cards).toEqual([]);
  });

  it('Should use Hoard attack - no Pokemon without tool', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);

    const toolCard = new TestTool();
    player.active.trainers.cards = [ toolCard ];

    // attack
    sim.dispatch(new AttackAction(1, 'Hoard'));

    // Player cannot choose card, but can look through deck
    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_ATTACH,
      filter: { superType: SuperType.TRAINER, trainerType: TrainerType.TOOL },
      cards: player.deck,
      options: jasmine.objectContaining({ min: 0, max: 0, allowCancel: true })
    }));

    // No card selected
    sim.dispatch(new ResolvePromptAction(prompts[0].id, []));

    // Don't forget to shuffle the deck
    expect(prompts.length).toEqual(2);
    expect(prompts[1]).toEqual(jasmine.objectContaining({
      type: 'Shuffle deck',
      playerId: player.id
    }));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(0);
    expect(player.active.trainers.cards).toEqual([toolCard]);
  });

  // Cross-Cut (10+) - If the Defending Pokémon is an Evolved Pokémon, this attack does 10 damage plus 20 more damage.
  it('Should use Cross-Cut attack and compute damage correctly', () => {
    const { opponent } = TestUtils.getAll(sim);

    // Ensure defending active is single-card (not evolved)
    opponent.active.pokemons.cards = [ opponent.active.pokemons.cards[0] ];

    // attack
    sim.dispatch(new AttackAction(1, 'Cross-Cut'));
    expect(opponent.active.damage).toEqual(10);
  });

  it('Should use Cross-Cut attack and compute damage correctly', () => {
    const { opponent } = TestUtils.getAll(sim);
    opponent.active.pokemons.cards = [ new TestPokemon(), new TestPokemon() ];

    // attack again
    sim.dispatch(new AttackAction(1, 'Cross-Cut'));
    expect(opponent.active.damage).toEqual(30);
  });

});
