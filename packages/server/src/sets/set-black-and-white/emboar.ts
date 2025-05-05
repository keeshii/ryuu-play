import { PokemonCard } from '@ptcg/common';
import { Stage, CardType, EnergyType, SuperType } from '@ptcg/common';
import { PowerType, StoreLike, State, StateUtils,
  GameError, GameMessage, EnergyCard, PlayerType, SlotType } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { PowerEffect } from '@ptcg/common';
import { AttachEnergyPrompt } from '@ptcg/common';
import { AttachEnergyEffect } from '@ptcg/common';

export class Emboar extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Pignite';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 150;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Inferno Fandango',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'As often as you like during your turn (before your attack), ' +
      'you may attach a R Energy card from your hand to 1 of your Pokemon.'
  }];

  public attacks = [
    {
      name: 'Heat Crash',
      cost: [ CardType.FIRE, CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 80,
      text: ''
    }
  ];

  public set: string = 'BW';

  public name: string = 'Emboar';

  public fullName: string = 'Emboar LTR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides.includes(CardType.FIRE);
      });
      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH, SlotType.ACTIVE ],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { allowCancel: true }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          const energyCard = transfer.card as EnergyCard;
          const attachEnergyEffect = new AttachEnergyEffect(player, energyCard, target);
          store.reduceEffect(state, attachEnergyEffect);
        }
      });

      return state;
    }

    return state;
  }

}
