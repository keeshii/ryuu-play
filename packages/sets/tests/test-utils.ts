import { BotArbiterOptions, BotFlipMode, BotShuffleMode, Card, CardList, CardType, EnergyCard, GamePhase, Player, PokemonCard, PokemonSlot, Prompt, Simulator, State, TrainerCard } from "@ptcg/common";
import { TestCard } from "./test-cards/test-card";
import { TestEnergy } from "./test-cards/test-energy";
import { TestPokemon } from "./test-cards/test-pokemon";

export class TestUtils {

  public static createTestSimulator(options: Partial<BotArbiterOptions> = {
    flipMode: BotFlipMode.ALL_HEADS,
    shuffleMode: BotShuffleMode.REVERSE
  }): Simulator {
    const state = new State();
    const player = new Player();
    const opponent = new Player();

    player.id = 1;
    opponent.id = 2;

    player.active.pokemons.cards = [new TestPokemon()];
    opponent.active.pokemons.cards = [new TestPokemon()];

    player.deck.cards = TestUtils.makeTestCards(50);
    opponent.deck.cards = TestUtils.makeTestCards(50);

    for (let i = 0; i < 6; i++) {
      player.prizes.push(new CardList());
      player.prizes[i].cards = [new TestCard()];
      opponent.prizes.push(new CardList());
      opponent.prizes[i].cards = [new TestCard()];
    }
    
    for (let i = 0; i < 5; i++) {
      player.bench.push(new PokemonSlot());
      opponent.bench.push(new PokemonSlot());
    }

    state.players = [player, opponent];
    state.phase = GamePhase.PLAYER_TURN;
    return new Simulator(state);
  }

  public static createTailsTestSimulator() {
    return TestUtils.createTestSimulator({
      flipMode: BotFlipMode.ALL_TAILS,
      shuffleMode: BotShuffleMode.REVERSE
    });
  }

  public static getAll(sim: Simulator) {
    const state = sim.store.state;
    const player = state.players[0];
    return {
      state,
      player,
      active: player.active,
      bench: player.bench,
      deck: player.deck,
      discard: player.discard,
      prizes: player.prizes,
      opponent: state.players[1],
      prompts: state.prompts
    };
  }

  public static getLastPrompt(sim: Simulator): Prompt<any> | undefined {
    const prompts = sim.store.state.prompts;
    return prompts.length ? prompts[prompts.length - 1] : undefined;
  }

  public static setActive(
    sim: Simulator,
    pokemons: PokemonCard[],
    energies: CardType[] = [],
    trainers: TrainerCard[] = []
  ) {
    const active = sim.store.state.players[0].active;
    active.pokemons.cards = pokemons;
    active.energies.cards = TestUtils.makeEnergies(energies);
    active.trainers.cards = trainers;
  }

  public static setDefending(
    sim: Simulator,
    pokemons: PokemonCard[],
    energies: CardType[] = [],
    trainers: TrainerCard[] = []
  ) {
    const active = sim.store.state.players[1].active;
    active.pokemons.cards = pokemons;
    active.energies.cards = TestUtils.makeEnergies(energies);
    active.trainers.cards = trainers;
  }

  public static makeTestCards(count: number): Card[] {
    const cards: Card[] = [];
    for (let i = 0; i < count; i++) {
      cards.push(new TestCard());
    }
    return cards;
  }

  public static makeEnergies(cardTypes: CardType[]): EnergyCard[] {
    const cards: EnergyCard[] = [];
    for (let i = 0; i < cardTypes.length; i++) {
      cards.push(new TestEnergy(cardTypes[i]));
    }
    return cards;
  }

  public static getAllCards(sim: Simulator): Card[] {
    const state = sim.store.state;
    const cardLists: CardList[] = [];
    for (const player of state.players) {
      cardLists.push(player.active.pokemons);
      cardLists.push(player.active.energies);
      cardLists.push(player.active.trainers);
      cardLists.push(player.deck);
      cardLists.push(player.discard);
      cardLists.push(player.hand);
      cardLists.push(player.stadium);
      cardLists.push(player.supporter);
      player.bench.forEach(item => cardLists.push(item.pokemons, item.energies, item.trainers));
      player.prizes.forEach(item => cardLists.push(item));
    }
    const cards: Card[] = [];
    for (const cardList of cardLists) {
      for (const card of cardList.cards) {
        cards.push(card);
      }
    }
    return cards;
  }

  public static setCardIds(sim: Simulator): number[] {
    const cards = TestUtils.getAllCards(sim);
    const ids: number[] = [];
    let id = 1;
    for (const card of cards) {
        card.id = id++;
        ids.push(card.id);
    }
    return ids;
  }

  public static getCardIds(sim: Simulator): number[] {
    const cards = TestUtils.getAllCards(sim);
    let ids: number[] = [];
    for (const card of cards) {
        ids.push(card.id);
    }
    ids.sort((a, b) => a - b);
    return ids;
  }

}
