import {
  AttackEffect,
  Card,
  CardTarget,
  CardType,
  CheckProvidedEnergyEffect,
  ChooseEnergyPrompt,
  DiscardCardsEffect,
  Effect,
  EnergyCard,
  GameMessage,
  MoveEnergyPrompt,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

function* useDarkTrance(next: Function, store: StoreLike, state: State, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;

  const blockedMap: { source: CardTarget; blocked: number[] }[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, card, target) => {
    const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, pokemonSlot);
    store.reduceEffect(state, checkProvidedEnergy);
    const blockedCards: Card[] = [];

    checkProvidedEnergy.energyMap.forEach(em => {
      if (!em.provides.includes(CardType.DARK) && !em.provides.includes(CardType.ANY)) {
        blockedCards.push(em.card);
      }
    });

    const blocked: number[] = [];
    blockedCards.forEach(bc => {
      const index = pokemonSlot.energies.cards.indexOf(bc as EnergyCard);
      if (index !== -1 && !blocked.includes(index)) {
        blocked.push(index);
      }
    });

    if (blocked.length !== 0) {
      blockedMap.push({ source: target, blocked });
    }
  });

  return store.prompt(
    state,
    new MoveEnergyPrompt(
      effect.player.id,
      GameMessage.MOVE_ENERGY_CARDS,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      { },
      { allowCancel: true, blockedMap }
    ),
    transfers => {
      if (transfers === null) {
        return;
      }

      for (const transfer of transfers) {
        const source = StateUtils.getTarget(state, player, transfer.from);
        const target = StateUtils.getTarget(state, player, transfer.to);
        source.moveCardTo(transfer.card, target.energies);
      }
    }
  );
}

export class Hydreigon extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Zweilous';

  public cardTypes: CardType[] = [CardType.DRAGON];

  public hp: number = 150;

  public weakness = [{ type: CardType.DRAGON }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Dark Trance',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text:
        'As often as you like during your turn (before your attack), ' +
        'you may move a D Energy attached to 1 of your Pokémon to another ' +
        'of your Pokémon.',
    },
  ];

  public attacks = [
    {
      name: 'Dragonblast',
      cost: [CardType.PSYCHIC, CardType.DARK, CardType.DARK, CardType.COLORLESS],
      damage: '140',
      text: 'Discard 2 D Energy attached to this Pokémon.',
    },
  ];

  public set: string = 'BW2';

  public name: string = 'Hydreigon';

  public fullName: string = 'Hydreigon DGE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = useDarkTrance(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(
        state,
        new ChooseEnergyPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          checkProvidedEnergy.energyMap,
          [CardType.DARK, CardType.DARK],
          { allowCancel: false }
        ),
        energy => {
          const cards: Card[] = (energy || []).map(e => e.card);

          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          return store.reduceEffect(state, discardEnergy);
        }
      );
    }

    return state;
  }
}
