import { Disposable, Interceptable, Interceptor } from 'index';
import { arrayRemove } from 'core/util';
import { disposable } from 'core/disposable';

export class InterceptableHelper<T> implements Interceptable<T> {
  interceptors: Interceptor<T>[] = [];

  intercept(i: Interceptor<T>): Disposable {
    this.interceptors.push(i);
    return disposable(() => arrayRemove(this.interceptors, i));
  }

  protected callInterceptors(
    i: Interceptable<T>,
    oldVal: T,
    newVal: T
  ): [T, boolean] {
    for (const interceptor of this.interceptors.slice()) {
      let [next, accept] = interceptor(i, oldVal, newVal);
      if (!accept) {
        return [oldVal, false];
      }
      newVal = next;
    }
    return [newVal, true];
  }
}
