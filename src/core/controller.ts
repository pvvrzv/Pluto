import type Namespace from './namespace';
import type { $$descriptor, Descriptor } from './descriptor';

type DOM = { [key: string]: HTMLElement; } &
{ list: { [key: string]: HTMLElement[] } };

export default abstract class Controller {
  declare public [$$descriptor]: Descriptor
  declare public root: HTMLElement;
  declare public descriptor: { identifier: string; };
  declare public dom: DOM;
  [key: string]: any;

  constructor() { }

  abstract mount(): void;
  abstract unmount(): void;
  abstract connect(alias: string, element: HTMLElement): void;
  abstract disconnect(alias: string, element: HTMLElement): void;
}

export interface ControllerConstructor {
  identifier: string;
  namespace?: string | Partial<Namespace>;
  targets?: string[];
  actions?: string[];

  new(...args: ConstructorParameters<typeof Controller>): Controller;
};
