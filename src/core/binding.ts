import {
    Disposable,
    ListenableHelper,
    Listener,
    ObservableValue,
    ObservableValueHelper
} from 'api';
import {Global} from "core/internal";

export type Dependencies = ObservableValue<any>[];

export interface Binding<T> extends ObservableValue<T> {
    readonly valid: boolean;
    readonly dependencies: Dependencies;

    invalidate(): void;
}

export class BindingImpl<T> extends ObservableValueHelper<T> implements Binding<T> {
    private _valid: boolean | 'calculating' = false;
    private _value?: T;
    private _dependencies: Dependencies = [];
    private _listenDispose: Disposable = Disposable.disposed();
    private listenableHelper = new ListenableHelper<T>();

    constructor(private compute: () => T) {
        super();
    }

    get(): T {
        Global.fireRead(this);
        this.ensureValid();
        return this._value as T;
    }

    get valid(): boolean {
        return this._valid === true;
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
            if (this._valid === "calculating") {
                console.warn(`binding ${this.name} re-valid, there may cyclic dependency, this calculation result may not right`);
            }
            this._valid = "calculating";
            const oldVal = this._value;
            this._dependencies = Global.collectDependency(() => {
                this._value = this.compute();
            });
            this._listenDispose = Disposable.composite(...this._dependencies.map(dependency =>
                dependency.listen(() => this.invalidate())));
            this.listenableHelper.callListeners(this, oldVal, this._value as T);
            this._valid = true;
        }
    }
}
