import {
  AttackEffect,
  CardTag,
  CardType,
  CheckProvidedEnergyEffect,
  Effect,
  EndTurnEffect,
  GameError,
  GameMessage,
  PlayerType,
  PlayPokemonEffect,
  PokemonCard,
  PokemonSlot,
  PowerEffect,
  PowerType,
  SlotType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class KeldeoEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 170;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Rush In',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text:
        'Once during your turn (before your attack), if this Pokémon is ' +
        'on your Bench, you may switch this Pokémon with your Active Pokémon.',
    },
  ];

  public attacks = [
    {
      name: 'Secret Sword',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50+',
      text: 'Does 20 more damage for each W Energy attached to this Pokémon.',
    },
  ];

  public set: string = 'BW2';

  public name: string = 'Keldeo EX';

  public fullName: string = 'Keldeo EX BC';

  public readonly RUSH_IN_MARKER = 'RUSH_IN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.RUSH_IN_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      let bench: PokemonSlot | undefined;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (card === this && target.slot === SlotType.BENCH) {
          bench = cardList;
        }
      });

      if (bench === undefined) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.RUSH_IN_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      player.marker.addMarker(this.RUSH_IN_MARKER, this);
      player.switchPokemon(bench);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType => {
          return cardType === CardType.WATER || cardType === CardType.ANY;
        }).length;
      });
      effect.damage += energyCount * 20;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.RUSH_IN_MARKER, this);
    }

    return state;
  }
}
