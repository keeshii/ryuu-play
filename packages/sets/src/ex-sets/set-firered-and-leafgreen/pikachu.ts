import {
  AttachEnergyPrompt,
  AttackEffect,
  CardType,
  CoinFlipPrompt,
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

function* usePlasma(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  const hasEnergyInDiscard = player.discard.cards.some(c => {
    return c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.provides.includes(CardType.LIGHTNING);
  });
  if (!hasEnergyInDiscard) {
    return state;
  }

  let flipResult = false;
  yield store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
    flipResult = result;
    next();
  });

  if (!flipResult) {
    return state;
  }

  return store.prompt(
    state,
    new AttachEnergyPrompt(
      player.id,
      GameMessage.ATTACH_ENERGY_TO_BENCH,
      player.discard,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE],
      {
        superType: SuperType.ENERGY,
        energyType: EnergyType.BASIC,
        provides: [CardType.LIGHTNING],
      },
      { allowCancel: false, min: 1, max: 1 }
    ),
    transfers => {
      transfers = transfers || [];
      for (const transfer of transfers) {
        const target = StateUtils.getTarget(state, player, transfer.to);
        player.discard.moveCardTo(transfer.card, target.energies);
      }
    }
  );
}

export class Pikachu extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Plasma',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: 'Flip a coin. If heads, search your discard pile for a L Energy card and attach it to Pikachu.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Pikachu';

  public fullName: string = 'Pikachu RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = usePlasma(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
