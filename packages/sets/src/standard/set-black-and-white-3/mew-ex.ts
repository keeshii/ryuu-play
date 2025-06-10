import {
  AttackEffect,
  CardTag,
  CardType,
  CheckAttackCostEffect,
  CheckProvidedEnergyEffect,
  ChooseAttackPrompt,
  Effect,
  EnergyMap,
  GameError,
  GameMessage,
  MoveEnergyPrompt,
  Player,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  UseAttackEffect,
} from '@ptcg/common';

export class MewEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 120;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public powers = [
    {
      name: 'Versatile',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text:
        'This Pokémon can use the attacks of any Pokémon in play ' +
        '(both yours and your opponent\'s). (You still need the necessary ' +
        'Energy to use each attack.)',
    },
  ];

  public attacks = [
    {
      name: 'Replace',
      cost: [CardType.PSYCHIC],
      damage: '',
      text: 'Move as many Energy attached to your Pokémon to your other Pokémon in any way you like.',
    },
  ];

  public set: string = 'BW3';

  public name: string = 'Mew EX';

  public fullName: string = 'Mew EX LT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Build cards and blocked for Choose Attack prompt
      const { pokemonCards, blocked } = this.buildAttackList(state, store, player);

      // No attacks to copy
      if (pokemonCards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(
        state,
        new ChooseAttackPrompt(player.id, GameMessage.CHOOSE_ATTACK_TO_COPY, pokemonCards, {
          allowCancel: true,
          blocked,
        }),
        attack => {
          if (attack !== null) {
            const useAttackEffect = new UseAttackEffect(player, attack);
            store.reduceEffect(state, useAttackEffect);
          }
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(
        state,
        new MoveEnergyPrompt(
          effect.player.id,
          GameMessage.MOVE_ENERGY_CARDS,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { },
          { allowCancel: true }
        ),
        transfers => {
          if (transfers === null) {
            return;
          }

          for (const transfer of transfers) {
            const source = StateUtils.getTarget(state, player, transfer.from);
            const target = StateUtils.getTarget(state, player, transfer.to);
            source.moveCardTo(transfer.card, target.energies);
          }
        }
      );
    }

    return state;
  }

  private buildAttackList(
    state: State,
    store: StoreLike,
    player: Player
  ): {
    pokemonCards: PokemonCard[];
    blocked: { index: number; attack: string }[];
  } {
    const opponent = StateUtils.getOpponent(state, player);

    const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
    store.reduceEffect(state, checkProvidedEnergyEffect);
    const energyMap = checkProvidedEnergyEffect.energyMap;

    const pokemonCards: PokemonCard[] = [];
    const blocked: { index: number; attack: string }[] = [];
    opponent.forEachPokemon(PlayerType.TOP_PLAYER, (pokemonSlot, card) => {
      this.checkAttack(state, store, player, card, energyMap, pokemonCards, blocked);
    });
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, card) => {
      this.checkAttack(state, store, player, card, energyMap, pokemonCards, blocked);
    });

    return { pokemonCards, blocked };
  }

  private checkAttack(
    state: State,
    store: StoreLike,
    player: Player,
    card: PokemonCard,
    energyMap: EnergyMap[],
    pokemonCards: PokemonCard[],
    blocked: { index: number; attack: string }[]
  ) {
    // No need to include Mew Ex to the list
    if (card instanceof MewEx) {
      return;
    }
    const attacks = card.attacks.filter(attack => {
      const checkAttackCost = new CheckAttackCostEffect(player, attack);
      state = store.reduceEffect(state, checkAttackCost);
      return StateUtils.checkEnoughEnergy(energyMap, checkAttackCost.cost);
    });
    const index = pokemonCards.length;
    pokemonCards.push(card);
    card.attacks.forEach(attack => {
      if (!attacks.includes(attack)) {
        blocked.push({ index, attack: attack.name });
      }
    });
  }
}
