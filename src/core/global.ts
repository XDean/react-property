export class RPGlobal {
  private uid = 0;

  get nextId() {
    return ++this.uid;
  }
}

export const GLOBAL_INST = new RPGlobal();
