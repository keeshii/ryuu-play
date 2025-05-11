import { FilterCardsPipe } from './filter-cards.pipe';

describe('FilterCardsPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterCardsPipe(null);
    expect(pipe).toBeTruthy();
  });
});
