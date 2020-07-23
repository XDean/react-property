import { Readable } from 'index';

export interface Event<T> {
  name: string;
  payload: T;
}

export class ReadEvent implements Event<Readable<any>> {
  readonly name: string = 'read';
  readonly payload: Readable<any>;

  constructor(payload: Readable<any>) {
    this.payload = payload;
  }
}
