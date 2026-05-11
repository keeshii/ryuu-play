import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  Effect,
  PlayerType,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Beedrill extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Kakuna';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 90;

  public attacks = [
    {
      name: 'Poison Sting',
      cost: [CardType.GRASS],
      damage: '20',
      text: 'The Defending Pokémon is now Poisoned.'
    },
    {
      name: 'Link Needle',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50+',
      text: 'This attack does 50 damage plus 30 more damage for each Beedrill (excluding this one) you have in play.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [];

  public set: string = 'RG';

  public name: string = 'Beedrill';

  public fullName: string = 'Beedrill RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      let beedrillsInPlay = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, pokemonCard) => {
        if (pokemonCard !== this && pokemonCard.name === 'Beedrill') {
          beedrillsInPlay++;
        }
      });

      effect.damage += 30 * beedrillsInPlay;
    }

    return state;
  }
}
