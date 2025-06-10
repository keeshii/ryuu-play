import {
  AttackEffect,
  Card,
  CardType,
  CheckProvidedEnergyEffect,
  ChooseEnergyPrompt,
  DiscardCardsEffect,
  Effect,
  GameMessage,
  GamePhase,
  PokemonCard,
  PowerEffect,
  PowerType,
  PutDamageEffect,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Pyroar extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Litleo';

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 110;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Intimidating Mane',
      powerType: PowerType.ABILITY,
      text: 'Prevent all damage done to this Pokémon by attacks from your opponent\'s Basic Pokémon.',
    },
  ];

  public attacks = [
    {
      name: 'Scorching Fang',
      cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: '60+',
      text: 'You may discard a R Energy attached to this Pokémon. If you do, this attack does 30 more damage.',
    },
  ];

  public set: string = 'BW2';

  public name: string = 'Pyroar';

  public fullName: string = 'Pyroar FLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(
        state,
        new ChooseEnergyPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          checkProvidedEnergy.energyMap,
          [CardType.FIRE],
          { allowCancel: true }
        ),
        energy => {
          const cards: Card[] = (energy || []).map(e => e.card);
          if (cards.length > 0) {
            effect.damage += 30;
            const discardEnergy = new DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            return store.reduceEffect(state, discardEnergy);
          }
        }
      );
    }

    if (effect instanceof PutDamageEffect && effect.target.pokemons.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();

      // It's not this pokemon card
      if (pokemonCard !== this) {
        return state;
      }

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK || !effect.source.isBasic()) {
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      effect.preventDefault = true;
    }

    return state;
  }
}
