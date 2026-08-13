import { EnvironmentConfig, EnvironmentName } from '../types/environment.types';

export const environments: Record<EnvironmentName, EnvironmentConfig> = {
  DEV: {
    baseUrl: 'https://apidev.idmission.com/v4/customer',
    authUrl: 'https://devauth.idmission.com/auth/realms/identity/protocol/openid-connect/token',
    timeout: 30000,
  },
  QA: {
    baseUrl: 'https://apiQA.idmission.com/v4/customer',
    authUrl: 'https://QAauth.idmission.com/auth/realms/identity/protocol/openid-connect/token',
    timeout: 30000,
  },
  UAT: {
    baseUrl: 'https://apiuat.idmission.com/v4/customer',
    authUrl: 'https://uatauth.idmission.com/auth/realms/identity/protocol/openid-connect/token',
    timeout: 60000,
  },
  PROD: {
    baseUrl: 'https://api.idmission.com/v4/customer',
    authUrl: 'https://auth.idmission.com/auth/realms/identity/protocol/openid-connect/token',
    timeout: 30000,
  },
  DEMO: {
    baseUrl: 'https://apidemo.idmission.com/v4/customer', // UPDATE WITH DEMO URL
    authUrl: 'https://demoauth.idmission.com/auth/realms/identity/protocol/openid-connect/token', // UPDATE WITH DEMO URL
    timeout: 30000,
  },
  UK: {
    baseUrl: 'https://identity.london.idmission.xyz/identity/v4/customer', // UPDATE WITH DEMO URL
    authUrl: 'https://auth.london.idmission.xyz/auth/realms/identity/protocol/openid-connect/token', // UPDATE WITH DEMO URL
    timeout: 60000,
  },
  US: {
    baseUrl: 'https://identity.virginia.idmission.xyz/identity/v4/customer', // UPDATE WITH DEMO URL
    authUrl: 'https://auth.idmission.com/auth/realms/identity/protocol/openid-connect/token', // UPDATE WITH DEMO URL
    timeout: 60000,
  }
};
