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

export interface Property<T>
  extends Listenable<T>,
    Interceptable<T>,
    Writable<T> {
  readonly bean: any;
  readonly name: string;
}

export type Dependencies = Listenable<any>[];

export interface Binding<T> extends Listenable<T>, Readable<T> {
  readonly valid: boolean;
  readonly dependencies: Dependencies;

  invalidate(): void;
}

export interface Listener<T> {
  (prop: Listenable<T>, oldVal: T | undefined, newVal: T): void;
}

export interface Interceptor<T> {
  (prop: Interceptable<T>, oldVal: T | undefined, newVal: T): [T, boolean]; // value, accept
}

export interface Disposable {
  dispose(): void;

  isDisposed(): boolean;
}
