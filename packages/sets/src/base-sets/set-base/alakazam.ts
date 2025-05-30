import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CheckHpEffect,
  CoinFlipPrompt,
  DamageMap,
  Effect,
  GameError,
  GameMessage,
  MoveDamagePrompt,
  PlayerType,
  PokemonCard,
  PokemonCardList,
  PowerEffect,
  PowerType,
  SlotType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Alakazam extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Kadabra';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 80;

  public powers = [
    {
      name: 'Damage Swap',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: true,
      text:
        'As often as you like during your turn (before your attack), you may move 1 damage counter from 1 of your ' +
        'Pokémon to another as long as you don\'t Knock Out that Pokémon. This power can\'t be used if Alakazam is ' +
        'Asleep, Confused, or Paralyzed. '
    },
  ];

  public attacks = [
    {
      name: 'Confuse Ray',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.PSYCHIC],
      damage: '30',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Alakazam';

  public fullName: string = 'Alakazam BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      if (cardList.specialConditions.includes(SpecialCondition.ASLEEP)
        || cardList.specialConditions.includes(SpecialCondition.CONFUSED)
        || cardList.specialConditions.includes(SpecialCondition.PARALYZED)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const maxAllowedDamage: DamageMap[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(player, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp - 10 });
      });

      return store.prompt(
        state,
        new MoveDamagePrompt(
          effect.player.id,
          GameMessage.MOVE_DAMAGE,
          PlayerType.BOTTOM_PLAYER,
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

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    return state;
  }
}
