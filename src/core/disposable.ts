import { Disposable } from 'api.ts';

export function disposed(): Disposable {
  return {
    dispose() {},
    isDisposed(): boolean {
      return true;
    },
  };
}

export function disposable(f: () => void): Disposable {
  let disposed = false;
  return {
    dispose() {
      if (disposed) {
        return;
      }
      disposed = true;
      f();
    },
    isDisposed(): boolean {
      return disposed;
    },
  };
}

export function disposables(): Disposable & { add: (d: Disposable) => void } {
  let disposed = false;
  let disposables: Disposable[] = [];
  return {
    add(d: Disposable) {
      if (disposed) {
        d.dispose();
      } else {
        disposables.push(d);
      }
    },
    dispose() {
      if (disposed) {
        return;
      }
      disposed = true;
      disposables.forEach(d => d.dispose());
      disposables = [];
    },
    isDisposed(): boolean {
      return disposed;
    },
  };
}
