import { AttackEffect, CardType, Effect, PlayerType, PokemonCard, Stage, State, StoreLike } from '@ptcg/common';

export class Miltank extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 100;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Powerful Friends',
      cost: [CardType.COLORLESS],
      damage: '10+',
      text: 'If you have any Stage 2 Pokémon on your Bench, this attack does 70 more damage.',
    },
    {
      name: 'Hammer In',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '60',
      text: '',
    },
  ];

  public set: string = 'BW2';

  public name: string = 'Miltank';

  public fullName: string = 'Miltank FLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let hasStage2 = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.stage === Stage.STAGE_2) {
          hasStage2 = true;
        }
      });

      if (hasStage2) {
        effect.damage += 70;
      }
    }

    return state;
  }
}
