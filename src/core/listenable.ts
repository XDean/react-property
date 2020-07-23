import { Disposable, Listenable, Listener } from 'index';
import { arrayRemove } from 'core/util';
import { disposable } from 'core/disposable';

export class ListenableHelper<T> implements Listenable<T> {
  listeners: Listener<T>[] = [];

  listen(l: Listener<T>): Disposable {
    this.listeners.push(l);
    return disposable(() => arrayRemove(this.listeners, l));
  }

  hasListener(): boolean {
    return this.listeners.length > 0;
  }

  callListeners(o: Listenable<T>, oldVal: T | undefined, newVal: T) {
    this.listeners.slice().forEach(listener => {
      listener(o, oldVal, newVal);
    });
  }
}
