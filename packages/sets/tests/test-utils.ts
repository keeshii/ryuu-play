import {
  BotArbiter,
  BotArbiterOptions,
  BotFlipMode,
  BotShuffleMode,
  Card,
  CardList,
  CardTarget,
  CardType,
  EnergyCard,
  GameError,
  GamePhase,
  Player,
  PlayerType,
  PokemonCard,
  PokemonSlot,
  Prompt,
  Simulator,
  SlotType,
  State,
  TrainerCard
} from "@ptcg/common";
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
    return new Simulator(state, options);
  }

  public static setFlipResults(sim: Simulator, flipResults: boolean[]) {
    const botArbiter = new BotArbiter({
      flipMode: BotFlipMode.CUSTOM,
      shuffleMode: BotShuffleMode.REVERSE,
      flipResults
    });
    sim.setBotArbiter(botArbiter);
  }

  public static setActivePlayer(sim: Simulator, player: Player) {
    const state = sim.store.state;
    state.activePlayer = state.players.findIndex(p => p.id === player.id);
  }

  public static getAll(sim: Simulator) {
    const state = sim.store.state;
    const player = state.players[0];
    return {
      state,
      player,
      bench: player.bench,
      deck: player.deck,
      discard: player.discard,
      prizes: player.prizes,
      opponent: state.players[1],
      prompts: state.prompts
    };
  }

  public static lastPrompt(sim: Simulator, player?: Player): Prompt<any> | undefined {
    const prompts = sim.store.state.prompts;
    for (let i = prompts.length - 1; i >= 0; i--) {
      const prompt = prompts[i];
      if (player === undefined || prompt.playerId === player.id) {
        return prompt;
      }
    }
  }

  public static isPlayerTurn(sim: Simulator, player: Player): boolean {
    const state = sim.store.state;

    if (state.phase !== GamePhase.PLAYER_TURN
      || state.activePlayer !== state.players.findIndex(p => p.id === player.id)
      || state.prompts.some(p => p.result === undefined)) {
      return false;
    }
    return true;
  }

  public static setActive(
    sim: Simulator,
    pokemons: PokemonCard[],
    energies: CardType[] = [],
    trainers: TrainerCard[] = []
  ) {
    const pokemonSlot = TestUtils.pokemonSlot(pokemons, energies, trainers);
    const active = sim.store.state.players[0].active;
    active.pokemons.cards = pokemonSlot.pokemons.cards;
    active.energies.cards = pokemonSlot.energies.cards;
    active.trainers.cards = pokemonSlot.trainers.cards;
  }

  public static setDefending(
    sim: Simulator,
    pokemons: PokemonCard[],
    energies: CardType[] = [],
    trainers: TrainerCard[] = []
  ) {
    const pokemonSlot = TestUtils.pokemonSlot(pokemons, energies, trainers);
    const defending = sim.store.state.players[1].active;
    defending.pokemons.cards = pokemonSlot.pokemons.cards;
    defending.energies.cards = pokemonSlot.energies.cards;
    defending.trainers.cards = pokemonSlot.trainers.cards;
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

  public static target(sim: Simulator, pokemonSlot?: PokemonSlot | CardList, pov?: Player): CardTarget {
    const state = sim.store.state;
    pov = pov || state.players[0];

    if (!pokemonSlot) {
      return { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 };
    }

    for (const player of state.players) {
      const playerType = player === pov ? PlayerType.BOTTOM_PLAYER : PlayerType.TOP_PLAYER;

      if (pokemonSlot === player.active) {
        return { player: playerType, slot: SlotType.ACTIVE, index: 0 };
      }

      if (pokemonSlot === player.hand) {
        return { player: playerType, slot: SlotType.HAND, index: 0 };
      }

      if (pokemonSlot === player.discard) {
        return { player: playerType, slot: SlotType.DISCARD, index: 0 };
      }

      let index = player.bench.indexOf(pokemonSlot as PokemonSlot);
      if (index !== -1) {
        return { player: playerType, slot: SlotType.BENCH, index }
      }
    }

    return { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 };
  }

  public static pokemonSlot(
    pokemons: PokemonCard[],
    energies: CardType[] = [],
    trainers: TrainerCard[] = [],
    damage: number = 0
  ): PokemonSlot {
    const pokemonSlot = new PokemonSlot();
    pokemonSlot.pokemons.cards = pokemons;
    pokemonSlot.energies.cards = TestUtils.makeEnergies(energies);
    pokemonSlot.trainers.cards = trainers;
    pokemonSlot.damage = damage;
    return pokemonSlot;
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

  public static getErrorMessage(error: any): string {
    if (error instanceof GameError) {
      return error.message;
    }
    return '';
  }

}
