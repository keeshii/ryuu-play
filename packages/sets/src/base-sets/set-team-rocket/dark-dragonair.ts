import {
  AttackEffect,
  Card,
  CardType,
  ChooseCardsPrompt,
  CoinFlipPrompt,
  Effect,
  GameError,
  GameMessage,
  PokemonCard,
  PowerEffect,
  PowerType,
  ShowCardsPrompt,
  ShuffleDeckPrompt,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';
import { commonMarkers } from '../../common';


function* useEvolutionaryLight(next: Function, store: StoreLike, state: State, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_CARD_TO_HAND,
      player.deck,
      [
        { superType: SuperType.POKEMON, stage: Stage.STAGE_1 },
        { superType: SuperType.POKEMON, stage: Stage.STAGE_2 }
      ],
      { min: 0, max: 1, allowCancel: true }
    ),
    selected => {
      cards = selected || [];
      next();
    }
  );

  player.deck.moveCardsTo(cards, player.hand);

  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () =>
      next()
    );
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class DarkDragonair extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Dratini';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 60;

  public powers = [
    {
      name: 'Evolutionary Light',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'Once during your turn (before your attack), you may search your deck for an Evolution card. Show it to ' +
        'your opponent and put it into your hand. Shuffle your deck afterward. This power can\'t be used if Dark ' +
        'Dragonair is Asleep, Confused, or Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Tail Strike',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '20+',
      text:
        'Flip a coin. If heads, this attack does 20 damage plus 20 more damage; if tails, this attack does 20 ' +
        'damage.'
    },
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Dragonair';

  public fullName: string = 'Dark Dragonair TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const powerUseOnce = commonMarkers.powerUseOnce(this, store, state, effect);
    
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      if (pokemonSlot === undefined
        || pokemonSlot.specialConditions.includes(SpecialCondition.ASLEEP)
        || pokemonSlot.specialConditions.includes(SpecialCondition.CONFUSED)
        || pokemonSlot.specialConditions.includes(SpecialCondition.PARALYZED)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (powerUseOnce.hasMarker(effect)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const generator = useEvolutionaryLight(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
        if (result === true) {
          effect.damage += 20;
        }
      });
    }

    return state;
  }
}
