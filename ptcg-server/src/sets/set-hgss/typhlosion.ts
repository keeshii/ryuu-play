import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GameError, GameMessage,
  EnergyCard, PlayerType, SlotType, PokemonCardList, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect, AttackEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import {AttachEnergyPrompt} from '../../game/store/prompts/attach-energy-prompt';
import {CheckProvidedEnergyEffect} from '../../game/store/effects/check-effects';
import {DiscardCardsEffect} from '../../game/store/effects/attack-effects';

function* useFlareDestroy(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
  state = store.reduceEffect(state, checkProvidedEnergy);

  if (player.active.cards.some(c => c instanceof EnergyCard)) {
    yield store.prompt(state, new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      player.active,
      { superType: SuperType.ENERGY },
      { min: 1, max: 1, allowCancel: false }
    ), selected => {
      const cards = selected || [];
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);
      next();
    });
  }

  // Defending Pokemon has no energy cards attached
  if (opponent.active.cards.some(c => c instanceof EnergyCard)) {
    yield store.prompt(state, new ChooseCardsPrompt(
      player.id,
      GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      opponent.active,
      { superType: SuperType.ENERGY },
      { min: 1, max: 1, allowCancel: false }
    ), selected => {
      const cards = selected || [];
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      return store.reduceEffect(state, discardEnergy);
      next();
    });
  }

  return state;
}

export class Typhlosion extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Quilava';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 140;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Afterburner',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may search your ' +
      'discard pile for a R Energy card and attach it to 1 of your Pokemon. ' +
      'If you do, put 1 damage counter on that Pokemon. This Power can\'t ' +
      'be used if Typhlosion is affected by a Special Condition.'
  }];

  public attacks = [
    {
      name: 'Flare Destroy',
      cost: [ CardType.FIRE, CardType.FIRE, CardType.COLORLESS ],
      damage: 70,
      text: 'Discard an Energy card attached to Typhlosion and discard ' +
        'an Energy card attached to the Defending Pokemon.'
    }
  ];

  public set: string = 'HGSS';

  public name: string = 'Typhlosion';

  public fullName: string = 'Typhlosion HGSS';

  public readonly AFTERBURNER_MAREKER = 'DYNAMOTOR_MAREKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.AFTERBURNER_MAREKER, this);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useFlareDestroy(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      if (cardList.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
          && c.provides.includes(CardType.FIRE);
      });
      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.AFTERBURNER_MAREKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.ACTIVE, SlotType.BENCH ],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { allowCancel: true, min: 1, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return;
        }
        player.marker.addMarker(this.AFTERBURNER_MAREKER, this);
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
          target.damage += 10;
        }
      });
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.AFTERBURNER_MAREKER, this);
    }

    return state;
  }


}
