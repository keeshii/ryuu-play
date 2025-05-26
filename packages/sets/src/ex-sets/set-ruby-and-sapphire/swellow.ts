import {
  CardType,
  ChoosePokemonPrompt,
  Effect,
  EndTurnEffect,
  GameError,
  GameMessage,
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
} from '@ptcg/common';

export class Swellow extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Taillow';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 70;

  public powers = [
    {
      name: 'Drive Off',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'Once during your turn (before your attack), if Swellow is your Active Pokémon, you may switch 1 of the ' +
        'Defending Pokémon with 1 of your opponent\'s Benched Pokémon. Your opponent picks the Benched Pokémon to ' +
        'switch. This power can\'t be used if Swellow is affected by a Special Condition.',
    },
  ];

  public attacks = [
    {
      name: 'Wing Attack',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text: '',
    },
  ];

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [];

  public set: string = 'RS';

  public name: string = 'Swellow';

  public fullName: string = 'Swellow RS';

  public readonly DRIVE_OFF_MARKER = 'DRIVE_OFF_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.DRIVE_OFF_MARKER, this);
      return state;
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      if (cardList.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      const hasBench = opponent.bench.some(b => b.cards.length > 0);
      if (hasBench === false) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.DRIVE_OFF_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          opponent.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ),
        targets => {
          player.marker.addMarker(this.DRIVE_OFF_MARKER, this);
          if (targets && targets.length > 0) {
            opponent.switchPokemon(targets[0]);
          }
        }
      );
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.DRIVE_OFF_MARKER, this);
    }

    return state;
  }
}
