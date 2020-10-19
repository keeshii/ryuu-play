import { PokemonCard } from "../../game/store/card/pokemon-card";
import { Stage, CardType, SuperType } from "../../game/store/card/card-types";
import { StoreLike, State, ChooseCardsPrompt, PokemonCardList, Card,
  ShuffleDeckPrompt, 
  StateUtils} from "../../game";
import { AttackEffect } from "../../game/store/effects/game-effects";
import { Effect } from "../../game/store/effects/effect";
import { CardMessage } from "../card-message";
import { CheckProvidedEnergyEffect } from "../../game/store/effects/check-effects";
import { DealDamageEffect } from "../../game/store/effects/attack-effects";

function* useEntrainment(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
  const max = Math.min(slots.length, 2);

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    CardMessage.CHOOSE_BASIC_POKEMON,
    player.deck,
    { superType: SuperType.POKEMON, stage: Stage.BASIC },
    { min: 0, max, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length > slots.length) {
    cards.length = slots.length;
  }

  cards.forEach((card, index) => {
    player.deck.moveCardTo(card, slots[index]);
  });

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
    next()
  });
}

export class Dedenne extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.METAL, value: -20 }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Entrainment',
      cost: [ CardType.COLORLESS ],
      damage: 0,
      text: 'Search your deck for up to 2 Basic Pokemon and put them onto ' +
        'your Bench. Shuffle your deck afterward.'
    },
    {
      name: 'Energy Short',
      cost: [ CardType.COLORLESS ],
      damage: 20,
      text: 'This attack does 20 damage times the amount of Energy attached ' +
        'to your opponent\'s Active Pokemon.'
    }
  ];

  public set: string = 'BW2';

  public name: string = 'Dedenne';

  public fullName: string = 'Dedenne FFI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      let generator: IterableIterator<State>;
      generator = useEntrainment(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof DealDamageEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      effect.damage = 0;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      const energyCount = checkProvidedEnergyEffect.energyMap.reduce((left, p) => left + p.provides.length, 0);
      const damage = energyCount * 20;

      const dealDamageEffect = new DealDamageEffect(player, damage,
        effect.attack, opponent.active, player.active);
      store.reduceEffect(state, dealDamageEffect);
    }

    return state;
  }

}
