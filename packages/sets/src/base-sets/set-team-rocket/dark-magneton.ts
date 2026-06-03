import {
  AttachEnergyPrompt,
  AttackEffect,
  CardType,
  Effect,
  EnergyType,
  GameMessage,
  MoveCardsEffect,
  PlayerType,
  PokemonCard,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType
} from '@ptcg/common';

export class DarkMagneton extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Magnemite';

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Sonicboom',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text:
        'Don\'t apply Weakness and Resistance for this attack. (Any other effects that would happen after applying ' +
        'Weakness and Resistance still happen.)'
    },
    {
      name: 'Magnetic Lines',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING],
      damage: '30',
      text:
        'If the Defending Pokémon has any basic Energy cards attached to it, choose 1 of them. If your opponent has ' +
        'any Benched Pokémon, choose 1 of them and attach that Energy card to it.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Magneton';

  public fullName: string = 'Dark Magneton TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.ignoreResistance = true;
      effect.ignoreWeakness = true;
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.pokemons.cards.length > 0);
      const hasBasicEnergy = opponent.active.energies.cards.some(e => e.energyType === EnergyType.BASIC);

      if (!hasBasicEnergy || !hasBench) {
        return state;
      }

      return store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_TO_BENCH,
          player.active.energies,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          {
            superType: SuperType.ENERGY,
            energyType: EnergyType.BASIC,
          },
          { allowCancel: false, min: 1, max: 1 }
        ),
        transfers => {
          transfers = transfers || [];
          // cancelled by user
          if (transfers.length === 0) {
            return;
          }
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            const moveCardsEffect = new MoveCardsEffect(effect, [transfer.card], target.energies);
            store.reduceEffect(state, moveCardsEffect);
          }
        }
      );
    }

    return state;
  }
}
