import { ChooseEnergyPrompt, EnergyMap } from './choose-energy-prompt';
import { GameMessage } from '../../game-message';
import { CardType, SuperType } from '../card/card-types';

describe('ChooseEnergyPrompt', () => {

  let playerId: number;
  let fire: CardType[];
  let dark: CardType[];
  let colorless: CardType[];
  let rainbow: CardType[];
  let dce: CardType[];

  function createEnergy(name: string, provides: CardType[]): EnergyMap {
    const card = { name, superType: SuperType.ENERGY, provides } as any;
    return { card, provides };
  }

  beforeEach(() => {
    playerId = 1;
    fire = [ CardType.FIRE ];
    dark = [ CardType.DARK ];
    colorless = [ CardType.COLORLESS ];
    rainbow = [ CardType.ANY ];
    dce = [ CardType.COLORLESS, CardType.COLORLESS ];
  });

  it('Should not change the cost (because possible to cancel)', () => {
    // given
    const cost: CardType[] = [ CardType.FIRE ];
    const energy: EnergyMap[] = [
      createEnergy('dce', dce)
    ];

    // when
    const prompt = new ChooseEnergyPrompt(
      playerId,
      GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      energy,
      cost,
      { allowCancel: true }
    );

    // then
    expect(prompt.cost).toEqual([ CardType.FIRE ]);
    expect(prompt.result).toBeUndefined();
  });


  it('Should remove all fire energies', () => {
    // given
    const cost: CardType[] = [ CardType.FIRE, CardType.FIRE ];
    const energy: EnergyMap[] = [
      createEnergy('dark', dark),
      createEnergy('colorless', colorless)
    ];

    // when
    const prompt = new ChooseEnergyPrompt(
      playerId,
      GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      energy,
      cost,
      { allowCancel: false }
    );

    // then
    expect(prompt.cost).toEqual([]);
    expect(prompt.result).toBeUndefined();
  });

  it('Should remove one fire energy', () => {
    // given
    const cost: CardType[] = [ CardType.FIRE, CardType.FIRE ];
    const energy: EnergyMap[] = [
      createEnergy('dark', dark),
      createEnergy('fire', fire)
    ];

    // when
    const prompt = new ChooseEnergyPrompt(
      playerId,
      GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      energy,
      cost,
      { allowCancel: false }
    );

    // then
    expect(prompt.cost).toEqual([ CardType.FIRE ]);
    expect(prompt.result).toBeUndefined();
  });

  it('Should remove one fire energy paid by rainbow', () => {
    // given
    const cost: CardType[] = [ CardType.FIRE, CardType.FIRE ];
    const energy: EnergyMap[] = [
      createEnergy('dark', dark),
      createEnergy('rainbow', rainbow)
    ];

    // when
    const prompt = new ChooseEnergyPrompt(
      playerId,
      GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      energy,
      cost,
      { allowCancel: false }
    );

    // then
    expect(prompt.cost).toEqual([ CardType.FIRE ]);
    expect(prompt.result).toBeUndefined();
  });

  it('Should remove one colorless energy', () => {
    // given
    const cost: CardType[] = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];
    const energy: EnergyMap[] = [
      createEnergy('dce', dce)
    ];

    // when
    const prompt = new ChooseEnergyPrompt(
      playerId,
      GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
      energy,
      cost,
      { allowCancel: false }
    );

    // then
    expect(prompt.cost).toEqual([ CardType.COLORLESS, CardType.COLORLESS ]);
    expect(prompt.result).toBeUndefined();
  });

});
