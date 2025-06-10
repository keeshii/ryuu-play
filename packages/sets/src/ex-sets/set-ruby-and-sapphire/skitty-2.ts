import {
  AttachEnergyEffect,
  AttachEnergyPrompt,
  AttackEffect,
  CardType,
  Effect,
  EnergyCard,
  EnergyType,
  GameMessage,
  PlayerType,
  PokemonCard,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

export class Skitty2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 40;

  public attacks = [
    {
      name: 'Plus Energy',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'Attach a basic Energy card from your hand to 1 of your Pokémon.',
    },
    {
      name: 'Scratch',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: '',
    },
  ];

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Skitty';

  public fullName: string = 'Skitty RS-2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (!player.hand.cards.some(c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC)) {
        return state;
      }

      return store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          player.hand,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE],
          {
            superType: SuperType.ENERGY,
            energyType: EnergyType.BASIC,
          },
          { min: 1, max: 1, allowCancel: false }
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
