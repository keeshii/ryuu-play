import {
  AttachEnergyPrompt,
  AttackEffect,
  CardTag,
  CardType,
  ChooseCardsPrompt,
  CoinFlipPrompt,
  DiscardCardsEffect,
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
  SuperType
} from '@ptcg/common';

function* useHyperWhirlpool(
  next: Function,
  store: StoreLike,
  state: State,
  effect: AttackEffect
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const max = opponent.active.energies.cards.length;

  // Defending has no energies attached
  if (max === 0) {
    return state;
  }

  let flipResult = false;
  let heads = 0;
  do {
    yield store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
      flipResult = result;
      heads += flipResult ? 1 : 0;
      next();
    });
  } while (flipResult && heads >= max);

  // No heads, nothing to discard
  if (heads === 0) {
    return state;
  }

  return store.prompt(
    state,
    new ChooseCardsPrompt(
      opponent.id,
      GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      opponent.active.energies,
      {},
      { min: heads, max: heads, allowCancel: false }
    ),
    selected => {
      const opponentDiscardEnergy = new DiscardCardsEffect(effect, selected);
      opponentDiscardEnergy.target = opponent.active;
      store.reduceEffect(state, opponentDiscardEnergy);
    }
  );
}

export class BlastoiseEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Wartortle';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 150;

  public powers = [
    {
      name: 'Energy Rain',
      powerType: PowerType.POKEPOWER,
      text:
        'As often as you like during your turn (before your attack), you may attach a W Energy card from your hand ' +
        'to 1 of your Pokémon. Put 1 damage counter on that Pokémon. This power can\'t be used if Blastoise ex is ' +
        'affected by a Special Condition.'
    },
  ];

  public attacks = [
    {
      name: 'Hyper Whirlpool',
      cost: [CardType.WATER, CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: '80',
      text:
        'Flip a coin until you get tails. For each heads, your opponent discards an Energy card attached to the ' +
        'Defending Pokémon.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Blastoise ex';

  public fullName: string = 'Blastoise ex RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      if (!pokemonSlot || pokemonSlot.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard && c.provides.includes(CardType.WATER);
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
          [SlotType.ACTIVE, SlotType.BENCH],
          {
            superType: SuperType.ENERGY,
            energyType: EnergyType.BASIC,
            name: 'Water Energy',
          },
          { allowCancel: true, min: 1, max: 1 }
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
            target.damage += 10;
          }
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useHyperWhirlpool(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
