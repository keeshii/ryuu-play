import {
  AttachEnergyPrompt,
  AttackEffect,
  CardType,
  Effect,
  EnergyCard,
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

export class DarkElectrode extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Voltorb';

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Rolling Tackle',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: ''
    },
    {
      name: 'Energy Bomb',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING],
      damage: '30',
      text:
        'Take all Energy cards attached to Dark Electrode and attach them to your Benched Pokémon (in any way you ' +
        'choose). If you have no Benched Pokémon, discard all Energy cards attached to Dark Electrode.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Electrode';

  public fullName: string = 'Dark Electrode TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const hasBench = player.bench.some(b => b.pokemons.cards.length > 0);
      if (!hasBench) {
        player.active.energies.moveTo(player.discard);
        return state;
      }

      const energyCards = player.active.energies.cards.length;
      if (energyCards === 0) {
        return state;
      }

      state = store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_TO_BENCH,
          player.active.energies,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { superType: SuperType.ENERGY },
          { allowCancel: false, min: energyCards, max: energyCards }
        ),
        transfers => {
          transfers = transfers || [];
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            const energyCard = transfer.card as EnergyCard;
            player.active.energies.moveCardTo(energyCard, target.energies);
          }
        }
      );
    }

    return state;
  }
}
