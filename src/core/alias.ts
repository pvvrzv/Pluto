import type Controller from './controller';
import type Context from './context';

export default class Alias {
  public context: Context;
  public value: string;
  public identifier: string;
  public parent: Context | null;
  public controller: Controller | null;

  constructor(context: Context, descriptor: string) {
    const { root } = context;
    const [identifier, value] = descriptor.split('::');

    if (!identifier || !value) {
      console.error(`Unable to parse target identifier: ${descriptor}`, root);
      throw new Error('Target paring error.')
    }

    this.context = context;
    this.value = value;
    this.identifier = identifier;
    this.parent = null;
    this.controller = null;
  }

  bind(context: Context) {
    this.parent = context;
    this.controller = context.adopt(this);
  }

  unbind() {
    if (!this.parent) {
      console.error('Tried to unbind an alias without binding it to a context first.', this);
      throw new Error('Alias unbinding error.');
    };

    this.parent.abandon(this);
    
    this.parent = null;
    this.controller = null;
  }
}