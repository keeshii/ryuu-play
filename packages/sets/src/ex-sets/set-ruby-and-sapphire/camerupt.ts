import {
  AttackEffect,
  CardType,
  ChooseCardsPrompt,
  ChoosePokemonPrompt,
  DiscardCardsEffect,
  Effect,
  EnergyCard,
  EnergyType,
  GameMessage,
  PlayerType,
  PokemonCard,
  PutDamageEffect,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
  SuperType,
} from '@ptcg/common';

export class Camerupt extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Numel';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 90;

  public attacks = [
    {
      name: 'Lava Burn',
      cost: [CardType.FIRE, CardType.COLORLESS],
      damage: '20',
      text:
        'Choose 1 of your opponent\'s Benched Pokémon. This attack does 10 damage to that Pokémon. (Don\'t apply ' +
        'Weakness and Resistance for Benched Pokémon.)',
    },
    {
      name: 'Fire Spin',
      cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: '100',
      text: 'Discard 2 basic Energy cards attached to Camerupt or this attack does nothing.',
    },
  ];

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Camerupt';

  public fullName: string = 'Camerupt RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Opponent doesn't have benched pokemon
      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          {
            allowCancel: false,
          }
        ),
        targets => {
          if (!targets || targets.length === 0) {
            return;
          }
          const damageEffect = new PutDamageEffect(effect, 10);
          damageEffect.target = targets[0];
          store.reduceEffect(state, damageEffect);
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      // Player has no Basic Energy attached
      let basicEnergyCards = 0;
      player.active.cards.forEach(c => {
        if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC) {
          basicEnergyCards++;
        }
      });

      if (basicEnergyCards < 2) {
        effect.preventDefault = true;
        return state;
      }

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.active,
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
          { min: 2, max: 2, allowCancel: true }
        ),
        cards => {
          cards = cards || [];
          if (cards.length < 2) {
            effect.preventDefault = true;
            return;
          }
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          store.reduceEffect(state, discardEnergy);
        }
      );
    }

    return state;
  }
}
