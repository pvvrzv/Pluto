import type Controller from './controller';
import type Application from './application';
import { $$descriptor, Descriptor } from './descriptor';
import Action from './action';
import Alias from './alias';

export const $$context = Symbol('context');

export default class Context {
  public root: HTMLElement;
  public application: Application;
  public controllers: Controller[];
  public aliases: Alias[];
  public actions: Action[];

  constructor(root: HTMLElement, application: Application) {
    this.root = root;
    this.application = application;
    this.controllers = [];
    this.aliases = [];
    this.actions = [];

  }

  public mount() {
    this.controllers.length = 0;
    this.actions.length = 0;
    this.aliases.length = 0;

    this.initizlize();
    this.connect();
    this.activate();

    return this;
  }

  public unmount() {
    this.disconnect();
    this.deactivate();
  }

  private initizlize() {
    const { root } = this;
    const { registry, options } = this.application;
    const identifiers = this.root.dataset.controller?.split(' ');

    if (!identifiers) return;

    for (const identifier of identifiers) {
      const record = registry.get(identifier, options.namespace);

      if (!record) {
        console.error(`Unrecognized controller identifier: ${identifier}`, root);
        throw new Error('Context initialization error.');
      };

      const descriptor = new Descriptor(root, record);
      const controller = new record.Controller();

      controller.root = root;

      Object.defineProperties(controller, {
        root: {
          value: root,
          writable: false,
          enumerable: true,
          configurable: false
        },
        dom: {
          value: {},
          writable: false,
          enumerable: true,
          configurable: false
        },
        [$$descriptor]: {
          value: descriptor,
          writable: false,
          enumerable: false,
          configurable: false

        }
      });

      Object.defineProperty(controller.dom, 'list', {
        value: {},
        writable: false,
        enumerable: true,
        configurable: false
      });

      this.controllers.push(controller);
    }
  }

  private connect() {
    const descriptors = this.root.dataset.target?.split(' ');

    if (!descriptors) return;

    for (const descriptor of descriptors) {
      const alias = new Alias(this, descriptor);
      const selector = `[data-controller~="${alias.identifier}"]`;
      const parent = this.root.closest(selector) as HTMLElement;

      if (!parent) continue;

      const context = parent.context
        || (parent.context = new Context(parent, this.application).mount());

      alias.bind(context);
      this.aliases.push(alias);
    }
  }

  private disconnect() {
    for (const alias of this.aliases) alias.unbind();
  }

  public adopt(alias: Alias): Controller {
    const controller = this.controllers.find(c => {
      return c[$$descriptor].record.identifier === alias.identifier;
    });

    if (!controller) {
      console.error('Attempted to be adopted by non existing controller.', alias, this);
      throw new Error('[pluto] Target binding error error.');
    }

    const { value, context } = alias;

    controller.dom[value] ??= context.root;

    if (controller.dom.list[value]) {
      controller.dom.list[value]?.push(context.root);
    } else {
      controller.dom.list[value] = [context.root];
    }

    controller.connect && controller.connect(value, context.root);

    return controller;
  }

  public abandon(alias: Alias) {
    const { value, context, controller } = alias;

    if (!controller) {
      console.error('Alias is missing binded controller.', alias);
      throw new Error('Alias abandoning error.');
    };


    const list = controller.dom.list[value];

    if (!list) {
      console.error('List with aliases value was not found.', alias);
      throw new Error('Alias abandoning error.');
    }

    const index = list.indexOf(context.root);

    if (index == -1) {
      console.error('Alias\'s root was not found in the dom list.', alias);
      throw new Error('Alias abandoning error.');
    }

    list.splice(index, 1);

    if (list.length === 0) {
      delete controller.dom.list[value];
      delete controller.dom[value];
    }

    controller.disconnect && controller.disconnect(value, context.root);
  }

  private activate() {
    const descriptors = this.root.dataset.action?.split(' ');

    if (!descriptors) return;

    for (const descriptor of descriptors) {
      const action = new Action(this, descriptor);
      const selector = `[data-controller="${action.identifier}"]`;
      const parent = this.root.closest(selector) as HTMLElement;

      if (!parent) continue;

      const context = parent.context
        || (parent.context = new Context(parent, this.application).mount());

      action.bind(context);
      this.actions.push(action);
    }
  }

  private deactivate() {
    for (const action of this.actions) action.unbind()
  }

  public link(action: Action): Controller {
    const controller = this.controllers.find(c => {
      return c[$$descriptor].record.identifier == action.identifier;
    });

    if (!controller) {
      console.error('Attempted to be lineked to a non existing controller.', action, this);
      throw new Error('[pluto] Action binding error error.');
    }

    if (!controller[$$descriptor].record.actions.includes(action.name)) {
      console.error('Action is not defined on a controller', action, this);
      throw new Error('[pluto] Action binding error error.');
    }

    return controller;
  }
}