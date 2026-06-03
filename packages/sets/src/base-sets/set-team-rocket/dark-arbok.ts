import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  ChoosePokemonPrompt,
  Effect,
  EndTurnEffect,
  GameError,
  GameMessage,
  PlayerType,
  PlayPokemonEffect,
  PokemonCard,
  PowerEffect,
  PowerType,
  PutDamageEffect,
  SlotType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class DarkArbok extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Ekans';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Stare',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: '',
      text:
        'Choose 1 of your opponent\'s Pokémon. This attack does 10 damage to that Pokémon. Don\'t apply Weakness and ' +
        'Resistance for this attack. (Any other effects that would happen after applying Weakness and Resistance ' +
        'still happen.) If that Pokémon has a Pokémon Power, that power stops working until the end of your ' +
        'opponent\'s next turn.'
    },
    {
      name: 'Poison Vapor',
      cost: [CardType.GRASS, CardType.GRASS, CardType.GRASS],
      damage: '10',
      text:
        'The Defending Pokémon is now Poisoned. This attack does 10 damage to each of your opponent\'s Benched ' +
        'Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Arbok';

  public fullName: string = 'Dark Arbok TR';

  public readonly STARE_MARKER = 'STARE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false }
        ),
        targets => {
          if (!targets || targets.length === 0) {
            return;
          }
          const target = targets[0];
          const damageEffect = new PutDamageEffect(effect, 10);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);

          const pokemonCard = target.getPokemonCard();
          if (pokemonCard !== undefined && pokemonCard.powers.some(p => p.powerType === PowerType.POKEPOWER)) {
            opponent.marker.addMarker(this.STARE_MARKER, pokemonCard);
          }
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      store.reduceEffect(state, specialConditionEffect);

      opponent.bench.forEach(benched => {
        if (benched.pokemons.cards.length > 0) {
          const dealDamage = new PutDamageEffect(effect, 10);
          dealDamage.target = benched;
          store.reduceEffect(state, dealDamage);
        }
      });
    }

    if (effect instanceof PowerEffect && effect.player.marker.hasMarker(this.STARE_MARKER, effect.card)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof PlayPokemonEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.STARE_MARKER, effect.pokemonCard);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.STARE_MARKER);
    }

    return state;
  }
}
