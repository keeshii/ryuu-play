import {
  AttackEffect,
  CardType,
  CheckHpEffect,
  DamageMap,
  Effect,
  GameMessage,
  MoveDamagePrompt,
  PlayerType,
  PokemonCard,
  PowerEffect,
  PowerType,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

function* useSinisterHand(
  next: Function,
  store: StoreLike,
  state: State,
  effect: PowerEffect
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const maxAllowedDamage: DamageMap[] = [];
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, (pokemonSlot, card, target) => {
    const checkHpEffect = new CheckHpEffect(opponent, pokemonSlot);
    store.reduceEffect(state, checkHpEffect);
    maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
  });

  return store.prompt(
    state,
    new MoveDamagePrompt(
      effect.player.id,
      GameMessage.MOVE_DAMAGE,
      PlayerType.TOP_PLAYER,
      [SlotType.ACTIVE, SlotType.BENCH],
      maxAllowedDamage,
      { allowCancel: true }
    ),
    transfers => {
      if (transfers === null) {
        return;
      }

      for (const transfer of transfers) {
        const source = StateUtils.getTarget(state, player, transfer.from);
        const target = StateUtils.getTarget(state, player, transfer.to);
        if (source.damage >= 10) {
          source.damage -= 10;
          target.damage += 10;
        }
      }
    }
  );
}

export class Dusknoir extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Dusclops';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 130;

  public weakness = [{ type: CardType.DARK }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Sinister Hand',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text:
        'As often as you like during your turn (before your attack), ' +
        'you may move 1 damage counter from 1 of your opponent\'s Pokémon ' +
        'to another of your opponent\'s Pokémon.',
    },
  ];

  public attacks = [
    {
      name: 'Shadow Punch',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '60',
      text: 'This attack\'s damage isn\'t affected by Resistance.',
    },
  ];

  public set: string = 'BW2';

  public name: string = 'Dusknoir';

  public fullName: string = 'Dusknoir BC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = useSinisterHand(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.ignoreResistance = true;
      return state;
    }

    return state;
  }
}
