import { arrayRemove } from './util';
import { Listener, Disposable } from '../api';

export interface Listenable<T> {
  listen(l: Listener<T>): Disposable;
}

export class ListenableHelper<T> implements Listenable<T> {
  listeners: Listener<T>[] = [];

  listen(l: Listener<T>): Disposable {
    this.listeners.push(l);
    return Disposable.fromAction(() => arrayRemove(this.listeners, l));
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
