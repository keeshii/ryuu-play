import {
  AttackEffect,
  CardTag,
  CardType,
  ChooseCardsPrompt,
  Effect,
  GameError,
  GameMessage,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
  SuperType,
} from '@ptcg/common';
import { commonAttacks } from '../../common';

export class Ditto extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 60;

  public powers = [
    {
      name: 'Form Variation',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), you may search your discard pile for a Basic Pokémon ' +
        '(excluding Pokémon-ex and Ditto) and switch it with Ditto. (Any cards attached to Ditto, damage counters, ' +
        'Special Conditions, and effects on it are now on the new Pokémon.) Place Ditto in the discard pile.'
    },
  ];

  public attacks = [
    {
      name: 'Energy Ball',
      cost: [CardType.COLORLESS],
      damage: '10+',
      text:
        'Does 10 damage plus 10 more damage for each Energy attached to Ditto but not used to pay for this attack\'s ' +
        'Energy cost. You can\'t add more then 20 damage in this way.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Ditto';

  public fullName: string = 'Ditto RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    const additionalEnergyDamage = commonAttacks.additionalEnergyDamage(this, store, state, effect);

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      const hasPokemonInDiscard = player.discard.cards.some(c => {
        return c instanceof PokemonCard && c.stage === Stage.BASIC && c.name !== 'Ditto' && !c.tags.includes(CardTag.POKEMON_EX);
      });

      if (!hasPokemonInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const blocked = player.discard.cards
        .filter(c => c instanceof PokemonCard && c.stage === Stage.BASIC && (c.name === 'Ditto' || c.tags.includes(CardTag.POKEMON_EX)))
        .map(c => player.deck.cards.indexOf(c));

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          player.discard,
          {
            superType: SuperType.POKEMON,
            stage: Stage.BASIC
          },
          { allowCancel: true, min: 1, max: 1, blocked }
        ),
        selected => {
          const cards = selected || [];
          // cancelled by user
          if (cards.length !== 1) {
            return;
          }
          player.discard.moveCardTo(cards[0], player.active.pokemons);
          player.active.pokemons.moveCardTo(this, player.discard);
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return additionalEnergyDamage.use(effect, CardType.COLORLESS, 10, 2);
    }

    return state;
  }
}
