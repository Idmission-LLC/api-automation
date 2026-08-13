export type EnvironmentName = 'DEV' | 'QA' | 'UAT' | 'PROD' | 'DEMO' | 'UK' | 'US';

export interface EnvironmentConfig {
  baseUrl: string;
  authUrl: string;
  timeout: number;
}
