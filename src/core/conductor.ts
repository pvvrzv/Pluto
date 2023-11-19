import Application from './application';
import Observer from './observer';
import Context from './context';

const SELECTORS = [
  '[data-controller]',
  '[data-target]',
  '[data-action]'
];

declare global {
  interface HTMLElement {
    context: Context | undefined;
  }
}

export default class Conductor {
  private observer: Observer;
  private application: Application;

  constructor(application: Application) {
    this.application = application;
    this.observer = new Observer(this.application.options.root, this.processMutation.bind(this));
  }

  public start() {
    this.observer.start();
    this.mount(this.application.options.root);
  }

  private mount(root: HTMLElement) {
    const { application } = this;
    const descendants = root.querySelectorAll(SELECTORS.join(',')) as NodeListOf<HTMLElement>;

    if (root.matches(SELECTORS.join(','))) {
      if (root.context) root.context.mount();
      else root.context = new Context(root, application).mount();
    }

    for (const descendant of descendants) {
      if (descendant.context) descendant.context.mount();
      else descendant.context = new Context(descendant, application).mount();
    }

    root.context?.controllers.forEach(c => c.mount && c.mount());

    for (const descendant of descendants) {
      descendant.context!.controllers.forEach(c => c.mount && c.mount());
    }
  }

  private unmount(root: HTMLElement) {
    const descendants = root.querySelectorAll(SELECTORS.join(',')) as NodeListOf<HTMLElement>;

    if (root.context) root.context.unmount();

    for (const descendant of descendants) {
      if (descendant.context) descendant.context.unmount();
    }

    root.context?.controllers.forEach(c => c.unmount && c.unmount());

    for (const descendant of descendants) {
      descendant.context!.controllers.forEach(c => c.unmount && c.unmount());
    }
  }

  private processMutation(mutations: MutationRecord[]) {
    for (const mutation of mutations) {
      switch (mutation.type) {
        case 'childList':
          const addedNodes = mutation.addedNodes as NodeListOf<HTMLElement>;
          const removedNodes = mutation.removedNodes as NodeListOf<HTMLElement>;

          for (const element of addedNodes) {
            if (element.nodeType === Node.ELEMENT_NODE)
              this.mount(element);
          }

          for (const element of removedNodes) {
            if (element.nodeType === Node.ELEMENT_NODE)
              this.unmount(element);
          }
      }
    }
  }
}