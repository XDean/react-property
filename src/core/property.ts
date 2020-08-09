import {Global} from './internal';
import {
    Listener,
    Disposable,
    ObservableValueHelper,
    ObservableValue
} from 'api';
import {ListenableHelper} from 'core/listenable';

export interface Property<T> extends ObservableValue<T> {
    readonly bean: any;
    readonly name: string;

    set(t: T | ((t: T) => T)): void;
}

export namespace Property {
    export function create<T>(defaultValue: T) {
        return new PropertyImpl<T>(defaultValue);
    }
}

class PropertyImpl<T> extends ObservableValueHelper<T> implements Property<T> {
    listenHelper = new ListenableHelper<T>();
    private value: T;

    constructor(defaultValue: T) {
        super();
        this.value = defaultValue;
    }

    get(): T {
        Global.fireRead(this);
        return this.value;
    }

    set(t: T | ((t: T) => T)): void {
        let oldVal = this.value;
        if (typeof t === "function") {
            this.value = (t as ((t: T) => T))(this.value);
        } else {
            this.value = t as T;
        }
        this.listenHelper.callListeners(this, oldVal, this.value);
    }

    update(u: (t: T) => T): void {
        let oldVal = this.value;
        this.value = u(oldVal);
        this.listenHelper.callListeners(this, oldVal, this.value);
    }

    listen(l: Listener<T>): Disposable {
        return this.listenHelper.listen(l);
    }
}
