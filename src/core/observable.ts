import {Listenable, Listener, ListenableHelper, Disposable} from "api";
import {Global} from "./internal";

export interface ObservableValue<T> extends Listenable<T> {
    bean: any
    name: string

    get(): T;

    map<E>(f: (t: T) => E): ObservableValue<E>
}

export abstract class ObservableValueHelper<T> implements ObservableValue<T> {
    bean: any;
    name: string;
    protected listenHelper = new ListenableHelper<T>();

    protected constructor() {
        this.name = name || '@' + Global.nextId;
    }

    abstract get(): T;

    map<E>(_f: (t: T) => E): ObservableValue<E> {
        return null!;
    }

    listen(l: Listener<T>): Disposable {
        return this.listenHelper.listen(l);
    }
}
