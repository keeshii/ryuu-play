import {
  AttackEffect,
  Card,
  CardTag,
  CardType,
  CheckProvidedEnergyEffect,
  ChoosePokemonPrompt,
  ConfirmPrompt,
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

export class LandorusEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 180;

  public weakness = [{ type: CardType.WATER }];

  public resistance = [{ type: CardType.LIGHTNING, value: -20 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Hammerhead',
      cost: [CardType.FIGHTING],
      damage: '30',
      text:
        'Does 30 damage to 1 of your opponent\'s Benched Pokémon. ' +
        '(Don\'t apply Weakness and Resistance for Benched Pokémon.)',
    },
    {
      name: 'Land\'s Judgment',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: '80+',
      text: 'You may discard all F Energy attach to this Pokémon. If you do, this attack does 70 more damage.',
    },
  ];

  public set: string = 'BW2';

  public name: string = 'Landorus EX';

  public fullName: string = 'Landorus EX BC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

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
          const damageEffect = new PutDamageEffect(effect, 30);
          damageEffect.target = targets[0];
          store.reduceEffect(state, damageEffect);
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      return store.prompt(state, new ConfirmPrompt(effect.player.id, GameMessage.WANT_TO_DISCARD_ENERGY), result => {
        if (result) {
          const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
          store.reduceEffect(state, checkProvidedEnergy);

          const cards: Card[] = [];
          checkProvidedEnergy.energyMap.forEach(em => {
            if (em.provides.includes(CardType.FIGHTING) || em.provides.includes(CardType.ANY)) {
              cards.push(em.card);
            }
          });

          effect.damage += 70;
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          return store.reduceEffect(state, discardEnergy);
        }
      });
    }

    return state;
  }
}
