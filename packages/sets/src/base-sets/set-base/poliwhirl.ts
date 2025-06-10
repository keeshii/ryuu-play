import {
  AttackEffect,
  CardType,
  ChooseAttackPrompt,
  CoinFlipPrompt,
  Effect,
  EndTurnEffect,
  GameError,
  GameMessage,
  PokemonCard,
  Stage,
  State,
  StateUtils,
  StoreLike,
  UseAttackEffect,
} from '@ptcg/common';

export class Poliwhirl extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Poliwag';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Amnesia',
      cost: [CardType.WATER, CardType.WATER],
      damage: '',
      text:
        'Choose 1 of the Defending Pokémon\'s attacks. That Pokémon can\'t use that attack during your opponent\'s ' +
        'next turn.'
    },
    {
      name: 'Doubleslap',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: '30×',
      text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Poliwhirl';

  public fullName: string = 'Poliwhirl BS';

  public readonly AMNESIA_MARKER = 'AMNESIA_MARKER_{name}';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseAttackEffect) {
      const player = effect.player;
      const markerName = this.AMNESIA_MARKER.replace('{name}', effect.attack.name);

      if (player.active.marker.hasMarker(markerName, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Choose an opponent's Pokemon attack
      const pokemonCard = opponent.active.getPokemonCard();
      if (pokemonCard === undefined || pokemonCard.attacks.length === 0) {
        return state;
      }

      return store.prompt(
        state,
        new ChooseAttackPrompt(player.id, GameMessage.CHOOSE_ATTACK_TO_COPY, [pokemonCard], {
          allowCancel: true,
        }),
        attack => {
          if (attack !== null) {
            const markerName = this.AMNESIA_MARKER.replace('{name}', attack.name);
            opponent.active.marker.addMarker(markerName, this);
          }
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      return store.prompt(
        state,
        [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)],
        results => {
          let heads: number = 0;
          results.forEach(r => {
            heads += r ? 1 : 0;
          });
          effect.damage = 30 * heads;
        }
      );
    }

    if (effect instanceof EndTurnEffect) {
      const markers = effect.player.active.marker.markers.filter(c => c.source === this);
      for (const marker of markers) {
        effect.player.active.marker.removeMarker(marker.name, marker.source);
      }
    }

    return state;
  }
}
