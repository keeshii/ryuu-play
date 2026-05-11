import {
  AttachEnergyPrompt,
  AttackEffect,
  Card,
  CardTag,
  CardTarget,
  CardType,
  CheckHpEffect,
  CheckProvidedEnergyEffect,
  ChooseCardsPrompt,
  ChoosePokemonPrompt,
  Effect,
  EnergyCard,
  EnergyType,
  GameError,
  GameMessage,
  PlayerType,
  PokemonCard,
  PokemonSlot,
  PowerEffect,
  PowerType,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType
} from '@ptcg/common';

function* useExtraEnergyBomb(next: Function, store: StoreLike, state: State, self: ElectrodeEx, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;
  const pokemonSlot = StateUtils.findPokemonSlot(state, self);

  if (pokemonSlot === undefined || pokemonSlot.specialConditions.length > 0) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  const checkHpEffect = new CheckHpEffect(player, pokemonSlot);
  store.reduceEffect(state, checkHpEffect);
  pokemonSlot.damage = Math.max(checkHpEffect.hp, pokemonSlot.damage);

  // Wait for Knock Out, because player should be able to pickup the energies
  // that he just discarded with electrode ex.
  yield store.waitPrompt(state, () => next());

  let hasAnyOtherPokemon = false;
  const blockedTo: CardTarget[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, card, target) => {
    if (card.tags.includes(CardTag.POKEMON_EX)) {
      blockedTo.push(target);
    } else {
      hasAnyOtherPokemon = true;
    }
  });

  if (!hasAnyOtherPokemon) {
    return state;
  }

  let energies = 0;
  player.discard.cards.forEach((c, index) => {
    if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC) {
      energies += 1;
    }
  });

  return store.prompt(
    state,
    new AttachEnergyPrompt(
      player.id,
      GameMessage.ATTACH_ENERGY_CARDS,
      player.discard,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      {
        superType: SuperType.ENERGY,
        energyType: EnergyType.BASIC
      },
      { allowCancel: false, min: energies, max: energies, blockedTo }
    ),
    transfers => {
      transfers = transfers || [];
      // cancelled by user
      if (transfers.length === 0) {
        return;
      }
      for (const transfer of transfers) {
        const target = StateUtils.getTarget(state, player, transfer.to);
        player.discard.moveCardTo(transfer.card, target.energies);
      }
    }
  );
}


function* useCrushAndBurn(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  let targets: PokemonSlot[] = [];

  do {
    let hasPokemonWithEnergy = false;
    const blocked: CardTarget[] = [];
    opponent.forEachPokemon(PlayerType.TOP_PLAYER, (pokemonSlot, card, target) => {
      if (pokemonSlot.energies.cards.length > 0) {
        hasPokemonWithEnergy = true;
      } else {
        blocked.push(target);
      }
    });

    if (!hasPokemonWithEnergy) {
      return state;
    }

    yield store.prompt(
      state,
      new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: true, blocked }
      ),
      results => {
        targets = results || [];
        next();
      }
    );

    if (targets.length > 0) {
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const target = targets[0];
      let cards: Card[] = [];
      yield store.prompt(
        state,
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          target.energies,
          {},
          { allowCancel: true }
        ),
        selected => {
          cards = selected || [];
          for (const card of cards) {
            const energyMap = checkProvidedEnergy.energyMap.find(em => em.card === card);
            effect.damage += energyMap ? energyMap.provides.length * 20 : 0;
          }
          next();
        }
      );

      target.moveCardsTo(cards, player.discard);
    }

  } while (targets.length > 0);

  return state;
}


export class ElectrodeEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Voltorb';

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 90;

  public powers = [
    {
      name: 'Extra Energy Bomb',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may discard Electrode ex and all the cards attached to it ' +
        '(this counts as Knocking Out Electrode ex). If you do, search your discard pile for 5 Energy cards and ' +
        'attach them to any of your Pokémon (excluding Pokémon-ex) in any way you like. This power can\'t be used if ' +
        'Electrode ex is affected by a Special Condition.'
    },
  ];

  public attacks = [
    {
      name: 'Crush and Burn',
      cost: [CardType.LIGHTNING, CardType.COLORLESS],
      damage: '30+',
      text:
        'You may discard as many Energy as you like attached to your Pokémon in play. If you do, this attack does ' +
        '30 damage plus 20 more damage for each Energy you discarded.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Electrode ex';

  public fullName: string = 'Electrode ex RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = useExtraEnergyBomb(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useCrushAndBurn(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
