import {
  AttackAction,
  CardType,
  ChooseCardsPrompt,
  ResolvePromptAction,
  State,
  Simulator
} from "@ptcg/common";

import { Bellsprout } from "../../../src/base-sets/set-jungle/bellsprout";
import { TestPokemon } from "../../test-cards/test-pokemon";
import { TestUtils } from "../../test-utils";

describe('Bellsprout JU', () => {
  let sim: Simulator;
  let state: State;

  beforeEach(() => {
    sim = TestUtils.createTestSimulator();
    state = sim.store.state;

    TestUtils.setActive(
      sim,
      [ new Bellsprout() ],
      [ CardType.GRASS, CardType.GRASS ]
    );
  });

  it('Should use Call For Family', () => {
    // bellsprout in the deck
    const { player, deck, prompts } = TestUtils.getAll(sim);
    const bellsprout = new Bellsprout();
    deck.cards.push(bellsprout);

    // attack
    sim.dispatch(new AttackAction(1, 'Call for Family'));
    expect(prompts.length).toEqual(1);
    expect(prompts[0].type).toEqual('Choose cards');

    // choose bellsprout
    sim.dispatch(new ResolvePromptAction(prompts[0].id, [bellsprout]));
    expect(state.turn).toEqual(1);
    expect(state.activePlayer).toEqual(1);
    expect(player.bench[0].pokemons.cards).toEqual([bellsprout]);
    expect(player.bench[0].pokemonPlayedTurn).toEqual(0);
  });

  it('Should use Call For Family - cancel prompt', () => {
    // attack
    sim.dispatch(new AttackAction(1, 'Call for Family'));
    const prompt = TestUtils.getLastPrompt(sim) as ChooseCardsPrompt;
    expect(prompt).toBeTruthy();
    expect(prompt?.type).toEqual('Choose cards');

    // cancel prompt
    sim.dispatch(new ResolvePromptAction(prompt.id, null));
    expect(state.turn).toEqual(1);
    expect(state.activePlayer).toEqual(1);
  });

  it('Should use Call For Family - empty deck', () => {
    // empty deck
    const { deck } = TestUtils.getAll(sim);
    deck.cards = [];
    
    // attack
    sim.dispatch(new AttackAction(1, 'Call for Family'));

    // ends turn without prompt
    const prompt = TestUtils.getLastPrompt(sim);
    expect(prompt).toBeFalsy();
    expect(state.turn).toEqual(1);
    expect(state.activePlayer).toEqual(1);
  });
  
  it('Should use Call For Family - full bench', () => {
    // full bench
    const { bench, prompts } = TestUtils.getAll(sim);
    bench.forEach(b => b.pokemons.cards = [new TestPokemon()]);
    
    // attack
    sim.dispatch(new AttackAction(1, 'Call for Family'));
    const chooseCards = prompts[0] as ChooseCardsPrompt;
    expect(prompts.length).toEqual(1);
    expect(chooseCards.type).toEqual('Choose cards');
    expect(chooseCards.options.min).toEqual(0);
    expect(chooseCards.options.max).toEqual(0);
    expect(chooseCards.options.allowCancel).toEqual(true);

    // cancel prompt
    sim.dispatch(new ResolvePromptAction(chooseCards.id, null));
    expect(state.turn).toEqual(1);
    expect(state.activePlayer).toEqual(1);
  });
});
