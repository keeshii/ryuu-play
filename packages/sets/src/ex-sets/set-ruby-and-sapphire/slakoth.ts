import {
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  EndTurnEffect,
  GameError,
  GameMessage,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Slakoth extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 40;

  public attacks = [
    {
      name: 'Claw',
      cost: [CardType.COLORLESS],
      damage: '20',
      text: 'Flip a coin. If tails, this attack does nothing.',
    },
    {
      name: 'Slack Off',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text: 'Remove all damage counters from Slakoth. Slakoth can\'t attack during your next turn.',
    },
  ];

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Slakoth';

  public fullName: string = 'Slakoth RS';

  public readonly SLACK_OFF_1_MARKER = 'CRITICAL_MOVE_1_MARKER';

  public readonly SLACK_OFF_2_MARKER = 'CRITICAL_MOVE_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === false) {
          effect.damage = 0;
        }
      });
    }

    if (effect instanceof EndTurnEffect) {
      const marker = effect.player.active.marker;
      if (marker.hasMarker(this.SLACK_OFF_2_MARKER, this)) {
        marker.removeMarker(this.SLACK_OFF_2_MARKER);
      } else if (marker.hasMarker(this.SLACK_OFF_1_MARKER, this)) {
        marker.removeMarker(this.SLACK_OFF_1_MARKER);
      }
    }

    if (effect instanceof AttackEffect && effect.player.active.marker.hasMarker(this.SLACK_OFF_1_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      player.active.marker.addMarker(this.SLACK_OFF_1_MARKER, this);
      player.active.marker.addMarker(this.SLACK_OFF_2_MARKER, this);
      player.active.damage = 0;
    }

    return state;
  }
}
