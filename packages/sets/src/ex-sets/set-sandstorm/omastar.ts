import {
  AttackEffect,
  CardType,
  Effect,
  MoveCardsEffect,
  PlayerType,
  PokemonCard,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks } from '../../common';

export class Omastar extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Omanyte';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 110;

  public attacks = [
    {
      name: 'Pull Down',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'If your opponent has any Evolved Pokémon in play, remove the highest Stage Evolution card from each of ' +
        'them and put those cards back into his or her hand.'
    },
    {
      name: 'Hydrocannon',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '30+',
      text:
        'Does 30 damage plus 20 more damage for each W Energy attached to Omastar but not used to pay for this ' +
        'attack\'s Energy cost. You can\'t add more than 40 damage in this way.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Omastar';

  public fullName: string = 'Omastar SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const additionalEnergyDamage = commonAttacks.additionalEnergyDamage(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (pokemonSlot, pokemonCard, cardTarget) => {
        if (pokemonSlot.pokemons.cards.length > 1) {
          const moveCardsEffect = new MoveCardsEffect(effect, [pokemonCard], opponent.hand);
          moveCardsEffect.target = pokemonSlot;
          store.reduceEffect(state, moveCardsEffect);
        }
      });

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return additionalEnergyDamage.use(effect, CardType.WATER, 20, 2);
    }

    return state;
  }
}
