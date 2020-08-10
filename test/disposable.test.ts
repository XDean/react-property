import { Disposable } from '../src/api';

describe('disposable', () => {
  it('disposed', () => {
    const d = Disposable.disposed();
    expect(d.isDisposed()).toBe(true);
    d.dispose();
    expect(d.isDisposed()).toBe(true);
  });
});
