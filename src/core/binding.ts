import { Binding, Dependencies, Disposable, Listener } from 'api.ts';
import { ListenableHelper } from 'core/listenable';
import { Global } from 'core/internal';
import { disposables, disposed } from 'core/disposable';

export class BindingImpl<T> implements Binding<T> {
  private _valid: boolean = false;
  private _value?: T;
  private _dependencies: Dependencies = [];
  private _listenDispose: Disposable = disposed();
  private listenableHelper = new ListenableHelper<T>();

  constructor(private compute: () => T) {}

  get(): T {
    Global.fireRead(this);
    this.ensureValid();
    return this._value as T;
  }

  get valid(): boolean {
    return this._valid;
  }

  get dependencies(): Dependencies {
    this.ensureValid();
    return this._dependencies;
  }

  invalidate(): void {
    this._valid = false;
    this._listenDispose.dispose();
    if (this.listenableHelper.hasListener()) {
      this.ensureValid();
    }
  }

  listen(l: Listener<T>): Disposable {
    return this.listenableHelper.listen(l);
  }

  private ensureValid() {
    if (!this.valid) {
      this._valid = true;
      const oldVal = this._value;
      this._dependencies = Global.collectDependency(() => {
        this._value = this.compute();
      });
      const d = disposables();
      this._dependencies.forEach(dependency => {
        d.add(dependency.listen(() => this.invalidate()));
      });
      this._listenDispose = d;
      this.listenableHelper.callListeners(this, oldVal, this._value as T);
    }
  }
}
