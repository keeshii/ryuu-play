import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardTag,
  CardType,
  CoinFlipPrompt,
  Effect,
  EndTurnEffect,
  GameMessage,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
  UseAttackEffect,
} from '@ptcg/common';

export class MagmarEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 90;

  public attacks = [
    {
      name: 'Smokescreen',
      cost: [CardType.FIRE],
      damage: '10',
      text:
        'If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If ' +
        'tails, that attack does nothing.',
    },
    {
      name: 'Super Singe',
      cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
      damage: '40',
      text: 'The Defending Pokémon is now Burned.',
    },
  ];

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Magmar ex';

  public fullName: string = 'Magmar ex RS';

  public readonly SMOKESCREEN_MARKER = 'SMOKESCREEN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.addMarker(this.SMOKESCREEN_MARKER, this);
    }

    if (effect instanceof UseAttackEffect && effect.player.active.marker.hasMarker(this.SMOKESCREEN_MARKER, this)) {
      const player = effect.player;
      effect.preventDefault = true;
      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        const attackEffect = result ? new UseAttackEffect(player, effect.attack) : new EndTurnEffect(player);
        store.reduceEffect(state, attackEffect);
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.SMOKESCREEN_MARKER);
    }

    return state;
  }
}
