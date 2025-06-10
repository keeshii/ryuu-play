import {
  AddSpecialConditionsEffect,
  AttackEffect,
  Card,
  CardTag,
  CardType,
  CheckProvidedEnergyEffect,
  ChoosePokemonPrompt,
  CoinFlipPrompt,
  DiscardCardsEffect,
  Effect,
  GameMessage,
  PlayerType,
  PokemonCard,
  PutDamageEffect,
  SlotType,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class RaikouEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 170;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Thunder Fang',
      cost: [CardType.LIGHTNING, CardType.COLORLESS],
      damage: '30',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.',
    },
    {
      name: 'Volt Bolt',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: '',
      text:
        'Discard all L Energy attached to this Pokémon. This attack ' +
        'does 100 damage to 1 of your opponent\'s Pokémon. ' +
        '(Don\'t apply Weakness and Resistance for Benched Pokémon.)',
    },
  ];

  public set: string = 'BW2';

  public name: string = 'Raikou EX';

  public fullName: string = 'Raikou EX DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialCondition);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = effect.opponent;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const cards: Card[] = [];
      checkProvidedEnergy.energyMap.forEach(em => {
        if (em.provides.includes(CardType.LIGHTNING) || em.provides.includes(CardType.ANY)) {
          cards.push(em.card);
        }
      });

      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false }
        ),
        selected => {
          const targets = selected || [];
          if (targets.includes(opponent.active)) {
            effect.damage = 100;
            return;
          }
          targets.forEach(target => {
            const damageEffect = new PutDamageEffect(effect, 100);
            damageEffect.target = target;
            store.reduceEffect(state, damageEffect);
          });
        }
      );
    }

    return state;
  }
}
