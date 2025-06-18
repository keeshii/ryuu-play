import {
  AttackEffect,
  CardType,
  ChooseAttackPrompt,
  Effect,
  GameLog,
  GameMessage,
  PokemonCard,
  PutDamageEffect,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';
import { commonMarkers } from '../../common';

export class Clefable extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Clefairy';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Metronome',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Choose 1 of the Defending Pokémon\'s attacks. Metronome copies that attack except for its Energy costs and ' +
        'anything else required in order to use that attack, such as discarding Energy cards. (No matter what type ' +
        'the Defending Pokémon is, Clefable\'s type is still Colorless.)'
    },
    {
      name: 'Minimize',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'All damage done by attacks to Clefable during your opponent\'s next turn is reduced by 20 (after applying ' +
        'Weakness and Resistance).'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Clefable';

  public fullName: string = 'Clefable JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    const opponentNextTurn = commonMarkers.duringOpponentNextTurn(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Choose an opponent's Pokemon attack
      const pokemonCard = opponent.active.getPokemonCard();
      if (pokemonCard === undefined || pokemonCard.attacks.length === 0) {
        return state;
      }

      // Don't allow to copy "Metronome" or "Foul Play" as it may cause infinitive loop for AI player
      const bannedAttacks: string[] = [this.attacks[1].name, 'Foul Play'];
      const blocked: { index: number, attack: string }[] = [];
      for (const attack of pokemonCard.attacks) {
        if (bannedAttacks.includes(attack.name)) {
          blocked.push({ index: 0, attack: attack.name });
        }
      }

      return store.prompt(
        state,
        new ChooseAttackPrompt(player.id, GameMessage.CHOOSE_ATTACK_TO_COPY, [pokemonCard], {
          allowCancel: true,
          blocked,
        }),
        attack => {
          if (attack !== null) {
            store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, { name: player.name, attack: attack.name });
            const attackEffect = new AttackEffect(player, opponent, attack);
            store.reduceEffect(state, attackEffect);
            store.waitPrompt(state, () => {
              effect.damage = attackEffect.damage;
            });
          }
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      opponentNextTurn.setMarker(effect, effect.player.active);
      return state;
    }

    if (effect instanceof PutDamageEffect && opponentNextTurn.hasMarker(effect, effect.target)) {
      effect.damage = Math.max(0, effect.damage - 20);
    }

    return state;
  }
}
