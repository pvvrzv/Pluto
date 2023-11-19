import type { ControllerConstructor } from './controller';
import Registry from './registry';
import ConfigurationManager from './configurationManager';
import Conductor from './conductor';

export interface Options {
  root: HTMLElement;
  namespace: string;
}

export interface Configuration extends Omit<Options, 'namespace'> {
  namespace?: string
}

export default class Application {
  public registry: Registry;
  public options: Options;
  public conductor: Conductor;

  constructor(configuration: Configuration) {
    this.options = ConfigurationManager.process(configuration);
    this.registry = new Registry();
    this.conductor = new Conductor(this);
  }

  async start() {
    await this.DOMContentLoaded();
    console.debug('[pluto] (:Application) starting');
    this.conductor.start()
  }

  register(ControllerConstructor: ControllerConstructor) {
    this.registry.register(ControllerConstructor);
  }

  DOMContentLoaded(): Promise<void> {
    return new Promise((resolve) => {
      if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', () => resolve())
      else resolve()
    })
  }
}