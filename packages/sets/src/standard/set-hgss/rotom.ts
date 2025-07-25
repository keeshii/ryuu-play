import {
  AttackEffect,
  CardType,
  CheckProvidedEnergyEffect,
  ChoosePokemonPrompt,
  ChoosePrizePrompt,
  Effect,
  EndTurnEffect,
  GameError,
  GameMessage,
  PlayerType,
  PlayPokemonEffect,
  PokemonCard,
  PowerEffect,
  PowerType,
  PutDamageEffect,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Rotom extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 60;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.COLORLESS, value: -20 }];

  public retreat = [CardType.COLORLESS];

  public powers = [
    {
      name: 'Mischievous Trick',
      useWhenInPlay: true,
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may switch 1 of ' +
        'your face-down Prize cards with the top card of your deck. ' +
        'This power can\'t be used if Rotom is affected by a Special Condition.',
    },
  ];

  public attacks = [
    {
      name: 'Plasma Arrow',
      cost: [CardType.LIGHTNING],
      damage: '',
      text:
        'Choose 1 of your opponent\'s Pokémon. This attack does 20 ' +
        'damage for each Energy attached to that Pokémon. This attack\'s ' +
        'damage isn\'t affected by Weakness or Resistance.',
    },
  ];

  public set: string = 'HGSS';

  public name: string = 'Rotom';

  public fullName: string = 'Rotom UND';

  public readonly MISCHIEVOUS_TRICK_MAREKER = 'MISCHIEVOUS_TRICK_MAREKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.MISCHIEVOUS_TRICK_MAREKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      if (!pokemonSlot || pokemonSlot.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.MISCHIEVOUS_TRICK_MAREKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      player.marker.addMarker(this.MISCHIEVOUS_TRICK_MAREKER, this);

      state = store.prompt(
        state,
        new ChoosePrizePrompt(player.id, GameMessage.CHOOSE_PRIZE_CARD, {
          count: 1,
          allowCancel: false,
        }),
        prizes => {
          if (prizes && prizes.length > 0) {
            const temp = player.deck.cards[0];
            player.deck.cards[0] = prizes[0].cards[0];
            prizes[0].cards[0] = temp;
          }
        }
      );

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      state = store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false }
        ),
        targets => {
          if (!targets || targets.length === 0) {
            return;
          }
          
          const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(opponent, targets[0]);
          store.reduceEffect(state, checkProvidedEnergyEffect);
          const energyCount = checkProvidedEnergyEffect.energyMap.reduce((left, p) => left + p.provides.length, 0);
          const damage = 20 * energyCount;

          const damageEffect = new PutDamageEffect(effect, damage);
          damageEffect.target = targets[0];
          store.reduceEffect(state, damageEffect);
        }
      );

      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.MISCHIEVOUS_TRICK_MAREKER, this);
    }

    return state;
  }
}
