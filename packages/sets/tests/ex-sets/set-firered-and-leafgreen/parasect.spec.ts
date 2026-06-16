import {
  AttachEnergyPrompt,
  AttackAction,
  CardAssign,
  CardTag,
  CardType,
  EnergyType,
  GameMessage,
  ResolvePromptAction,
  Simulator,
  SpecialCondition,
  SuperType,
} from '@ptcg/common';

import { Parasect } from '../../../src/ex-sets/set-firered-and-leafgreen/parasect';
import { TestEnergy } from '../../test-cards/test-energy';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestPokemonEx } from '../../test-cards/test-pokemon-ex';
import { TestUtils } from '../../test-utils';

describe('Parasect RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Parasect()],
      [CardType.GRASS, CardType.COLORLESS],
    );
  });

  it('Should use Energy Powder and attach up to 2 basic Energy cards from deck', () => {
    const { player, opponent } = TestUtils.getAll(sim);
    const basicEnergy1 = new TestEnergy(CardType.GRASS);
    const basicEnergy2 = new TestEnergy(CardType.FIGHTING);
    player.deck.cards = [basicEnergy1, basicEnergy2];
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    sim.dispatch(new AttackAction(1, 'Energy Powder'));

    const prompt = TestUtils.lastPrompt(sim) as AttachEnergyPrompt;
    expect(prompt).toEqual(jasmine.objectContaining({
      type: 'Attach energy',
      playerId: player.id,
      message: GameMessage.ATTACH_ENERGY_CARDS,
      cardList: player.deck,
      filter: jasmine.objectContaining({
        superType: SuperType.ENERGY,
        energyType: EnergyType.BASIC,
      }),
      options: jasmine.objectContaining({ min: 1, max: 2, allowCancel: true })
    }));

    const assignActive: CardAssign = {
      to: TestUtils.target(sim, player.active),
      card: basicEnergy1,
    };
    const assignBench: CardAssign = {
      to: TestUtils.target(sim, player.bench[0]),
      card: basicEnergy2,
    };

    sim.dispatch(new ResolvePromptAction(prompt.id, [assignActive, assignBench]));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.energies.cards).toEqual(
      TestUtils.makeEnergies([CardType.GRASS, CardType.COLORLESS, CardType.GRASS])
    );
    expect(player.bench[0].energies.cards).toEqual(
      TestUtils.makeEnergies([CardType.FIGHTING])
    );
    expect(player.deck.cards).toEqual([]);
  });

  it('Should use Energy Powder and exclude Pokemon ex from card attachment', () => {
    const { player, opponent } = TestUtils.getAll(sim);
    const basicEnergy = new TestEnergy(CardType.GRASS);
    player.deck.cards = [basicEnergy];
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemonEx()]);

    sim.dispatch(new AttackAction(1, 'Energy Powder'));

    const prompt = TestUtils.lastPrompt(sim) as AttachEnergyPrompt;
    expect(prompt).toEqual(jasmine.objectContaining({
      type: 'Attach energy',
      playerId: player.id,
      message: GameMessage.ATTACH_ENERGY_CARDS,
      cardList: player.deck,
      filter: jasmine.objectContaining({
        superType: SuperType.ENERGY,
        energyType: EnergyType.BASIC,
      }),
      options: jasmine.objectContaining({
        min: 1,
        max: 2,
        allowCancel: true,
        blockedTo: [TestUtils.target(sim, player.bench[0])]
      })
    }));

    const assignActive: CardAssign = {
      to: TestUtils.target(sim, player.active),
      card: basicEnergy
    };

    sim.dispatch(new ResolvePromptAction(prompt.id, [assignActive]));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.energies.cards).toEqual(
      TestUtils.makeEnergies([CardType.GRASS, CardType.COLORLESS, CardType.GRASS])
    );
    expect(player.deck.cards).toEqual([]);
  });

  it('Should use Energy Powder when no valid target for card assignment', () => {
    const { player, opponent } = TestUtils.getAll(sim);
    player.deck.cards = [new TestEnergy(CardType.GRASS)];
    player.active.pokemons.cards[0].tags = [CardTag.POKEMON_EX];

    sim.dispatch(new AttackAction(1, 'Energy Powder'));

    // No prompt

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.energies.cards).toEqual(
      TestUtils.makeEnergies([CardType.GRASS, CardType.COLORLESS])
    );
    expect(player.deck.cards).toEqual(TestUtils.makeEnergies([CardType.GRASS]));
  });

  it('Should use Energy Powder and cancel the attach prompt', () => {
    const { player, opponent } = TestUtils.getAll(sim);
    player.deck.cards = [new TestEnergy(CardType.GRASS)];

    sim.dispatch(new AttackAction(1, 'Energy Powder'));

    const prompt = TestUtils.lastPrompt(sim) as AttachEnergyPrompt;
    expect(prompt).toEqual(jasmine.objectContaining({
      type: 'Attach energy',
      playerId: player.id,
      message: GameMessage.ATTACH_ENERGY_CARDS,
      cardList: player.deck,
      options: jasmine.objectContaining({ min: 1, max: 2, allowCancel: true })
    }));

    sim.dispatch(new ResolvePromptAction(prompt.id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.energies.cards).toEqual(
      TestUtils.makeEnergies([CardType.GRASS, CardType.COLORLESS])
    );
    expect(player.deck.cards).toEqual([new TestEnergy(CardType.GRASS)]);
  });

  it('Should use Toxic Spore and poison the Defending Pokémon', () => {
    const { opponent } = TestUtils.getAll(sim);

    sim.dispatch(new AttackAction(1, 'Toxic Spore'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
    expect(opponent.active.specialConditions).toEqual([SpecialCondition.POISONED]);
  });
});
