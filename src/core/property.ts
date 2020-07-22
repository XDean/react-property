import {Disposable, Interceptor, Listener, Property} from "index";
import {arrayRemove} from "core/util";

export class SimpleProperty<T> implements Property<T> {

    value: T;
    listeners: Listener<T>[] = [];
    interceptors: Interceptor<T>[] = [];

    constructor(defaultVal: T) {
        this.value = defaultVal
    }

    get(): T {
        return this.value;
    }

    set(t: T): void {
        this.value = t;
    }

    update(u: (t: T) => T): void {
        this.value = u(this.value)
    }

    intercept(i: Interceptor<T>): Disposable {
        this.interceptors.push(i);
        return {
            dispose: () => {
                arrayRemove(this.interceptors, i);
            }
        };
    }

    listen(l: Listener<T>): Disposable {
        this.listeners.push(l);
        return {
            dispose: () => {
                arrayRemove(this.listeners, l);
            }
        };
    }
}