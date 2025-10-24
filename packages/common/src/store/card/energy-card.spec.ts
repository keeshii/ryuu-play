import { EnergyCard } from './energy-card';
import { SuperType, CardType, EnergyType } from './card-types';

class TestEnergy extends EnergyCard {
  set = 'TEST';
  name = 'Test Energy';
  fullName = 'Test Energy TEST';
}

describe('EnergyCard', () => {
  let energy: TestEnergy;

  beforeEach(() => {
    energy = new TestEnergy();
  });

  it('should initialize with default values', () => {
    expect(energy.superType).toBe(SuperType.ENERGY);
    expect(energy.energyType).toBe(EnergyType.BASIC);
    expect(energy.provides).toEqual([]);
    expect(energy.text).toBe('');
  });

  it('should set energy type correctly', () => {
    energy.energyType = EnergyType.SPECIAL;
    expect(energy.energyType).toBe(EnergyType.SPECIAL);
  });

  it('should set provided energy types correctly', () => {
    energy.provides = [CardType.FIRE, CardType.WATER];
    expect(energy.provides).toEqual([CardType.FIRE, CardType.WATER]);
  });

  it('should set text correctly', () => {
    energy.text = 'Provides 1 Fire or 1 Water energy.';
    expect(energy.text).toBe('Provides 1 Fire or 1 Water energy.');
  });

  it('should have correct card identification', () => {
    expect(energy.set).toBe('TEST');
    expect(energy.name).toBe('Test Energy');
    expect(energy.fullName).toBe('Test Energy TEST');
  });
});