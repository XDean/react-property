import {Dependencies, ObservableValue} from '../../api';

export class RPGlobal {
    private uid = 0;
    private dependencies: Dependencies[] = [];

    get nextId() {
        return ++this.uid;
    }

    collectDependency<T>(f: () => T): Dependencies {
        let dependencies: Dependencies = [];
        this.dependencies.unshift(dependencies);
        f();
        this.dependencies.shift();
        return dependencies;
    }

    fireRead(ob: ObservableValue<any>) {
        if (this.dependencies.length === 0) {
            return;
        }
        this.dependencies[0].push(ob);
    }
}

export const Global = new RPGlobal();
