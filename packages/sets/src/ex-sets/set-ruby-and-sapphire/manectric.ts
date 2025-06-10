import {
  AttachEnergyPrompt,
  AttackEffect,
  Card,
  CardList,
  CardType,
  ChooseCardsPrompt,
  CoinFlipPrompt,
  DealDamageEffect,
  Effect,
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

function* useAttractCurrent(
  next: Function,
  store: StoreLike,
  state: State,
  effect: AttackEffect
): IterableIterator<State> {
  const player = effect.player;

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
      { min: 1, max: 1, allowCancel: true }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  if (cards.length > 0) {
    const cardList = new CardList();
    player.deck.moveCardsTo(cards, cardList);
    
    yield store.prompt(
      state,
      new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        cardList,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        {
          superType: SuperType.ENERGY,
          energyType: EnergyType.BASIC,
          name: 'Lightning Energy',
        },
        { allowCancel: false, min: 1, max: 1 }
      ),
      transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          cardList.moveCardTo(transfer.card, target.energies);
        }
        next();
      }
    );
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Manectric extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Electrike';

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Attract Current',
      cost: [CardType.COLORLESS],
      damage: '10',
      text:
        'Search your deck for a L Energy card and attach it to 1 of your Pokémon. Shuffle your deck afterward.',
    },
    {
      name: 'Thunder Jolt',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: '50',
      text: 'Flip a coin. If tails, Manectric does 10 damage to itself.',
    },
  ];

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.METAL, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Manectric';

  public fullName: string = 'Manectric RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useAttractCurrent(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === false) {
          const dealDamage = new DealDamageEffect(effect, 10);
          dealDamage.target = player.active;
          return store.reduceEffect(state, dealDamage);
        }
      });
    }

    return state;
  }
}
