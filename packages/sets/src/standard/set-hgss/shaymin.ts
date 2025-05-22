import {
  AttackEffect,
  CardType,
  Effect,
  EnergyCard,
  GameMessage,
  HealTargetEffect,
  MoveEnergyPrompt,
  PlayerType,
  PlayPokemonEffect,
  PokemonCard,
  PokemonCardList,
  PowerEffect,
  PowerType,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

export class Shaymin extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [CardType.COLORLESS];

  public powers = [
    {
      name: 'Celebration Wind',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn, when you put Shaymin from your hand onto ' +
        'your Bench, you may move as many Energy cards attached to your ' +
        'Pokémon as you like to any of your other Pokémon.',
    },
  ];

  public attacks = [
    {
      name: 'Energy Bloom',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: '30',
      text: 'Remove 3 damage counters from each of your Pokémon that has any Energy attached to it.',
    },
  ];

  public set: string = 'HGSS';

  public name: string = 'Shaymin';

  public fullName: string = 'Shaymin UNL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      return store.prompt(
        state,
        new MoveEnergyPrompt(
          effect.player.id,
          GameMessage.MOVE_ENERGY_CARDS,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { superType: SuperType.ENERGY },
          { allowCancel: true }
        ),
        transfers => {
          if (transfers === null) {
            return;
          }

          for (const transfer of transfers) {
            const source = StateUtils.getTarget(state, player, transfer.from);
            const target = StateUtils.getTarget(state, player, transfer.to);
            source.moveCardTo(transfer.card, target);
          }
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const targets: PokemonCardList[] = [];

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        const hasEnergy = cardList.cards.some(c => c instanceof EnergyCard);
        if (hasEnergy && cardList.damage > 0) {
          targets.push(cardList);
        }
      });

      targets.forEach(target => {
        const healEffect = new HealTargetEffect(effect, 30);
        healEffect.target = target;
        store.reduceEffect(state, healEffect);
      });
    }

    return state;
  }
}
