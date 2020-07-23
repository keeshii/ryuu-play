import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, SuperType, TrainerType } from "../../game/store/card/card-types";
import { StoreLike } from "../../game/store/store-like";
import { State } from "../../game/store/state/state";
import { Effect } from "../../game/store/effects/effect";
import { PowerType } from "../../game/store/card/pokemon-types";
import {AttackEffect, DealDamageEffect} from "../../game/store/effects/game-effects";
import {ChooseCardsPrompt, TrainerCard, StateUtils} from "../../game";
import {CardMessage} from "../card-message";
import {TrainerEffect} from "../../game/store/effects/play-card-effects";
import {CheckHpEffect} from "../../game/store/effects/check-effects";
import {WhoBeginsEffect} from "../../game/store/effects/game-phase-effects";

export class Sableye extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 60;

  public resistance = [{
    type: CardType.COLORLESS,
    value: -20
  }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Overeager',
    powerType: PowerType.POKEBODY,
    text: 'If Sableye is your Active Pokemon at the beginning of the game, ' +
      'you go first. (If each player\'s Active Pokemon has the Overreager ' +
      'Poke-Body, this power does nothing.)'
  }];

  public attacks = [
    {
      name: 'Impersonate',
      cost: [],
      damage: 0,
      text: 'Search your deck for a Supporter card and discard it. ' +
        'Shuffle your deck afterward. ' +
        'Then, use the effect of that card as the effect of this attack.'
    },
    {
      name: 'Overconfident',
      cost: [CardType.DARK],
      damage: 10,
      text: 'If the Defending Pokemon has fewer remaining HP than Sableye, ' +
        'this attack\'s base damage is 40.'
    }
  ];

  public set: string = 'DP';

  public name: string = 'Sableye';

  public fullName: string = 'Sableye SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Overeager
    if (effect instanceof WhoBeginsEffect) {
      const cardList = StateUtils.findCardList(state, this);
      const player = StateUtils.findOwner(state, cardList);
      const opponent = StateUtils.getOpponent(state, player);
      const opponentCard = opponent.active.getPokemonCard();
      if (opponentCard && opponentCard.powers.some(p => p.name === 'Overeager')) {
        return state;
      }
      if (cardList === player.active) {
        store.log(state, CardMessage.LOG_STARTS_BECAUSE_OVEREAGER, [player.name]);
        effect.player = player;
      }
      return state;
    }

    // Impersonate
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      store.prompt(state, new ChooseCardsPrompt(
        player.id,
        CardMessage.CHOOSE_SUPPORTER_CARD,
        player.deck,
        { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
        { min: 1, max: 1, allowCancel: true }
      ), (cards) => {
        if (!cards || cards.length === 0) {
          return;
        }
        const trainerCard = cards[0] as TrainerCard;
        const deckIndex = player.deck.cards.indexOf(trainerCard);
        player.deck.moveCardTo(trainerCard, player.hand);
        try {
          const playTrainer = new TrainerEffect(player, trainerCard);
          store.reduceEffect(state, playTrainer);
        } catch (error) {
          player.hand.cards.pop();
          player.deck.cards.splice(deckIndex, 0, trainerCard);
          throw error;
        }
      });

      return state;
    }

    // Overconfident
    if (effect instanceof DealDamageEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const sourceHp = new CheckHpEffect(player, effect.source);
      store.reduceEffect(state, sourceHp);
      const targetHp = new CheckHpEffect(opponent, effect.target);
      store.reduceEffect(state, targetHp);

      const sourceHpLeft = sourceHp.hp - effect.source.damage;
      const targetHpLeft = targetHp.hp - effect.target.damage;

      if (sourceHpLeft > targetHpLeft) {
        effect.damage = 40;
      }
    }

    return state;
  }

}
