import {
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  EndTurnEffect,
  GameMessage,
  PokemonCard,
  Stage,
  State,
  StateUtils,
  StoreLike,
  UseAttackEffect,
} from '@ptcg/common';

export class Sandshrew extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 40;

  public attacks = [
    {
      name: 'Sand-attack',
      cost: [CardType.FIGHTING],
      damage: '10',
      text:
        'If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If ' +
        'tails, that attack does nothing.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public resistance = [
    { type: CardType.LIGHTNING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Sandshrew';

  public fullName: string = 'Sandshrew BS';

  public readonly SAND_ATTACK_MARKER = 'SAND_ATTACK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.addMarker(this.SAND_ATTACK_MARKER, this);
    }

    if (effect instanceof UseAttackEffect && effect.player.active.marker.hasMarker(this.SAND_ATTACK_MARKER, this)) {
      const player = effect.player;
      effect.preventDefault = true;
      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        const attackEffect = result ? new UseAttackEffect(player, effect.attack) : new EndTurnEffect(player);
        store.reduceEffect(state, attackEffect);
      });
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.SAND_ATTACK_MARKER);
    }

    return state;
  }

}
