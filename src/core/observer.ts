export default class Observer {
  private delegate: MutationObserver;
  public root: HTMLElement;

  constructor(root: HTMLElement, callback: (...args: any[]) => any) {
    this.root = root;
    this.delegate = new MutationObserver(callback);
  }

  start() {
    this.delegate.observe(this.root, {
      subtree: true,
      childList: true,
      attributes: true,
    })
  }
}