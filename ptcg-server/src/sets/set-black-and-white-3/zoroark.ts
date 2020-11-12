import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { GameMessage, GameLog } from "../../game/game-message";
import { StateUtils } from "../../game/store/state-utils";
import { ChooseCardsPrompt } from "../../game/store/prompts/choose-cards-prompt";
import { ShuffleDeckPrompt } from "../../game/store/prompts/shuffle-prompt";
import { Card } from "../../game/store/card/card";
import { ChooseAttackPrompt } from "../../game/store/prompts/choose-attack-prompt";
import { Attack } from "../../game/store/card/pokemon-types";
import { DealDamageEffect } from "../../game/store/effects/attack-effects";

function* useNastyPlot(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length === 0) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { },
    { min: 1, max: 1, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  player.deck.moveCardsTo(cards, player.hand);

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

function* useFoulPlay(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const pokemonCard = opponent.active.getPokemonCard();

  if (pokemonCard === undefined || pokemonCard.attacks.length === 0) {
    return state;
  }

  let selected: any;
  yield store.prompt(state, new ChooseAttackPrompt(
    player.id,
    GameMessage.CHOOSE_ATTACK_TO_COPY,
    [ pokemonCard ],
    { allowCancel: false }
  ), result => {
    selected = result;
    next();
  });

  const attack: Attack | null = selected;

  if (attack === null) {
    return state;
  }

  store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, {
    name: player.name,
    attack: attack.name
  });

  // Perform attack
  const attackEffect = new AttackEffect(player, opponent, attack);
  store.reduceEffect(state, attackEffect);

  if (store.hasPrompts()) {
    yield store.waitPrompt(state, () => next());
  }

  if (attackEffect.damage > 0) {
    const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
    state = store.reduceEffect(state, dealDamage);
  }

  return state;
}


export class Zoroark extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Zorua';

  public cardType: CardType = CardType.DARK;

  public hp: number = 100;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Nasty Plot',
    cost: [ CardType.DARK ],
    damage: 0,
    text: 'Search your deck for a card and put it into your hand. ' +
      'Shuffle your deck afterward.'
  }, {
    name: 'Foul Play',
    cost: [ CardType.COLORLESS, CardType.COLORLESS ],
    damage: 0,
    text: 'Choose 1 of the Defending Pokemon\'s attacks and use it ' +
      'as this attack.'
  }];

  public set: string = 'BW3';

  public name: string = 'Zoroark';

  public fullName: string = 'Zoroark BW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      let generator: IterableIterator<State>;
      generator = useNastyPlot(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      let generator: IterableIterator<State>;
      generator = useFoulPlay(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
