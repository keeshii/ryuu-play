import { TrainerCard } from './trainer-card';
import { SuperType, TrainerType } from './card-types';

class TestTrainer extends TrainerCard {
  set = 'TEST';
  name = 'Test Trainer';
  fullName = 'Test Trainer TEST';
}

describe('TrainerCard', () => {
  let trainer: TestTrainer;

  beforeEach(() => {
    trainer = new TestTrainer();
  });

  it('should initialize with default values', () => {
    expect(trainer.superType).toBe(SuperType.TRAINER);
    expect(trainer.trainerType).toBe(TrainerType.ITEM);
    expect(trainer.text).toBe('');
    expect(trainer.useWhenInPlay).toBe(false);
  });

  it('should set trainer type correctly', () => {
    trainer.trainerType = TrainerType.SUPPORTER;
    expect(trainer.trainerType).toBe(TrainerType.SUPPORTER);
  });

  it('should set text correctly', () => {
    trainer.text = 'Draw 2 cards.';
    expect(trainer.text).toBe('Draw 2 cards.');
  });

  it('should set useWhenInPlay flag correctly', () => {
    trainer.useWhenInPlay = true;
    expect(trainer.useWhenInPlay).toBe(true);
  });

  it('should have correct card identification', () => {
    expect(trainer.set).toBe('TEST');
    expect(trainer.name).toBe('Test Trainer');
    expect(trainer.fullName).toBe('Test Trainer TEST');
  });
});