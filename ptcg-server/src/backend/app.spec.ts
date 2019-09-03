import { App } from './app';

describe('backend app', () => {

  it('Should create', () => {
    const app = new App();
    expect(app).toBeDefined();
  });

});
