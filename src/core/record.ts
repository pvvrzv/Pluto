import Namespace from './namespace';
import type { ControllerConstructor } from './controller';

class UndrecognizedControllerShapeError extends Error {
  constructor() {
    super('Unrecognized controller shape error.');
  }
}

export default class Record {
  public Controller: ControllerConstructor;
  public namespace: Namespace;
  public identifier: string;
  public targets: string[];
  public actions: string[];

  constructor(Controller: ControllerConstructor) {
    if (Controller.targets && !Array.isArray(Controller.targets)) {
      console.error('Targets property of a Controller must be an array of strings or undefined.');
      throw new UndrecognizedControllerShapeError();
    }

    if (Controller.targets && !Array.isArray(Controller.targets)) {
      console.error('Targets property of a Controller must be an array of strings or undefined.');
      throw new UndrecognizedControllerShapeError();
    }

    this.targets = Controller.targets || [];
    this.actions = Controller.actions || [];

    this.Controller = Controller;
    this.namespace = new Namespace(Controller.namespace);
    this.identifier = Controller.identifier;
  }
}
