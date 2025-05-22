import {
  AttachEnergyEffect,
  AttachEnergyPrompt,
  AttackEffect,
  CardType,
  CheckProvidedEnergyEffect,
  Effect,
  EnergyCard,
  EnergyType,
  GameError,
  GameMessage,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

export class Blastoise extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Wartortle';

  public cardType: CardType = CardType.WATER;

  public hp: number = 140;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Deluge',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text:
        'As often as you like during your turn (before your attack), ' +
        'you may attach a W Energy card from your hand to 1 of your Pokémon.',
    },
  ];

  public attacks = [
    {
      name: 'Hydro Pump',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '60+',
      text: 'Does 10 more damage for each W Energy attached to this Pokémon.',
    },
  ];

  public set: string = 'BW3';

  public name: string = 'Blastoise';

  public fullName: string = 'Blastoise BC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType => {
          return cardType === CardType.WATER || cardType === CardType.ANY;
        }).length;
      });
      effect.damage += energyCount * 10;
      return state;
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.provides.includes(CardType.WATER);
      });
      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          player.hand,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE],
          {
            superType: SuperType.ENERGY,
            energyType: EnergyType.BASIC,
            name: 'Water Energy',
          },
          { allowCancel: true }
        ),
        transfers => {
          transfers = transfers || [];
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            const energyCard = transfer.card as EnergyCard;
            const attachEnergyEffect = new AttachEnergyEffect(player, energyCard, target);
            store.reduceEffect(state, attachEnergyEffect);
          }
        }
      );
    }

    return state;
  }
}
