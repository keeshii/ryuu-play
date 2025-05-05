import { PokemonCard } from '@ptcg/common';
import { Stage, CardType, CardTag, SuperType } from '@ptcg/common';
import { StoreLike, State, StateUtils, PowerType, ChoosePokemonPrompt,
  PlayerType, SlotType, GameMessage, Card, ChooseCardsPrompt, ShuffleDeckPrompt } from '@ptcg/common';
import { AttackEffect, PowerEffect } from '@ptcg/common';
import { Effect } from '@ptcg/common';
import { CheckProvidedEnergyEffect, CheckTableStateEffect } from '@ptcg/common';


function* useEmeraldSlash(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {

  const player = effect.player;

  if (player.deck.cards.length === 0) {
    return state;
  }

  const hasBenched = player.bench.some(b => b.cards.length > 0);
  if (!hasBenched) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.ENERGY, name: 'Grass Energy' },
    { min: 1, max: 2, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length > 0) {
    yield store.prompt(state, new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS,
      PlayerType.BOTTOM_PLAYER,
      [ SlotType.BENCH ],
      { allowCancel: true }
    ), targets => {
      if (!targets || targets.length === 0) {
        return;
      }
      const target = targets[0];
      player.deck.moveCardsTo(cards, target);
      next();
    });
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}


export class VirizionEx extends PokemonCard {

  public tags = [ CardTag.POKEMON_EX ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 170;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.WATER, value: -20 }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Verdant Wind',
    powerType: PowerType.ABILITY,
    text: 'Each of your Pokemon that has any G Energy attached to it can\'t ' +
    'be affected by any Special Conditions. (Remove any Special Conditions ' +
    'affecting those Pokemon.)'
  }];

  public attacks = [
    {
      name: 'Emerald Slash',
      cost: [ CardType.GRASS, CardType.COLORLESS ],
      damage: 50,
      text: 'You may search your deck for 2 G Energy cards and attach them ' +
        'to 1 of your Benched Pokemon. Shuffle your deck afterward.'
    }
  ];

  public set: string = 'BW3';

  public name: string = 'Virizion EX';

  public fullName: string = 'Virizion EX PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useEmeraldSlash(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof CheckTableStateEffect) {
      state.players.forEach(player => {
        if (player.active.specialConditions.length === 0) {
          return;
        }

        let hasVirizionInPlay = false;
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          if (card === this) {
            hasVirizionInPlay = true;
          }
        });

        if (!hasVirizionInPlay) {
          return state;
        }

        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
        store.reduceEffect(state, checkProvidedEnergyEffect);

        const energyMap = checkProvidedEnergyEffect.energyMap;
        const hasGrassEnergy = StateUtils.checkEnoughEnergy(energyMap, [ CardType.GRASS ]);

        if (hasGrassEnergy) {
          // Try to reduce PowerEffect, to check if something is blocking our ability
          try {
            const powerEffect = new PowerEffect(player, this.powers[0], this);
            store.reduceEffect(state, powerEffect);
          } catch {
            return state;
          }

          const conditions = player.active.specialConditions.slice();
          conditions.forEach(condition => {
            player.active.removeSpecialCondition(condition);
          });
        }
      });
    }

    return state;
  }

}
