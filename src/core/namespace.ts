export default class Namespace {
  public global: boolean;
  public include: string[];
  public exclude: string[];

  constructor(seed: string | Partial<Namespace> | undefined) {
    switch (typeof seed) {
      case 'undefined':
        this.global = true;
        this.include = [];
        this.exclude = [];
        break;
      case 'string':
        this.global = false;
        this.include = [seed];
        this.exclude = [];
        break;
      case 'object':
        const { global = false, include = [], exclude = [] } = seed;

        if (!global && !include.length)
          throw new Error('If global flag is undefined or set to false on a controller\'s namespace, namespaces to include must be specified explicitly.');

        this.global = global;
        this.include = include;
        this.exclude = exclude;
        break;
      default:
        throw new Error(`Unexpected initial namespace type.`);
    }
  }

  collides(namespace: Namespace): boolean {
    if (namespace.global && !this.global) {
      /*
        Candidate MUST explicitly exclude every
        namespace included by current Namespace
      */
      return namespace.exclude.every((n) => this.include.includes(n))
    }

    if (!namespace.global && this.global) {
      /*
      Current Namespace MUST explicitly exclude every
      namespace included by Candidate
      */
      return this.exclude.every((n) => namespace.include.includes(n))
    }

    if (!namespace.global && !this.global) {
      /*
      Candidate MUST NOT include namespaces
      included by current Namespace
      */
      return this.include.every((n) => !namespace.include.includes(n))
    }

    /*
      Collision is detected if no return statement was
      encountered to this point
    */

    return true;
  }

  includes(namespace: string): boolean {
    return !(
      (!this.global && !this.include.includes(namespace))
      || this.exclude.includes(namespace)
    );
  }
}
