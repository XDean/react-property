import {Listenable} from '../api';

export interface Listener<T> {
    (prop: Listenable<T>, oldVal: T | undefined, newVal: T): void;
}