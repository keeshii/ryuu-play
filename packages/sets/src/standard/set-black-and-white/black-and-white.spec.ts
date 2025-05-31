/*
For each card test:
1. Describe the game state before the action is taken.
2. Describe the action, any prompts we expect, and how the player responds.
3. Describe expectations after the action completes.
*/

import { Card, CardList, EnergyCard, GameMessage, PokemonCard, PokemonCardList, SlotType } from '@ptcg/common';
import { Bianca } from './bianca';
import { ComputerSearch } from './computer-search';
import { TestUtils } from '@ptcg/common';
import { CrushingHammer } from './crushing-hammer';
import { Emolga } from './emolga';
import { WaterEnergy } from '../set-diamond-and-pearl/water-energy';

describe('Bianca', () => {

  it('draws until you have 6 cards in hand', () => {
    const bianca = new Bianca();
    const hand: CardList = new CardList([bianca]);
    const deck: CardList = new CardList(TestUtils.makeTestCards(6));
    const harness = new TestUtils.TestHarness({player: { hand, deck }});
    const { require, players: [player] } = harness;
    player.playsTrainer(bianca);
    require.player.hand.contains(6);
    require.player.deck.isEmpty();
    require.player.supporter.contains([bianca]);
  });

  it('can\'t be played if the user already has 6 other cards', () => {
    const bianca = new Bianca();
    const hand: CardList = new CardList([bianca, ...TestUtils.makeTestCards(6)]);
    const deck: CardList = new CardList(TestUtils.makeTestCards(6));
    const harness = new TestUtils.TestHarness({player: { hand, deck }});
    const { players: [player] } = harness;
    expect(
      () => player.playsTrainer(bianca)
    ).toThrowError(
      'player\'s hand contains too many cards matching the criteria. Expected at most 5, found 6.');
  });

  it('can\'t be played if the user has no cards in deck', () => {
    const bianca = new Bianca();
    const hand: CardList = new CardList([bianca]);
    const deck: CardList = new CardList([]);
    const harness = new TestUtils.TestHarness({player: { hand, deck }});
    const { players: [player] } = harness;
    expect(
      () => player.playsTrainer(bianca)
    ).toThrowError(
      'player\'s deck unexpectedly empty.');
  });

  it('if the user doesn\'t have enough cards in deck, draw all of them', () => {
    const bianca = new Bianca();
    const hand: CardList = new CardList([bianca, ...TestUtils.makeTestCards(1)]);
    const deck: CardList = new CardList(TestUtils.makeTestCards(2));
    const harness = new TestUtils.TestHarness({player: { hand, deck }});
    const { require, players: [player] } = harness;
    player.playsTrainer(bianca);
    require.player.hand.contains(3);
    require.player.deck.isEmpty();
    require.player.supporter.contains([bianca]);
  });
});


describe('Computer Search', () => {

  it('has basic functionality', () => {
    const computerSearch = new ComputerSearch();
    const hand1: Card = new TestUtils.TestCard('Hand1');
    const hand2: Card = new TestUtils.TestCard('Hand2');
    const deckCards: Card[] = TestUtils.makeTestCards(5);
    const [searchTarget, ...remainingDeckCards] = deckCards;
    const hand: CardList = new CardList([computerSearch, hand1, hand2]);
    const deck: CardList = new CardList(deckCards);
    const harness = new TestUtils.TestHarness({player: { hand, deck }});
    const { require, players: [player] } = harness;
    
    
    player.playsTrainer(computerSearch);
    // We haven't finished resolving computerSearch yet, so the card shouldn't be in the discard pile.
    require.player.discard.doesNotContain(computerSearch);
    player.getsPrompt({
      withText: GameMessage.CHOOSE_CARD_TO_DISCARD,
      withOptions: { min: 2, max: 2, allowCancel: true }
    }).andChooses([hand1, hand2]);
    player.getsPrompt({
      withText: GameMessage.CHOOSE_CARD_TO_HAND,
      withOptions: { min: 1, max: 1, allowCancel: false }}
    ).andChooses([searchTarget]);
    player.shufflesDeck();
    require.player.hand.contains([searchTarget]);
    require.player.discard.contains([hand1, hand2, computerSearch]);

    // Test that the deck was shuffled. It should contain the remaining cards, but not in reversed order.
    require.player.deck.isInOrder(remainingDeckCards.reverse());
  });

  it('can be cancelled', () => {
    const computerSearch = new ComputerSearch();
    const hand1: Card = new TestUtils.TestCard('Hand1');
    const hand2: Card = new TestUtils.TestCard('Hand2');
    const deck1: Card = new TestUtils.TestCard('Deck1');
    const hand: CardList = new CardList([computerSearch, hand1, hand2]);
    const deck: CardList = new CardList([deck1]);
    const harness = new TestUtils.TestHarness({player: { hand, deck }});
    const { require, players: [player] } = harness;
    
    player.playsTrainer(computerSearch);
    player.getsPrompt({
      withText: GameMessage.CHOOSE_CARD_TO_DISCARD,
      withOptions: { min: 2, max: 2, allowCancel: true }
    }).andChooses([]);

    // The player cancelled the prompt, so no cards should be discarded or added to hand.
    require.noPrompts();
    require.player.hand.contains([computerSearch, hand1, hand2]);
  });

  it('without enough cards to discard', () => {
    const computerSearch = new ComputerSearch();
    const hand1: Card = new TestUtils.TestCard('Hand1');
    const deck1: Card = new TestUtils.TestCard('Deck1');
    const hand: CardList = new CardList([computerSearch, hand1]);
    const deck: CardList = new CardList([deck1]);
    const harness = new TestUtils.TestHarness({player: { hand, deck }});
    const { players: [player] } = harness;
    
    expect(
      () => player.playsTrainer(computerSearch)
    ).toThrowError(
      'player\'s hand does not contain enough cards matching the criteria. Expected at least 2, found 1.');
  });

  it('without a valid card to search for', () => {
    const computerSearch = new ComputerSearch();
    const hand1: Card = new TestUtils.TestCard('Hand1');
    const hand2: Card = new TestUtils.TestCard('Hand2');
    const hand: CardList = new CardList([computerSearch, hand1, hand2]);
    const deck: CardList = new CardList([]);
    const harness = new TestUtils.TestHarness({player: { hand, deck }});
    const { players: [player] } = harness;
    
    expect(
      () => player.playsTrainer(computerSearch)
    ).toThrowError(
      'player\'s deck unexpectedly empty.');
  });
});

describe('Crushing Hammer', () => {
  it('has basic functionality: heads', () => {
    const crushingHammer = new CrushingHammer();

    const activePokemon: PokemonCard = new Emolga();
    const activePokemonEnergy: EnergyCard = new WaterEnergy();
    const activePokemonList = new PokemonCardList([activePokemon, activePokemonEnergy]);

    const benchPokemonWithEnergy: PokemonCard = new Emolga();
    const benchPokemonEnergy = new WaterEnergy();
    const benchPokemonWithEnergyList = new PokemonCardList([benchPokemonWithEnergy, benchPokemonEnergy]);

    const benchPokemonWithoutEnergy = new Emolga();
    const benchPokemonWithoutEnergyList = new PokemonCardList([benchPokemonWithoutEnergy]);

    const board = {
      player: { hand: new CardList([crushingHammer]) },
      opponent: { 
        active: activePokemonList,
        bench: [
          benchPokemonWithEnergyList,
          benchPokemonWithoutEnergyList,
        ]
      }};
    const harness = new TestUtils.TestHarness(board);
    const { require, players: [player] } = harness;
    
    player.playsTrainer(crushingHammer);
    // We haven't finished resolving computerSearch yet, so the card shouldn't be in the discard pile.
    require.player.discard.doesNotContain(crushingHammer);

    player.flipsCoinAndGetsHeads();
    player.getsPrompt({
      withText: GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
      withOptions: {
        min: 1,
        max: 1,
        allowCancel: false,
        blocked: [{player: 1, slot: SlotType.BENCH, index: 1}]
      },
    }).andChooses([activePokemonList]);
    player.getsPrompt({
      withText: GameMessage.CHOOSE_CARD_TO_DISCARD,
      withOptions: { allowCancel: false },
    }).andChooses([activePokemonEnergy]);
    require.opponent.activeSpot.contains([activePokemon]);
    require.opponent.activeSpot.doesNotContain(activePokemonEnergy);
    require.opponent.discard.contains([activePokemonEnergy]);
  });

  it('has basic functionality: tails', () => {
    const crushingHammer = new CrushingHammer();
    const targetPokemon: PokemonCard = new Emolga();
    const energy: EnergyCard = new WaterEnergy();
    const active: PokemonCardList = new PokemonCardList([targetPokemon, energy]);
    const hand: CardList = new CardList([crushingHammer]);
    const harness = new TestUtils.TestHarness({player: { hand }, opponent: { active }});
    const { require, players: [player] } = harness;
    
    player.playsTrainer(crushingHammer);
    // We haven't finished resolving computerSearch yet, so the card shouldn't be in the discard pile.
    require.player.discard.doesNotContain(crushingHammer);

    player.flipsCoinAndGetsTails();
    require.noPrompts();
    require.player.discard.contains([crushingHammer]);
  });
});
