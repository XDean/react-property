export interface Disposable {
    dispose(): void;

    isDisposed(): boolean;
}

export namespace Disposable {
    export function fromAction(f: () => void): Disposable {
        let disposed = false;
        return {
            dispose() {
                if (disposed) {
                    return;
                }
                disposed = true;
                f();
            },
            isDisposed(): boolean {
                return disposed;
            },
        };
    }


    export function disposed(): Disposable {
        return {
            dispose() {
            },
            isDisposed(): boolean {
                return true;
            },
        };
    }

    export function composite(...ds: Disposable[]): Disposable & { add: (d: Disposable) => void } {
        let disposed = false;
        let disposables: Disposable[] = [...ds];
        return {
            add(d: Disposable) {
                if (disposed) {
                    d.dispose();
                } else {
                    disposables.push(d);
                }
            },
            dispose() {
                if (disposed) {
                    return;
                }
                disposed = true;
                disposables.forEach(d => d.dispose());
                disposables = [];
            },
            isDisposed(): boolean {
                return disposed;
            },
        };
    }
}
