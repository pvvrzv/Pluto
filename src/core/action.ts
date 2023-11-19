import type Controller from './controller';
import type Context from './context';

const OPTIONS_MODIFIERS: { [name: string]: boolean; } = {
  once: true,
  passive: true,
  capture: true
}

export default class Action {
  public context: Context;
  public type: string;
  public name: string;
  public identifier: string;
  public parent: Context | null;
  public controller: Controller | null;
  public options: { [name: string]: boolean } | null;

  constructor(context: Context, descriptor: string) {
    const { root } = context;
    const type = descriptor.match(/^\w*(?==)/);
    const identifier = descriptor.match(/=(\w*(?=\:\:))/);
    const name = descriptor.match(/::(\w*)/);
    const options = parseActionDescriptorModifiers(root, descriptor);


    if (!type || !identifier || !identifier[1] || !name || !name[1]) {
      console.error(`Unable to parse action descriptor: ${descriptor}`, root);
      throw new Error('Action parsing error.');
    }

    this.context = context;
    this.type = type[0];
    this.name = name[1];
    this.identifier = identifier[1];
    this.options = options;
    this.parent = null;
    this.controller = null;
  }

  bind(context: Context) {
    this.parent = context;
    this.controller = context.link(this);

    this.context.root.addEventListener(
      this.type, this.controller[this.name],
      this.options as AddEventListenerOptions
    );
  }

  unbind() {
    if (!this.controller) {
      console.error('No controller was bound.');
      throw new Error('Action unbinding error.');
    }

    this.context.root.removeEventListener(
      this.type, this.controller[this.name],
      this.options as AddEventListenerOptions
    );

    this.parent = null;
    this.controller = null;
  }
}

function parseActionDescriptorModifiers
  (root: HTMLElement, descriptor: string): Action['options'] | null | never {
  const options: Action['options'] = {};
  const modifiers = descriptor.match(/\b:\w+/g);

  if (!modifiers) return null;

  for (const modifier of modifiers) {
    const name = modifier.slice(1);

    if (!OPTIONS_MODIFIERS[name]) {
      console.error(`Unable to parse action option: ${modifier}`, root);
      throw new Error('Action parsing error.')
    }

    options[name] = true;
  }

  return options;
}