export interface Property<T> {
    get(): T

    set(t: T): void

    update(u: (t: T) => T): void

    listen(l: Listener<T>): Disposable

    intercept(i: Interceptor<T>): Disposable
}

export interface Listener<T> {
    onChange(prop: Property<T>, oldVal: T, newVal: T): void
}

export interface Interceptor<T> {
    willChange(prop: Property<T>, oldVal: T, newVal: T): [T, boolean] // value, accept
}

export interface Disposable {
    dispose(): void
}