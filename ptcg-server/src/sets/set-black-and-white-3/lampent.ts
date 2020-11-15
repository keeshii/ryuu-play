import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { StoreLike, State, StateUtils, DamageMap, PlayerType, PutDamagePrompt, GameMessage, SlotType } from "../../game";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { Effect } from "../../game/store/effects/effect";
import { CheckHpEffect } from "../../game/store/effects/check-effects";
import { PutCountersEffect } from "../../game/store/effects/attack-effects";

function* useCursedDrop(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const maxAllowedDamage: DamageMap[] = [];
  let damageLeft = 0;
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
    const checkHpEffect = new CheckHpEffect(opponent, cardList);
    store.reduceEffect(state, checkHpEffect);
    damageLeft += checkHpEffect.hp - cardList.damage;
    maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
  });

  const damage = Math.min(30, damageLeft);

  return store.prompt(state, new PutDamagePrompt(
    effect.player.id,
    GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
    PlayerType.TOP_PLAYER,
    [ SlotType.ACTIVE, SlotType.BENCH ],
    damage,
    maxAllowedDamage,
    { allowCancel: false }
  ), targets => {
    const results = targets || [];
    for (const result of results) {
      const target = StateUtils.getTarget(state, player, result.target);
      const putCountersEffect = new PutCountersEffect(effect, result.damage);
      putCountersEffect.target = target;
      store.reduceEffect(state, putCountersEffect);
    }
  });
}

export class Lampent extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Litwick';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 70;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Cursed Drop',
      cost: [ CardType.PSYCHIC ],
      damage: 0,
      text: 'Put 3 damage counters on your opponent\'s Pokemon ' +
        'in any way you like.'
    },
    {
      name: 'Night March',
      cost: [ CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 20,
      text: 'This attack does 20 damage times the number of Pokemon ' +
        'in your discard pile that have the Night March attack.'
    }
  ];

  public set: string = 'BW3';

  public name: string = 'Lampent';

  public fullName: string = 'Lampent PFO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      let generator: IterableIterator<State>;
      generator = useCursedDrop(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      let pokemonCount = 0;
      player.discard.cards.forEach(c => {
        if (c instanceof PokemonCard && c.attacks.some(a => a.name === 'Night March')) {
          pokemonCount += 1;
        }
      });

      effect.damage = pokemonCount * 20;
    }

    return state;
  }

}
