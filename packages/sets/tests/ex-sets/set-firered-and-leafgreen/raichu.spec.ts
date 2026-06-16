import {
  AttackAction,
  AttachEnergyPrompt,
  CardType,
  GameMessage,
  ResolvePromptAction,
  Simulator,
  SlotType,
} from '@ptcg/common';

import { Raichu } from '../../../src/ex-sets/set-firered-and-leafgreen/raichu';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestPokemonIgnoreAttackCost } from '../../test-cards/test-pokemon-ignore-attack-cost';
import { TestUtils } from '../../test-utils';

describe('Raichu RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

    TestUtils.setActive(
      sim,
      [new Raichu()],
      [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
    );
  });

  // Recharge - Search your deck for up to 2 L Energy cards and attach them to Raichu. Shuffle your deck afterward.
  it('Should use Recharge and attach 2 Lightning energies from deck', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    const activeEnergiesCopy = player.active.energies.cards.slice();
    const deckEnergies = TestUtils.makeEnergies([CardType.LIGHTNING, CardType.LIGHTNING]);
    player.deck.cards.push(...deckEnergies);

    sim.dispatch(new AttackAction(1, 'Recharge'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Choose cards',
      playerId: player.id,
      message: GameMessage.CHOOSE_CARD_TO_ATTACH,
      cards: player.deck,
      filter: jasmine.objectContaining({ name: 'Lightning Energy' })
    }));

    sim.dispatch(new ResolvePromptAction(prompts[0].id, deckEnergies));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.energies.cards).toEqual([...activeEnergiesCopy, ...deckEnergies]);
  });

  it('Should use Recharge and cancel selection', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    const activeEnergiesCopy = player.active.energies.cards.slice();

    sim.dispatch(new AttackAction(1, 'Recharge'));

    expect(prompts.length).toEqual(1);

    sim.dispatch(new ResolvePromptAction(prompts[0].id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.energies.cards).toEqual(activeEnergiesCopy);
  });

  it('Should use Recharge with empty deck and do nothing', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    const activeEnergiesCopy = player.active.energies.cards.slice();
    player.deck.cards = [];

    sim.dispatch(new AttackAction(1, 'Recharge'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.energies.cards).toEqual(activeEnergiesCopy);
  });

  // Thunder Reflection - You may move any number of L Energy cards attached to Raichu to another of your Pokémon.
  it('Should use Thunder Reflection and move one Lightning energy to bench', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    sim.dispatch(new AttackAction(1, 'Thunder Reflection'));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Attach energy',
      playerId: player.id,
      message: GameMessage.ATTACH_ENERGY_TO_BENCH,
      cardList: player.active.energies,
      slots: [SlotType.BENCH],
    }));

    const transfer = [{ card: player.active.energies.cards[0], to: TestUtils.target(sim, player.bench[0]) }];
    sim.dispatch(new ResolvePromptAction((prompts[0] as AttachEnergyPrompt).id, transfer));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.energies.cards).toEqual(TestUtils.makeEnergies([CardType.LIGHTNING, CardType.COLORLESS]));
    expect(player.bench[0].energies.cards).toEqual(TestUtils.makeEnergies([CardType.LIGHTNING]));
  });

  it('Should use Thunder Reflection and cancel', () => {
    const { opponent, player, prompts } = TestUtils.getAll(sim);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemon()]);

    sim.dispatch(new AttackAction(1, 'Thunder Reflection'));

    expect(prompts.length).toEqual(1);

    sim.dispatch(new ResolvePromptAction((prompts[0] as AttachEnergyPrompt).id, null));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.bench[0].energies.cards).toEqual([]);
    expect(player.active.energies.cards).toEqual(
      TestUtils.makeEnergies([CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS]));
  });

  it('Should use Thunder Reflection and do nothing when no Lightning energy attached', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    player.active.energies.cards = TestUtils.makeEnergies([CardType.COLORLESS]);
    player.bench[0] = TestUtils.pokemonSlot([new TestPokemonIgnoreAttackCost()]);

    sim.dispatch(new AttackAction(1, 'Thunder Reflection'));

    expect(TestUtils.isPlayerTurn(sim, opponent)).toBeTrue();
    expect(player.active.energies.cards).toEqual(TestUtils.makeEnergies([CardType.COLORLESS]));
  });

});
