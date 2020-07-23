export interface Readable<T> {
  get(): T;
}

export interface Writable<T> extends Readable<T> {
  set(t: T): void;

  update(u: (t: T) => T): void;
}

export interface Listenable<T> {
  listen(l: Listener<T>): Disposable;
}

export interface Interceptable<T> {
  intercept(i: Interceptor<T>): Disposable;
}

export interface Property<T> extends Listenable<T>, Interceptable<T> {
  readonly bean: any;
  readonly name: string;
}

export interface Binding<T> extends Listenable<T> {
  readonly valid: boolean;
  readonly dependencies: Listenable<any>[];

  invalidate(): void;
}

export interface Listener<T> {
  onChange(prop: Listenable<T>, oldVal: T, newVal: T): void;
}

export interface Interceptor<T> {
  willChange(prop: Interceptable<T>, oldVal: T, newVal: T): [T, boolean]; // value, accept
}

export interface Disposable {
  dispose(): void;
}
