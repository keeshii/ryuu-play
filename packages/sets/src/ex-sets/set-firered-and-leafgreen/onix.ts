import {
  AttackEffect,
  CardType,
  Effect,
  GameError,
  GameMessage,
  PokemonCard,
  SlotType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks, commonMarkers } from '../../common';

export class Onix extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Rock Throw',
      cost: [CardType.FIGHTING],
      damage: '10',
      text: ''
    },
    {
      name: 'Tunneling',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: '',
      text:
        'Choose up to 2 of your opponent\'s Benched Pokémon. This attack does 10 damage to each of them. (Don\'t ' +
        'apply Weakness and Resistance for Benched Pokémon.) Onix can\'t attack during your next turn.'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Onix';

  public fullName: string = 'Onix RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const damageOpponentPokemon = commonAttacks.damageOpponentPokemon(this, store, state, effect);
    const duringYourNextTurn = commonMarkers.duringYourNextTurn(this, store, state, effect);

    if (effect instanceof AttackEffect && duringYourNextTurn.hasMarker(effect)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      // Can't use this attack next turn
      duringYourNextTurn.setMarker(effect);
      return damageOpponentPokemon.use(effect, 10, [SlotType.ACTIVE, SlotType.BENCH], { min: 0, max: 2 });
    }

    return state;
  }
}
