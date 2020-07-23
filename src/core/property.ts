import { GLOBAL_INST } from './global';
import { InterceptableHelper } from 'core/interceptor';
import { Disposable, Interceptor, Listener, Property } from 'index';
import { ListenableHelper } from 'core/listenable';

export class PropertyImpl<T> implements Property<T> {
  bean: any;
  name: string;
  value: T;
  listenHelper = new ListenableHelper<T>();
  interceptHelper = new InterceptableHelper<T>();

  constructor(defaultVal: T, bean?: any, name?: string) {
    this.value = defaultVal;
    this.bean = bean;
    this.name = name || 'Property@' + GLOBAL_INST.nextId;
  }

  get(): T {
    return this.value;
  }

  set(t: T): void {
    let oldVal = this.value;
    this.value = t;
    this.listenHelper.callListeners(this, oldVal, this.value);
  }

  update(u: (t: T) => T): void {
    let oldVal = this.value;
    this.value = u(oldVal);
    this.listenHelper.callListeners(this, oldVal, this.value);
  }

  intercept(i: Interceptor<T>): Disposable {
    return this.interceptHelper.intercept(i);
  }

  listen(l: Listener<T>): Disposable {
    return this.listenHelper.listen(l);
  }
}
