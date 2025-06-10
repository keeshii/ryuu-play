import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CheckHpEffect,
  DamageMap,
  Effect,
  EndTurnEffect,
  GameError,
  GameMessage,
  PlayerType,
  PlayPokemonEffect,
  PokemonCard,
  PowerEffect,
  PowerType,
  PutDamagePrompt,
  SlotType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Chandelure extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Lampent';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 130;

  public weakness = [{ type: CardType.DARK }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Cursed Shadow',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text:
        'Once during your turn (before attack), if this Pokémon is your ' +
        'Active Pokémon, you may put 3 damage counters on your opponent\'s ' +
        'Pokémon in any way you like.',
    },
  ];

  public attacks = [
    {
      name: 'Eerie Glow',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: '50',
      text: 'The Defending Pokémon is now Burned and Confused.',
    },
  ];

  public set: string = 'BW3';

  public name: string = 'Chandelure';

  public fullName: string = 'Chandelure NV';

  public readonly CURSED_SHADOW_MAREKER = 'CURSED_SHADOW_MAREKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.CURSED_SHADOW_MAREKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!player.active.pokemons.cards.includes(this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.CURSED_SHADOW_MAREKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const maxAllowedDamage: DamageMap[] = [];
      let damageLeft = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(opponent, cardList);
        store.reduceEffect(state, checkHpEffect);
        damageLeft += checkHpEffect.hp - cardList.damage;
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });

      const damage = Math.min(30, damageLeft);

      return store.prompt(
        state,
        new PutDamagePrompt(
          effect.player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          damage,
          maxAllowedDamage,
          { allowCancel: true }
        ),
        targets => {
          const results = targets || [];
          // cancelled by user
          if (results.length === 0) {
            return;
          }
          player.marker.addMarker(this.CURSED_SHADOW_MAREKER, this);
          for (const result of results) {
            const target = StateUtils.getTarget(state, player, result.target);
            target.damage += result.damage;
          }
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [
        SpecialCondition.BURNED,
        SpecialCondition.CONFUSED,
      ]);
      store.reduceEffect(state, specialConditionEffect);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.CURSED_SHADOW_MAREKER, this);
    }

    return state;
  }
}
