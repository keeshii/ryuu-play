import {
  AttackEffect,
  BetweenTurnsEffect,
  CardType,
  ChoosePokemonPrompt,
  Effect,
  GameMessage,
  HealEffect,
  PlayerType,
  PokemonCard,
  PokemonSlot,
  PowerEffect,
  PowerType,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Butterfree extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Metapod';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 100;

  public powers = [
    {
      name: 'Sooth Dust',
      powerType: PowerType.POKEBODY,
      text:
        'As long as Butterfree is your Active Pokémon, remove 1 damage counter from each of your Pokémon between ' +
        'turns.'
    },
  ];

  public attacks = [
    {
      name: 'Whirlwind',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
    },
    {
      name: 'Gust',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [];

  public set: string = 'RG';

  public name: string = 'Butterfree';

  public fullName: string = 'Butterfree RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof BetweenTurnsEffect) {
      const player = effect.player;
      const targets: PokemonSlot[] = [];

      if (player.active.getPokemonCard() !== this) {
        return state;
      }

      // Create list of Pokemons to heal
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, pokemonCard) => {
        if (slot.damage >= 10) {
          targets.push(slot);
        }
      });

      // Nothing to heal
      if (targets.length === 0) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      for (const target of targets) {
        const healEffect = new HealEffect(player, target, 10);
        store.reduceEffect(state, healEffect);
      }

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.pokemons.cards.length > 0);

      if (hasBench === false) {
        return state;
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          opponent.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ),
        targets => {
          if (targets && targets.length > 0) {
            opponent.switchPokemon(targets[0]);
          }
        }
      );
    }

    return state;
  }
}
