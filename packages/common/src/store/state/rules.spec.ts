import { Rules } from './rules';

describe('Rules', () => {
  describe('constructor', () => {
    it('should initialize with default values', () => {
      const rules = new Rules();
      expect(rules.formatName).toBe('');
      expect(rules.firstTurnDrawCard).toBe(true);
      expect(rules.firstTurnUseSupporter).toBe(true);
      expect(rules.noPrizeForFossil).toBe(true);
    });

    it('should initialize with partial overrides', () => {
      const rules = new Rules({
        formatName: 'test-format',
        firstTurnDrawCard: false
      });
      expect(rules.formatName).toBe('test-format');
      expect(rules.firstTurnDrawCard).toBe(false);
      expect(rules.firstTurnUseSupporter).toBe(true);
      expect(rules.noPrizeForFossil).toBe(true);
    });

    it('should initialize with all overrides', () => {
      const rules = new Rules({
        formatName: 'test-format',
        firstTurnDrawCard: false,
        firstTurnUseSupporter: false,
        noPrizeForFossil: false
      });
      expect(rules.formatName).toBe('test-format');
      expect(rules.firstTurnDrawCard).toBe(false);
      expect(rules.firstTurnUseSupporter).toBe(false);
      expect(rules.noPrizeForFossil).toBe(false);
    });
  });
});