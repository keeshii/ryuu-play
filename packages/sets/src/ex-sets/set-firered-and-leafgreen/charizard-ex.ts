import {
  AfterCheckProvidedEnergyEffect,
  AfterDamageEffect,
  AttackEffect,
  Card,
  CardTag,
  CardType,
  CheckProvidedEnergyEffect,
  ChooseEnergyPrompt,
  DiscardCardsEffect,
  Effect,
  GameMessage,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class CharizardEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Charmeleon';

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 160;

  public powers = [
    {
      name: 'Energy Flame',
      powerType: PowerType.POKEBODY,
      text: 'All Energy attached to Charizard ex are R Energy instead of its usual type.'
    },
  ];

  public attacks = [
    {
      name: 'Slash',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: ''
    },
    {
      name: 'Burn Down',
      cost: [CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE],
      damage: '200',
      text:
        'Discard 5 R Energy attached to Charizard ex. This attack\'s damage isn\'t affected by Weakness, Resistance, ' +
        'Poké-Powers, Poké-Bodies, and any other effects on the Defending Pokémon.'
    },
  ];

  public weakness = [
    { type: CardType.WATER },
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Charizard ex';

  public fullName: string = 'Charizard ex RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterCheckProvidedEnergyEffect && effect.source.pokemons.cards.includes(this)) {
      const player = effect.player;

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      effect.energyMap.forEach(item => {
        item.provides = item.provides.map(p => CardType.FIRE);
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(
        state,
        new ChooseEnergyPrompt(
          player.id,
          GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
          checkProvidedEnergy.energyMap,
          [CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE],
          { allowCancel: false }
        ),
        energy => {
          const cards: Card[] = (energy || []).map(e => e.card);
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          store.reduceEffect(state, discardEnergy);

          effect.damage = 0;

          const damage = 200;
          opponent.active.damage += damage;
          const afterDamage = new AfterDamageEffect(effect, damage);
          state = store.reduceEffect(state, afterDamage);
        }
      );
    }

    return state;
  }
}
