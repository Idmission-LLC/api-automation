import { environments } from './environments';
import { EnvironmentConfig, EnvironmentName } from '../types/environment.types';

class Config {
  public static readonly ENV: EnvironmentName = (process.env.ENV as EnvironmentName) || 'QA';

  public static get(): EnvironmentConfig {
    const config = environments[this.ENV];
    if (!config) {
      throw new Error(`Environment '${this.ENV}' is not defined.`);
    }
    return config;
  }
}

export const envConfig = Config.get();
