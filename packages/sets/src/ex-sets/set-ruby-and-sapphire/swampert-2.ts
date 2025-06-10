import {
  AttachEnergyEffect,
  AttackEffect,
  CardType,
  ChoosePokemonPrompt,
  Effect,
  EndTurnEffect,
  GameMessage,
  PlayerType,
  PlayPokemonEffect,
  PokemonCard,
  PowerEffect,
  PowerType,
  PutDamageEffect,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Swampert2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Marshtomp';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 100;

  public powers = [
    {
      name: 'Natural Remedy',
      powerType: PowerType.POKEBODY,
      text:
        'Once during your turn (before your attack), when you attach a W Energy card from your hand to ' +
        'Swampert, remove 1 damage counter from Swampert.',
    },
  ];

  public attacks = [
    {
      name: 'Water Arrow',
      cost: [CardType.WATER],
      damage: '',
      text:
        'Choose 1 of your opponent\'s Pokémon. This attack does 20 damage to that Pokémon. (Don\'t apply Weakness and ' +
        'Resistance for Benched Pokémon.)',
    },
    {
      name: 'Waterfall',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: '',
    },
  ];

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Swampert';

  public fullName: string = 'Swampert RS-2';

  public readonly NATURAL_REMEDY_MARKER = 'NATURAL_REMEDY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.NATURAL_REMEDY_MARKER, this);
    }

    if (effect instanceof AttachEnergyEffect && effect.target.pokemons.cards.includes(this)) {
      const player = effect.player;
      const pokemonCard = effect.target.getPokemonCard();

      if (effect.target.damage === 0) {
        return state;
      }

      if (!effect.energyCard.provides.includes(CardType.WATER)) {
        return state;
      }

      // pokemon is evolved
      if (pokemonCard !== this) {
        return state;
      }

      // Body already used
      if (player.marker.hasMarker(this.NATURAL_REMEDY_MARKER, this)) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      player.marker.addMarker(this.NATURAL_REMEDY_MARKER, this);
      effect.target.damage -= 10;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false }
        ),
        selected => {
          const targets = selected || [];
          if (targets.includes(opponent.active)) {
            effect.damage = 20;
            return;
          }
          targets.forEach(target => {
            const damageEffect = new PutDamageEffect(effect, 20);
            damageEffect.target = target;
            store.reduceEffect(state, damageEffect);
          });
        }
      );
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.NATURAL_REMEDY_MARKER, this);
    }

    return state;
  }
}
