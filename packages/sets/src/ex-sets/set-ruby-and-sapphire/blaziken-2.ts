import {
  AddMarkerEffect,
  AttackEffect,
  Card,
  CardType,
  CheckProvidedEnergyEffect,
  ChooseEnergyPrompt,
  DiscardCardsEffect,
  Effect,
  EndTurnEffect,
  GameError,
  GameMessage,
  PokemonCard,
  RetreatEffect,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Blaziken2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Combusken';

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 110;

  public attacks = [
    {
      name: 'Clutch',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: 'The Defending Pokémon can\'t retreat until the end of your opponent\'s next turn.',
    },
    {
      name: 'Flamethrower',
      cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '80',
      text: 'Discard a R Energy card attached to Blaziken.',
    },
  ];

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Blaziken';

  public fullName: string = 'Blaziken RS-2';

  public readonly CLUTCH_MARKER = 'CLUTCH_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const addMarkerEffect = new AddMarkerEffect(effect, this.CLUTCH_MARKER, this);
      return store.reduceEffect(state, addMarkerEffect);
    }

    // Block retreat for opponent's Pokemon with marker.
    if (effect instanceof RetreatEffect) {
      const player = effect.player;

      const hasMarker = player.active.marker.hasMarker(this.CLUTCH_MARKER);
      if (!hasMarker) {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      return store.prompt(
        state,
        new ChooseEnergyPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          checkProvidedEnergy.energyMap,
          [CardType.FIRE],
          { allowCancel: false }
        ),
        energy => {
          const cards: Card[] = (energy || []).map(e => e.card);
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          store.reduceEffect(state, discardEnergy);
        }
      );
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.CLUTCH_MARKER, this);
    }

    return state;
  }
}
