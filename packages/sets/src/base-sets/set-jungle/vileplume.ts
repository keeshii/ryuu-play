import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardTarget,
  CardType,
  ChoosePokemonPrompt,
  CoinFlipPrompt,
  Effect,
  EndTurnEffect,
  GameError,
  GameMessage,
  HealEffect,
  PlayerType,
  PlayPokemonEffect,
  PokemonCard,
  PokemonSlot,
  PowerEffect,
  PowerType,
  SlotType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

function* useHeal(next: Function, store: StoreLike, state: State, self: Vileplume, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;
  const pokemonSlot = StateUtils.findPokemonSlot(state, self);

  if (!pokemonSlot
    || pokemonSlot.specialConditions.includes(SpecialCondition.ASLEEP)
    || pokemonSlot.specialConditions.includes(SpecialCondition.CONFUSED)
    || pokemonSlot.specialConditions.includes(SpecialCondition.PARALYZED)) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  let hasPokemonWithDamage = false;
  const blocked: CardTarget[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, card, target) => {
    if (pokemonSlot.damage === 0) {
      blocked.push(target);
    } else {
      hasPokemonWithDamage = true;
    }
  });

  if (!hasPokemonWithDamage) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  if (player.marker.hasMarker(self.HEAL_MARKER)) {
    throw new GameError(GameMessage.POWER_ALREADY_USED);
  }

  player.marker.addMarker(self.HEAL_MARKER, self);

  let flipResult = false;
  yield store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
    flipResult = result;
    next();
  });

  if (!flipResult) {
    return state;
  }

  return store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_HEAL,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.ACTIVE, SlotType.BENCH],
    { min: 1, max: 1, allowCancel: false, blocked }
  ), results => {
    const targets: PokemonSlot[] = results || [];

    // Heal Pokemon
    targets.forEach(target => {
      const healEffect = new HealEffect(player, target, 10);
      store.reduceEffect(state, healEffect);
    });
  });
}

export class Vileplume extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Gloom';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 80;

  public powers = [
    {
      name: 'Heal',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may flip a coin. If heads, remove 1 damage counter from 1 ' +
        'of your Pokémon. This power can\'t be used if Vileplume is Asleep, Confused, or Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Petal Dance',
      cost: [CardType.GRASS, CardType.GRASS, CardType.GRASS],
      damage: '40×',
      text:
        'Flip 3 coins. This attack does 40 damage times the number of heads. Vileplume is now Confused (after doing ' +
        'damage).'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Vileplume';

  public fullName: string = 'Vileplume JU';

  public readonly HEAL_MARKER = 'HEAL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.HEAL_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = useHeal(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      specialConditionEffect.target = player.active;
      store.reduceEffect(state, specialConditionEffect);

      return store.prompt(
        state,
        [
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
        ],
        results => {
          let heads: number = 0;
          results.forEach(r => {
            heads += r ? 1 : 0;
          });
          effect.damage = 40 * heads;
        }
      );
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.HEAL_MARKER, this);
    }

    return state;
  }
}
