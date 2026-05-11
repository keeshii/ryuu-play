import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  ChooseCardsPrompt,
  DiscardCardsEffect,
  Effect,
  GameMessage,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
  SuperType,
} from '@ptcg/common';

function* usePsychoWaves(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;

  if (player.active.energies.cards.length > 0) {
    yield store.prompt(
      state,
      new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        player.active.energies,
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false }
      ),
      selected => {
        const cards = selected || [];
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
        next();
      }
    );
  }

  const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
  store.reduceEffect(state, specialConditionEffect);
  return state;
}

export class Venonat extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Psycho Waves',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'Discard an Energy card attached to Venonat. The Defending Pokémon is now Confused.'
    },
    {
      name: 'Bite',
      cost: [CardType.GRASS],
      damage: '10',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Venonat';

  public fullName: string = 'Venonat RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = usePsychoWaves(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
