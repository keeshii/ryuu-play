import {
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PlayerType,
  PokemonCard,
  PokemonSlot,
  PowerEffect,
  PowerType,
  RetreatEffect,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class DarkDugtrio extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Diglett';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 50;

  public powers = [
    {
      name: 'Sinkhole',
      powerType: PowerType.POKEPOWER,
      text:
        'Whenever your opponent\'s Active Pokémon retreats, your opponent flips a coin. If tails, this power does 20 ' +
        'damage to that Pokémon. (Don\'t apply Weakness and Resistance.) This power stops working while Dark Dugtrio ' +
        'is Asleep, Confused, or Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Knock Down',
      cost: [CardType.FIGHTING, CardType.FIGHTING],
      damage: '20+',
      text:
        'Your opponent flips a coin. If tails, this attack does 20 damage plus 20 more damage; if heads, this ' +
        'attack does 20 damage.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public resistance = [
    { type: CardType.LIGHTNING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Dugtrio';

  public fullName: string = 'Dark Dugtrio TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Put counters on retreating pokemon
    if (effect instanceof RetreatEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let pokemonSlot: PokemonSlot | undefined;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (slot, pokemonCard) => {
        if (pokemonCard === this) {
          pokemonSlot = slot;
        }
      });

      if (pokemonSlot === undefined
        || pokemonSlot.specialConditions.includes(SpecialCondition.ASLEEP)
        || pokemonSlot.specialConditions.includes(SpecialCondition.CONFUSED)
        || pokemonSlot.specialConditions.includes(SpecialCondition.PARALYZED)) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(opponent, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      // Q. Is Dark Dugtrio's Sinkhole Pokémon Power cumulative in any way?
      // A. They are cumulative. You would flip for each Dugtrio's effect (May 4, 2000 WotC Chat, Q20)

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === false) {
          player.active.damage += 20;
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, [new CoinFlipPrompt(opponent.id, GameMessage.COIN_FLIP)], result => {
        if (result === false) {
          effect.damage += 20;
        }
      });
    }

    return state;
  }
}
