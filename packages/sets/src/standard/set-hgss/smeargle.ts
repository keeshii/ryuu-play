import {
  AttackEffect,
  CardType,
  ChooseCardsPrompt,
  CoinFlipPrompt,
  Effect,
  EndTurnEffect,
  GameError,
  GameMessage,
  PlayPokemonEffect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
  TrainerCard,
  TrainerEffect,
  TrainerType,
} from '@ptcg/common';

export class Smeargle extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 70;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public powers = [
    {
      name: 'Portrait',
      useWhenInPlay: true,
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), if Smeargle is your ' +
        'Active Pokémon, you may look at your opponent\'s hand. If you do, ' +
        'choose a Support card you find there and use the effect of that card ' +
        'as the effect of this power. This power can\'t be used if Smeargle ' +
        'is affected by a Special Condition.',
    },
  ];

  public attacks = [
    {
      name: 'Tail Rap',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20×',
      text: 'Flip 2 coins. This attack does 20 damage times the number of heads.',
    },
  ];

  public set: string = 'HGSS';

  public name: string = 'Smeargle';

  public fullName: string = 'Smeargle UND';

  public readonly PORTRAIT_MARKER: string = 'PORTRAIT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.PORTRAIT_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      if (pokemonSlot !== player.active) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (pokemonSlot.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.PORTRAIT_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      player.marker.addMarker(this.PORTRAIT_MARKER, this);

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TO_COPY_EFFECT,
          opponent.hand,
          { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
          { allowCancel: true, min: 1, max: 1 }
        ),
        cards => {
          if (cards === null || cards.length === 0) {
            return;
          }
          const trainerCard = cards[0] as TrainerCard;
          const playTrainerEffect = new TrainerEffect(player, trainerCard);
          store.reduceEffect(state, playTrainerEffect);
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(
        state,
        [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)],
        results => {
          let heads: number = 0;
          results.forEach(r => {
            heads += r ? 1 : 0;
          });
          effect.damage = 20 * heads;
        }
      );
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.PORTRAIT_MARKER, this);
    }

    return state;
  }
}
