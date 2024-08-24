import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, SlotType, StateUtils,
  ChoosePokemonPrompt, GameError, GameMessage } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayItemEffect } from '../../game/store/effects/play-card-effects';


export class SeismitoadEx extends PokemonCard {

  public tags = [ CardTag.POKEMON_EX ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 180;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Quaking Punch',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 30,
      text: 'Your opponent can\'t play any Item cards from his or her hand ' +
        'during his or her next turn.'
    }, {
      name: 'Grenade Hammer',
      cost: [ CardType.WATER, CardType.WATER, CardType.COLORLESS ],
      damage: 130,
      text: 'This attack does 30 damage to 2 of your Benched Pokemon. ' +
        '(Don\'t apply Weakness and Resistance for Benched Pokemon.)'
    },
  ];

  public set: string = 'BW2';

  public name: string = 'Seismitoad EX';

  public fullName: string = 'Seismitoad EX FFI';

  public readonly QUAKING_PUNCH_MAREKER = 'QUAKING_PUNCH_MAREKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.marker.addMarker(this.QUAKING_PUNCH_MAREKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const benched = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);

      if (benched === 0) {
        return state;
      }

      const max = Math.min(2, benched);

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH ],
        { min: max, max, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, 30);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
      });
    }

    if (effect instanceof PlayItemEffect) {
      const player = effect.player;
      if (player.marker.hasMarker(this.QUAKING_PUNCH_MAREKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.QUAKING_PUNCH_MAREKER, this);
    }

    return state;
  }

}
