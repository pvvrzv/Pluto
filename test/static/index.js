import { Application } from '../../src/index.ts';

const application = new Application({
  root: document.querySelector('#root'),
  namespace: 'index'
});

class Controller {
  bind(methods) {
    for (const method of methods) {
      this[method] = this[method].bind(this);
    }
  }
}

class Item extends Controller {
  static identifier = 'item';
  static targets = ['toolbox'];
  static actions = ['showToolbox', 'remove', 'increment', 'decrement'];
  static bind = ['showToolbox'];

  constructor() {
    super();
    this.bind([
      'showToolbox',
      'hideToolbox',
      'remove',
      'increment',
      'decrement',
    ]);
  }

  mount() { }

  connect(alias, element) {
  }

  disconnect() { }

  showToolbox(e) {
    if (
      !this.dom.toolbox
      || !this.dom.toolbox.dataset.hasOwnProperty('hidden')
    ) return;
    delete this.dom.toolbox.dataset.hidden;
    document.addEventListener(
      'click',
      this.hideToolbox,
      { capture: true }
    );
  }

  hideToolbox(e) {
    if (!this.dom.toolbox) return;
    if (
      this.dom.toolbox.isSameNode(e.target)
      || this.dom.toolbox.contains(e.target)
    ) {
      return;
    } else {
      this.dom.toolbox.dataset.hidden = '';
      document.removeEventListener(
        'click',
        this.hideToolbox,
        { capture: true }
      );
    };
  }

  increment() {
    if (!this.dom.quantity) return;
    this.quantity(this.quantity() + 1);
  }

  quantity(value) {
    if (!this.dom.quantity) return;
    if (!value) return parseInt(this.dom.quantity.textContent);
    else this.dom.quantity.textContent = value;
  }

  decrement() {
    if (!this.dom.quantity) return;

    const current = this.quantity();
    if (current > 1) this.quantity(current - 1);
  }

  remove(e) {
    this.root.remove();
  }
}

class List {
  static identifier = 'list';
  static targets = ['item'];

  connect(alias, element) { }

  disconnect(alias, element) {
    console.log(alias, element);
    console.log(this.dom);
  }
}

setTimeout(() => {
  const list = document.querySelector('.cart__list');
  const item = document.createElement('div');
  item.className = 'item';
  item.style.cssText = '--color: #DEE8EB;';
  item.dataset.controller = 'item';
  item.innerHTML = `
  <div class="item__toolbox" data-hidden data-target="item::toolbox">
  <button class="item__toolbox-button _increment" data-action="click=item::increment">
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M5 7.5H10" stroke="black" stroke-linecap="round" />
      <path d="M7.5 5L7.5 10" stroke="black" stroke-linecap="round" />
    </svg>
  </button>
  <button class="item__toolbox-button _decrement" data-action="click=item::decrement">
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M5 8H10" stroke="black" stroke-linecap="round" />
    </svg>
  </button>
  <button class="item__toolbox-button _remove" data-action="click=item::remove">
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M11.7188 13.125C11.7188 13.6425 11.2987 14.0625 10.7812 14.0625H4.21875C3.70125 14.0625 3.28125 13.6425 3.28125 13.125V4.6875H2.34375V13.125C2.34375 14.1605 3.18328 15 4.21875 15H10.7812C11.8167 15 12.6562 14.1605 12.6562 13.125V4.6875H11.7188V13.125Z" fill="black" />
      <path d="M9.84375 13.125C10.1025 13.125 10.3125 12.9155 10.3125 12.6562V7.03125C10.3125 6.7725 10.1025 6.5625 9.84375 6.5625C9.585 6.5625 9.375 6.7725 9.375 7.03125V12.6562C9.375 12.9155 9.585 13.125 9.84375 13.125Z" fill="black" />
      <path d="M7.5 13.125C7.75875 13.125 7.96875 12.9155 7.96875 12.6562V7.03125C7.96875 6.7725 7.75875 6.5625 7.5 6.5625C7.24125 6.5625 7.03125 6.7725 7.03125 7.03125V12.6562C7.03125 12.9155 7.24125 13.125 7.5 13.125Z" fill="black" />
      <path d="M5.15625 13.125C5.415 13.125 5.625 12.9155 5.625 12.6562V7.03125C5.625 6.7725 5.415 6.5625 5.15625 6.5625C4.8975 6.5625 4.6875 6.7725 4.6875 7.03125V12.6562C4.6875 12.9155 4.8975 13.125 5.15625 13.125Z" fill="black" />
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12.6562 1.875H9.84375V0.9375C9.84375 0.42 9.42375 0 8.90625 0H6.09375C5.57625 0 5.15625 0.42 5.15625 0.9375V1.875H2.34375C1.82625 1.875 1.40625 2.295 1.40625 2.8125V3.75C1.40625 4.2675 1.82625 4.6875 2.34375 4.6875H12.6562C13.1737 4.6875 13.5938 4.2675 13.5938 3.75V2.8125C13.5938 2.295 13.1737 1.875 12.6562 1.875ZM2.8125 3.75H12.1875C12.4462 3.75 12.6562 3.54047 12.6562 3.28125C12.6562 3.0225 12.4462 2.8125 12.1875 2.8125H2.8125C2.55375 2.8125 2.34375 3.0225 2.34375 3.28125C2.34375 3.54047 2.55375 3.75 2.8125 3.75ZM6.5625 0.9375C6.30375 0.9375 6.09375 1.14703 6.09375 1.40625V1.875H8.90625V1.40625C8.90625 1.14703 8.69625 0.9375 8.4375 0.9375H6.5625Z" fill="black" />
    </svg>
  </button>
</div>
<button class="item__action" data-action="click=item::showToolbox">
  <svg xmlns="http://www.w3.org/2000/svg" width="2" height="10" viewBox="0 0 2 10" fill="none">
    <circle cx="1" cy="1" r="1" fill="black" />
    <circle cx="1" cy="5" r="1" fill="black" />
    <circle cx="1" cy="9" r="1" fill="black" />
  </svg>
</button>
<div class="item__column _left">
  <img class="item__preview" src="./assets/items/2.png" alt="">
</div>
<div class="item__column _right">
  <div class="item__name">lorem ipsum moder dore</div>
  <div class="item__price">128.50</div>
  <div class="item__quantity" data-target="item::quantity">1</div>
</div>
  `;

  list.appendChild(item)

}, 500)

application.register(Item);
application.register(List);
application.start()