import {
  AttackEffect,
  CardType,
  ChooseCardsPrompt,
  DiscardCardsEffect,
  Effect,
  EndTurnEffect,
  EnergyCard,
  EnergyType,
  GameError,
  GameMessage,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

export class Slaking extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Vigoroth';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 120;

  public powers = [
    {
      name: 'Lazy',
      powerType: PowerType.POKEBODY,
      text: 'As long as Slaking is your Active Pokémon, your opponent\'s Pokémon can\'t use any Poké-Powers.',
    },
  ];

  public attacks = [
    {
      name: 'Critical Move',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '100',
      text:
        'Discard a basic Energy card attached to Slaking or this attack does nothing. Slaking can\'t attack during ' +
        'your next turn.',
    },
  ];

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Slaking';

  public fullName: string = 'Slaking RS';

  public readonly CRITICAL_MOVE_1_MARKER = 'CRITICAL_MOVE_1_MARKER';

  public readonly CRITICAL_MOVE_2_MARKER = 'CRITICAL_MOVE_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.POKEPOWER) {
      const player = effect.player;
      const slakingCardList = StateUtils.findCardList(state, this);
      const slakingPlayer = StateUtils.findOwner(state, slakingCardList);

      // Not active Pokemon
      if (slakingPlayer.active !== slakingCardList) {
        return state;
      }

      // pokemon is evolved
      if (slakingPlayer.active.getPokemonCard() !== this) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
    }

    if (effect instanceof EndTurnEffect) {
      const marker = effect.player.active.marker;
      if (marker.hasMarker(this.CRITICAL_MOVE_2_MARKER, this)) {
        marker.removeMarker(this.CRITICAL_MOVE_2_MARKER);
      } else if (marker.hasMarker(this.CRITICAL_MOVE_1_MARKER, this)) {
        marker.removeMarker(this.CRITICAL_MOVE_1_MARKER);
      }
    }

    if (effect instanceof AttackEffect && effect.player.active.marker.hasMarker(this.CRITICAL_MOVE_1_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      // No basic energy card attached
      if (!player.active.cards.some(c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC)) {
        throw new GameError(GameMessage.NOT_ENOUGH_ENERGY);
      }

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.active,
          { superType: SuperType.ENERGY, stage: Stage.BASIC },
          { min: 1, max: 1, allowCancel: false }
        ),
        cards => {
          cards = cards || [];
          if (cards.length > 0) {
            player.active.marker.addMarker(this.CRITICAL_MOVE_1_MARKER, this);
            player.active.marker.addMarker(this.CRITICAL_MOVE_2_MARKER, this);

            const discardEnergy = new DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
          }
        }
      );
    }

    return state;
  }
}
