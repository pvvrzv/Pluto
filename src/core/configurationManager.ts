import type { Configuration, Options } from './application';

class UnrecognizedRootTypeError extends Error {
  constructor() {
    super('Root must be of type HTMLElement');
  }
}

class FailedToFindConfigurationObjectError extends Error {
  constructor() {
    super('No configuration object was passed to the application');
  }
}

export default class ConfigurationManager {
  constructor() {
    throw new Error('OptionsManager is not supposed to be instantiated. All of it\'s methods are defined as static properties.');
  }

  static process(configuration: Configuration): Options | never {
    if (!configuration) throw FailedToFindConfigurationObjectError;

    if (
      !('root' in configuration)
      || !(configuration.root instanceof HTMLElement)
    ) throw new UnrecognizedRootTypeError;

    return {
      root: configuration.root,
      namespace: configuration.namespace || 'index'
    };
  }
}