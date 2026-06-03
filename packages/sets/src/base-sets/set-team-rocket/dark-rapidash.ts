import {
  AttackEffect,
  Card,
  CardType,
  CheckProvidedEnergyEffect,
  ChooseEnergyPrompt,
  ChoosePokemonPrompt,
  DiscardCardsEffect,
  Effect,
  GameMessage,
  PlayerType,
  PokemonCard,
  PutDamageEffect,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

function* useFlamePillar(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
  state = store.reduceEffect(state, checkProvidedEnergy);

  let cards: Card[] = [];
  yield store.prompt(
    state,
    new ChooseEnergyPrompt(
      player.id,
      GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      checkProvidedEnergy.energyMap,
      [CardType.FIRE],
      { allowCancel: false }
    ),
    energy => {
      cards = (energy || []).map(e => e.card);
      next();
    }
  );
  
  const discardEnergy = new DiscardCardsEffect(effect, cards);
  discardEnergy.target = player.active;
  store.reduceEffect(state, discardEnergy);

  const hasBenched = opponent.bench.some(b => b.pokemons.cards.length > 0);
  if (!hasBenched) {
    return state;
  }

  return store.prompt(
    state,
    new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
      PlayerType.TOP_PLAYER,
      [SlotType.BENCH],
      { allowCancel: false }
    ),
    targets => {
      if (!targets || targets.length === 0) {
        return;
      }
      const damageEffect = new PutDamageEffect(effect, 10);
      damageEffect.target = targets[0];
      store.reduceEffect(state, damageEffect);
    }
  );
}

export class DarkRapidash extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Ponyta';

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Rear Kick',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: ''
    },
    {
      name: 'Flame Pillar',
      cost: [CardType.FIRE, CardType.FIRE],
      damage: '30',
      text:
        'You may discard 1 R Energy card attached to Dark Rapidash when you use this attack. If you do and if your ' +
        'opponent has any Benched Pokémon, choose 1 of them and this attack does 10 damage to it. (Don\'t apply ' +
        'Weakness and Resistance for Benched Pokémon.)'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [];

  public set: string = 'TR';

  public name: string = 'Dark Rapidash';

  public fullName: string = 'Dark Rapidash TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const generator = useFlamePillar(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}
