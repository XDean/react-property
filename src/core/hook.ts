import {Binding, Property} from '../api';
import {Dispatch, SetStateAction, useEffect, useState} from "react";

export function useProperty<T>(prop: Property<T>): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState(prop.get());
    useEffect(() => {
        setValue(prop.get());
        const disposable = prop.listen((_p, _o, n) => {
            if (Array.isArray(n)) {
                setValue(n.slice() as unknown as T);
            } else {
                setValue(n);
            }
        });
        return disposable.dispose;
    }, [prop]);
    return [value, e => {
        let newValue;
        if (typeof e === "function") {
            newValue = (e as ((t: T) => T))(value);
        } else {
            newValue = e as T;
        }
        prop.set(newValue);
    }];
}

export function useBinding<T>(binding: () => Binding<T>): T {
    const [value, setValue] = useState<T>();
    useEffect(() => {
        const b = binding();
        setValue(b.get());
        const disposable = b.listen((_p, _o, n) => {
            if (Array.isArray(n)) {
                setValue(n.slice() as unknown as T);
            } else {
                setValue(n);
            }
        });
        return disposable.dispose;
    }, [binding]);
    return value!;
}