import {
  AfterDamageEffect,
  AttackEffect,
  CardType,
  ChoosePokemonPrompt,
  DealDamageEffect,
  Effect,
  EndTurnEffect,
  GameMessage,
  GamePhase,
  PlayerType,
  PokemonCard,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Pidgeotto extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Pidgey';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 60;

  public attacks = [
    {
      name: 'Whirlwind',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text:
        'If your opponent has any Benched Pokémon, he or she chooses 1 of them and switches it with the Defending ' +
        'Pokémon. (Do the damage before switching the Pokémon.)'
    },
    {
      name: 'Mirror Move',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'If Pidgeotto was attacked last turn, do the final result of that attack on Pidgeotto to the Defending ' +
        'Pokémon.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Pidgeotto';

  public fullName: string = 'Pidgeotto BS';

  public readonly MIRROR_MOVE_DAMAGE_MARKER = 'MIRROR_MOVE_DAMAGE_MARKER_{damage}';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Remember damage done to Pidgeotto by the opponent's attacks
    if (effect instanceof AfterDamageEffect && effect.target.pokemons.cards.includes(this)) {
      const player = effect.player;
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      // No damage, or damage done by itself, or Pidgeotto is not active
      if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
        return state;
      }

      // Pokemon is evolved, Not an attack
      if (effect.target.getPokemonCard() !== this || state.phase !== GamePhase.ATTACK) {
        return state;
      }

      const markerName = this.MIRROR_MOVE_DAMAGE_MARKER.replace('{damage}', String(effect.damage));
      effect.target.marker.addMarker(markerName, this);
    }

    // Whirlwind
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.pokemons.cards.length > 0);

      if (hasBench === false) {
        return state;
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          opponent.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ),
        targets => {
          if (targets && targets.length > 0) {
            const dealDamage = new DealDamageEffect(effect, effect.damage);
            dealDamage.target = opponent.active;
            store.reduceEffect(state, dealDamage);
            effect.damage = 0;

            opponent.switchPokemon(targets[0]);
          }
        }
      );
    }

    // Mirror Move
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      // As far I know there is an errata for this attack, and it copies damage only
      // CC: Mirror Move:
      // If Pidgeot was damaged by an attack during your opponent's last turn,
      // this attack dose the same amount of damage done to Pidgeot to the Defending Pokemon.
      const player = effect.player;
      const marker = player.active.marker.markers.find(c => c.source === this);

      if (!marker) {
        return state;
      }

      const damage = parseInt(marker.name.replace(/\D/g, ''), 10);
      if (damage > 0) {
        effect.damage = damage;
      }

      return state;
    }

    // Clear damage markers
    if (effect instanceof EndTurnEffect) {
      const markers = effect.player.active.marker.markers.filter(c => c.source === this);
      for (const marker of markers) {
        effect.player.active.marker.removeMarker(marker.name, marker.source);
      }
    }

    return state;
  }
}
