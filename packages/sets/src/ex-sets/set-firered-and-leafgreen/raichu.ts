import {
  AttachEnergyPrompt,
  AttackEffect,
  Card,
  CardType,
  CheckProvidedEnergyEffect,
  ChooseCardsPrompt,
  Effect,
  EnergyCard,
  EnergyType,
  GameMessage,
  PlayerType,
  PokemonCard,
  ShuffleDeckPrompt,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

function* useRecharge(next: Function, store: StoreLike, state: State, effect: AttackEffect, self: Raichu): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length === 0) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_ATTACH,
      player.deck,
      {
        superType: SuperType.ENERGY,
        energyType: EnergyType.BASIC,
        name: 'Lightning Energy',
      },
      { min: 0, max: 2, allowCancel: true }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  if (cards.length > 0) {
    player.deck.moveCardsTo(cards, player.active.energies);
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Raichu extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Pikachu';

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Recharge',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'Search your deck for up to 2 L Energy cards and attach them to Raichu. Shuffle your deck afterward.'
    },
    {
      name: 'Thunder Reflection',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: '50',
      text: 'You may move any number of L Energy cards attached to Raichu to another of your Pokémon.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Raichu';

  public fullName: string = 'Raichu RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useRecharge(() => generator.next(), store, state, effect, this);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);

      const blocked: number[] = [];
      let hasLightningEnergy = false;

      checkProvidedEnergy.energyMap.forEach(em => {
        if (!em.provides.includes(CardType.LIGHTNING)) {
          blocked.push(player.active.energies.cards.indexOf(em.card));
        } else {
          hasLightningEnergy = true;
        }
      });

      if (!hasLightningEnergy) {
        return state;
      }

      return store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_TO_BENCH,
          player.active.energies,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          {},
          { allowCancel: true, blocked }
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
