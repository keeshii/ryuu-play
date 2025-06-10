import {
  AttackEffect,
  CardType,
  ChoosePokemonPrompt,
  CoinFlipPrompt,
  Effect,
  EndTurnEffect,
  GameError,
  GameMessage,
  PlayerType,
  PlayPokemonEffect,
  PokemonCard,
  PowerEffect,
  PowerType,
  PutDamageEffect,
  SlotType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Hypno extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Drowzee';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 90;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Sleep Pendulum',
      useWhenInPlay: true,
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may flip a coin. ' +
        'If heads, the Defending Pokémon is now Asleep. This power can\'t be ' +
        'used if Hypno is affected by a Special Condition.',
    },
  ];

  public attacks = [
    {
      name: 'Psychic Shot',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text:
        'Does 10 damage to 1 of your opponent\'s Benched Pokémon. ' +
        '(Don\'t apply Weakness and Resistance for Benched Pokémon.)',
    },
  ];

  public set: string = 'HGSS';

  public name: string = 'Hypno';

  public fullName: string = 'Hypno HGSS';

  public readonly SLEEP_PENDULUM_MAREKER = 'SLEEP_PENDULUM_MAREKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.SLEEP_PENDULUM_MAREKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      if (!pokemonSlot || pokemonSlot.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.SLEEP_PENDULUM_MAREKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      player.marker.addMarker(this.SLEEP_PENDULUM_MAREKER, this);

      if (opponent.active.specialConditions.includes(SpecialCondition.ASLEEP)) {
        return state;
      }

      state = store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
        if (result) {
          opponent.active.addSpecialCondition(SpecialCondition.ASLEEP);
        }
      });

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.pokemons.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      state = store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ),
        targets => {
          if (!targets || targets.length === 0) {
            return;
          }
          const damageEffect = new PutDamageEffect(effect, 10);
          damageEffect.target = targets[0];
          store.reduceEffect(state, damageEffect);
        }
      );

      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.SLEEP_PENDULUM_MAREKER, this);
    }

    return state;
  }
}
