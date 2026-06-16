import {
  AttackAction,
  CardType,
  GameMessage,
  ResolvePromptAction,
  Simulator,
  SpecialCondition,
  UseAbilityAction,
} from '@ptcg/common';

import { Wigglytuff } from '../../../src/ex-sets/set-firered-and-leafgreen/wigglytuff';
import { TestPokemon } from '../../test-cards/test-pokemon';
import { TestUtils } from "../../test-utils";

describe('Wigglytuff RG', () => {
  let sim: Simulator;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();

   TestUtils.setActive(
      sim,
      [new Wigglytuff()],
      [CardType.COLORLESS, CardType.COLORLESS],
    );
  });

  // Assistance - Once during your turn (before your attack), if Wigglytuff is on your Bench, you may choose 1 of
  // your Active Pokémon and remove 1 Special Condition from it.
  it('Should use Assistance ability', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [new TestPokemon()]);
    player.bench[0] = TestUtils.pokemonSlot([new Wigglytuff()]);
    const target = TestUtils.target(sim, player.bench[0]);

    player.active.addSpecialCondition(SpecialCondition.PARALYZED);
    player.active.addSpecialCondition(SpecialCondition.BURNED);

    // ability
    sim.dispatch(new UseAbilityAction(1, 'Assistance' , target));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Select',
      playerId: player.id,
      message: GameMessage.CHOOSE_SPECIAL_CONDITION,
      values: [
        GameMessage.SPECIAL_CONDITION_PARALYZED,
        GameMessage.SPECIAL_CONDITION_BURNED
      ],
      options: jasmine.objectContaining({ allowCancel: false })
    }));

    // Select option - paralyzed
    sim.dispatch(new ResolvePromptAction(prompts[0].id, 0));

    expect(player.active.specialConditions).toEqual([SpecialCondition.BURNED]);
  });
  
  it('Should not use Assistance ability when Wigglytuff is active', () => {
    const { player } = TestUtils.getAll(sim);
    const target = TestUtils.target(sim, player.active);

    player.active.addSpecialCondition(SpecialCondition.PARALYZED);
    player.active.addSpecialCondition(SpecialCondition.BURNED);

    let message = ''
    try {
      // ability
      sim.dispatch(new UseAbilityAction(1, 'Assistance' , target));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.CANNOT_USE_POWER);
  });

  it('Should not use Assistance ability when active is not affected by special condition', () => {
    const { player } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [new TestPokemon()]);
    player.bench[0] = TestUtils.pokemonSlot([new Wigglytuff()]);
    const target = TestUtils.target(sim, player.bench[0]);

    let message = ''
    try {
      // ability
      sim.dispatch(new UseAbilityAction(1, 'Assistance' , target));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.CANNOT_USE_POWER);
  });
  
  it('Should not use Assistance ability twice duting the same turn', () => {
    const { player, prompts } = TestUtils.getAll(sim);
    TestUtils.setActive(sim, [new TestPokemon()]);
    player.bench[0] = TestUtils.pokemonSlot([new Wigglytuff()]);
    const target = TestUtils.target(sim, player.bench[0]);

    player.active.addSpecialCondition(SpecialCondition.PARALYZED);
    player.active.addSpecialCondition(SpecialCondition.BURNED);

    // ability
    sim.dispatch(new UseAbilityAction(1, 'Assistance' , target));

    expect(prompts.length).toEqual(1);
    expect(prompts[0]).toEqual(jasmine.objectContaining({
      type: 'Select',
      playerId: player.id,
      message: GameMessage.CHOOSE_SPECIAL_CONDITION,
      values: [
        GameMessage.SPECIAL_CONDITION_PARALYZED,
        GameMessage.SPECIAL_CONDITION_BURNED
      ],
      options: jasmine.objectContaining({ allowCancel: false })
    }));

    // Select option - paralyzed
    sim.dispatch(new ResolvePromptAction(prompts[0].id, 1));

    let message = ''
    try {
      // ability
      sim.dispatch(new UseAbilityAction(1, 'Assistance' , target));
    } catch (error) {
      message = TestUtils.getErrorMessage(error);
    }

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(message).toEqual(GameMessage.POWER_ALREADY_USED);
  });

  // Expand (30) - During your opponent's next turn, any damage done to Wigglytuff by attacks is reduced by 10
  // (after applying Weakness and Resistance).
  it('Should use Expand attack', () => {
    const { opponent, player } = TestUtils.getAll(sim);
    const defending = new TestPokemon();
    defending.attacks[0].damage = '50';
    TestUtils.setDefending(sim, [defending]);

    // attack
    sim.dispatch(new AttackAction(1, 'Expand'));

    // opponent attacks, the damage is reduced
    sim.dispatch(new AttackAction(2, 'Test attack'));

    expect(TestUtils.isPlayerTurn(sim, player)).toBeTrue();
    expect(opponent.active.damage).toEqual(30);
    expect(player.active.damage).toEqual(40);
  });

});
