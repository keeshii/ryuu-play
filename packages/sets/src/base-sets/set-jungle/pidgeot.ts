import {
  AddMarkerEffect,
  AfterDamageEffect,
  AttackEffect,
  CardType,
  CheckHpEffect,
  Effect,
  EndTurnEffect,
  PokemonCard,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Pidgeot extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Pidgeotto';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Wing Attack',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: ''
    },
    {
      name: 'Hurricane',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text:
        'Unless this attack Knocks Out the Defending Pokémon, return the Defending Pokémon and all cards attached ' +
        'to it to your opponent\'s hand.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [];

  public set: string = 'JU';

  public name: string = 'Pidgeot';

  public fullName: string = 'Pidgeot JU';
  
  public readonly HURRICANE_MARKER = 'HURRICANE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const addMarkerEffect = new AddMarkerEffect(effect, this.HURRICANE_MARKER, this);
      return store.reduceEffect(state, addMarkerEffect);
    }

    if (effect instanceof AfterDamageEffect && effect.target.marker.hasMarker(this.HURRICANE_MARKER, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active !== effect.target) {
        return state;
      }

      const checkHpEffect = new CheckHpEffect(player, effect.target);
      store.reduceEffect(state, checkHpEffect);

      // Unless KO, return cards to opponent's hand
      if (checkHpEffect.hp > effect.target.damage) {
        opponent.active.moveTo(opponent.hand);
      }
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.removeMarker(this.HURRICANE_MARKER, this);
    }

    return state;
  }
}
