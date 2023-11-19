import type Record from './record';

export class Descriptor {
  public root: HTMLElement;
  public record: Record;

  constructor(root: HTMLElement, record: Record) {
    this.root = root;
    this.record = record;
  }
}

export const $$descriptor = Symbol('descriptor');

export default Descriptor;