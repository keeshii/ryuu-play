import {
  AttackEffect,
  CardType,
  CheckPokemonStatsEffect,
  Effect,
  GameLog,
  GameMessage,
  PokemonCard,
  SelectPrompt,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

import { changeType } from '../../common/markers';

export class Porygon extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 30;

  public attacks = [
    {
      name: 'Conversion 1',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'If the Defending Pokémon has a Weakness, you may change it to a type of your choice other than Colorless.'
    },
    {
      name: 'Conversion 2',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text: 'Change Porygon\'s Resistance to a type of your choice other than Colorless.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Porygon';

  public fullName: string = 'Porygon BS';

  public readonly WEAKNESS_CHANGE_MARKER = 'WEAKNESS_CHANGE_MARKER_';

  public readonly RESISTANCE_CHANGE_MARKER = 'RESISTANCE_CHANGE_MARKER_';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckPokemonStatsEffect) {
      const weakness = changeType.getMarkerType(this, this.WEAKNESS_CHANGE_MARKER, effect.target);
      const resitance = changeType.getMarkerType(this, this.RESISTANCE_CHANGE_MARKER, effect.target);

      if (weakness) {
        effect.weakness = effect.weakness.map(w => ({ type: weakness, value: w.value }));
      }

      if (resitance) {
        effect.resistance = effect.resistance.map(r => ({ type: resitance, value: r.value }));
      }

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonCard = opponent.active.getPokemonCard();

      if (!pokemonCard || pokemonCard.weakness.length === 0) {
        return state;
      }

      return store.prompt(
        state,
        new SelectPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TYPE,
          changeType.PROMPT_OPTIONS.map(p => p.message),
          { allowCancel: true }
        ),
        choice => {
          if (choice === null) {
            return;
          }
          const value = changeType.PROMPT_OPTIONS[choice].value;
          const message = changeType.PROMPT_OPTIONS[choice].message;
          store.log(state, GameLog.LOG_PLAYER_CHANGES_TYPE_TO, { name: player.name, message });
          changeType.removeMarkersByName(this.WEAKNESS_CHANGE_MARKER, opponent.active);
          opponent.active.marker.addMarker(this.WEAKNESS_CHANGE_MARKER + value, this);
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (!pokemonCard || pokemonCard.resistance.length === 0) {
        return state;
      }

      return store.prompt(
        state,
        new SelectPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TYPE,
          changeType.PROMPT_OPTIONS.map(p => p.message),
          { allowCancel: true }
        ),
        choice => {
          if (choice === null) {
            return;
          }
          const value = changeType.PROMPT_OPTIONS[choice].value;
          const message = changeType.PROMPT_OPTIONS[choice].message;
          store.log(state, GameLog.LOG_PLAYER_CHANGES_TYPE_TO, { name: player.name, message });
          changeType.removeMarkersByName(this.RESISTANCE_CHANGE_MARKER, player.active);
          player.active.marker.addMarker(this.RESISTANCE_CHANGE_MARKER + value, this);
        }
      );
    }

    return state;
  }
}
