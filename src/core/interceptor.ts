import { Disposable, Interceptable, Interceptor } from 'index';
import { arrayRemove } from 'core/util';

export class InterceptableHelper<T> implements Interceptable<T> {
  interceptors: Interceptor<T>[] = [];

  intercept(i: Interceptor<T>): Disposable {
    this.interceptors.push(i);
    return {
      dispose: () => {
        arrayRemove(this.interceptors, i);
      },
    };
  }

  protected callInterceptors(
    i: Interceptable<T>,
    oldVal: T,
    newVal: T
  ): [T, boolean] {
    for (const interceptor of this.interceptors.slice()) {
      let [next, accept] = interceptor.willChange(i, oldVal, newVal);
      if (!accept) {
        return [oldVal, false];
      }
      newVal = next;
    }
    return [newVal, true];
  }
}
