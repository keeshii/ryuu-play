import {
  Attack,
  AttackEffect,
  CardType,
  ChoosePokemonPrompt,
  DealDamageEffect,
  Effect,
  GameMessage,
  PlayerType,
  PlayPokemonEffect,
  PokemonCard,
  PowerEffect,
  PowerType,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks } from '../../common';

export class DarkGolbat extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Zubat';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 50;

  public powers = [
    {
      name: 'Sneak Attack',
      powerType: PowerType.POKEPOWER,
      text:
        'When you play Dark Golbat from your hand, you may choose 1 of your opponent\'s Pokémon. If you do, Dark ' +
        'Golbat does 10 damage to that Pokémon. Apply Weakness and Resistance.'
    },
  ];

  public attacks = [
    {
      name: 'Flitter',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: '',
      text:
        'Choose 1 of your opponent\'s Pokémon. This attack does 20 damage to that Pokémon. Don\'t apply Weakness and ' +
        'Resistance for this attack. (Any other effects that would happen after applying Weakness and Resistance ' +
        'still happen.)'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [];

  public set: string = 'TR';

  public name: string = 'Dark Golbat';

  public fullName: string = 'Dark Golbat TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const damageOpponentPokemon = commonAttacks.damageOpponentPokemon(this, store, state, effect);

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = StateUtils.findOwner(state, effect.target);
 
      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {       
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: true }
        ),
        selected => {
          if (!selected || selected.length === 0) {
            return state;
          }
          const attack: Attack =     {
            name: this.powers[0].name,
            cost: [],
            damage: '10',
            text: this.powers[0].text,
          };
          const attackEffect = new AttackEffect(player, opponent, attack);
          const dealDamageEffect = new DealDamageEffect(attackEffect, 10);
          dealDamageEffect.target = selected[0];
          store.reduceEffect(state, dealDamageEffect);
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.ignoreResistance = true;
      effect.ignoreWeakness = true;
      return damageOpponentPokemon.use(effect, 20);
    }

    return state;
  }
}
