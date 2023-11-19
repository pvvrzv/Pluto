import type {
  ControllerConstructor,
} from './controller';
import Record from './record';

class NamespaceCollisionError extends Error {
  constructor(resident: Record, candidate: Record) {
    super();

    this.message = `Namespace collision:\n\nRegistered:\n{\nidentifier:${resident.identifier},\nnamespace: ${JSON.stringify(resident.namespace)}\n}\n\nCandidate:\n{\nidentifier: ${candidate.identifier},\nnamespace: ${JSON.stringify(candidate.namespace)}\n}`;
  }
}

class MissingIdentifierError extends Error {
  constructor() {
    super('Controller missing identifier');
  }
}

export default class Registry {
  public records: Map<string, Set<Record>>;

  constructor() {
    this.records = new Map();
  }

  /* 
    Coerce Controller constructor (Candidate) to normilized shape
    by putting it inside a container.
    Check for namespace collisions with already registered Controller constructors (Residents).
  */

  register(Controller: ControllerConstructor): void {
    if (!Controller) return;
    if (!Controller.identifier) throw new MissingIdentifierError();

    const candidate = new Record(Controller);
    const residents = this.records.get(candidate.identifier);

    if (!residents) {
      this.records.set(candidate.identifier, new Set([candidate]));
      return;
    }

    for (const resident of residents) {
      if (!resident.namespace.collides(candidate.namespace)) continue;
      throw new NamespaceCollisionError(resident, candidate);
    }

    residents.add(candidate);
  }

  get(identifier: string, namespace: string): Record | void {
    const residents = this.records.get(identifier);

    if (!residents) return;

    for (const resident of residents) {
      if (resident.namespace.includes(namespace)) return resident;
    }
  }
}