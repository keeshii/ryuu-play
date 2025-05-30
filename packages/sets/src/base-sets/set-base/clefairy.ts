import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  ChooseAttackPrompt,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Clefairy extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 40;

  public attacks = [
    {
      name: 'Sing',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Asleep.'
    },
    {
      name: 'Metronome',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'Choose 1 of the Defending Pokémon\'s attacks. Metronome copies that attack except for its Energy costs and ' +
        'anything else required in order to use that attack, such as discarding Energy cards. (No matter what type ' +
        'the Defending Pokémon is, Clefairy\'s type is still Colorless.)'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Clefairy';

  public fullName: string = 'Clefairy BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Choose an opponent's Pokemon attack
      const pokemonCard = opponent.active.getPokemonCard();
      if (pokemonCard === undefined || pokemonCard.attacks.length === 0) {
        return state;
      }

      // Don't allow to copy "Metronome" or "Foul Play" as it may cause infinitive loop for AI player
      const bannedAttacks: string[] = [this.attacks[1].name, 'Foul Play'];
      const blocked: { index: number, attack: string }[] = [];
      for (const attack of pokemonCard.attacks) {
        if (bannedAttacks.includes(attack.name)) {
          blocked.push({ index: 0, attack: attack.name });
        }
      }

      return store.prompt(
        state,
        new ChooseAttackPrompt(player.id, GameMessage.CHOOSE_ATTACK_TO_COPY, [pokemonCard], {
          allowCancel: true,
          blocked,
        }),
        attack => {
          if (attack !== null) {
            const attackEffect = new AttackEffect(player, opponent, attack);
            store.reduceEffect(state, attackEffect);
            store.waitPrompt(state, () => {
              effect.damage = attackEffect.damage;
            });
          }
        }
      );
    }

    return state;
  }
}
