import { Disposable, Listener, Listenable } from 'index';
import { arrayRemove } from 'core/util';

export class ListenableHelper<T> implements Listenable<T> {
  listeners: Listener<T>[] = [];

  listen(l: Listener<T>): Disposable {
    this.listeners.push(l);
    return {
      dispose: () => {
        arrayRemove(this.listeners, l);
      },
    };
  }

  callListeners(o: Listenable<T>, oldVal: T, newVal: T) {
    this.listeners.slice().forEach(listener => {
      listener.onChange(o, oldVal, newVal);
    });
  }
}
