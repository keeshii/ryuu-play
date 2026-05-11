import {
  AttackEffect,
  CardList,
  CardType,
  CheckProvidedEnergyEffect,
  ChooseCardsPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  ShuffleDeckPrompt,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks } from '../../common';


function* usePsychicExchange(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  if (player.hand.cards.length > 0) {
    player.hand.moveTo(player.deck);

    yield store.prompt(state, [new ShuffleDeckPrompt(player.id)], deckOrder => {
      player.deck.applyOrder(deckOrder);
      next();
    });
  }

  const deckTop = new CardList();
  deckTop.cards = player.deck.top(8);

  // Nothing to draw
  if (deckTop.cards.length === 0) {
    return state;
  }

  // Draw up to 8 cards.
  // Reconsider different prompt, so it not confuse user, that he can select cards not from the top
  return store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      deckTop,
      {},
      { min: 0, max: deckTop.cards.length, allowCancel: true, isSecret: true }
    ),
    selected => {
      const cards = selected || [];
      player.deck.moveTo(player.hand, cards.length);
    }
  );
}


export class Exeggutor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Exeggcute';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Psychic Exchange',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'Shuffle your hand into your deck. Draw up to 8 cards.'
    },
    {
      name: 'Big Eggsplosion',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '40×',
      text: 'Flip a coin for each Energy attached to Exeggutor. This attack does 40 damage times the number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Exeggutor';

  public fullName: string = 'Exeggutor RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const flipDamageTimes = commonAttacks.flipDamageTimes(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = usePsychicExchange(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);
      const energyCount = checkProvidedEnergy.energyMap.reduce((left, p) => left + p.provides.length, 0);

      return flipDamageTimes.use(effect, energyCount, 40);
    }

    return state;
  }
}
