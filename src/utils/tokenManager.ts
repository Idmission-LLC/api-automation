import { APIRequestContext } from '@playwright/test';
import { envConfig } from '../config/config';
import { logger } from './logger';

export class TokenManager {
  private static tokens: Record<string, string> = {};
  private static tokenExpiries: Record<string, number> = {};

  public static async getToken(request: APIRequestContext, companyName: string = 'default'): Promise<string> {
    const now = Date.now();
    const token = this.tokens[companyName];
    const tokenExpiry = this.tokenExpiries[companyName];

    if (token && tokenExpiry && tokenExpiry > now) {
      return token;
    }

    logger.info(`Fetching new authentication token for company: ${companyName}...`);
    
    let username = process.env.API_USERNAME;
    let password = process.env.API_PASSWORD;
    let clientId = process.env.API_CLIENT_ID;
    let clientSecret = process.env.API_CLIENT_SECRET;

    if (companyName !== 'default' && process.env.COMPANIES_CREDENTIALS) {
      try {
        const companiesStr = process.env.COMPANIES_CREDENTIALS;
        // Fix for potential single quotes around json in env
        const parsedStr = companiesStr.startsWith("'") && companiesStr.endsWith("'") 
          ? companiesStr.slice(1, -1) 
          : companiesStr;
        const companies = JSON.parse(parsedStr);
        if (companies[companyName]) {
          const creds = companies[companyName];
          username = creds.API_USERNAME || creds.username || username;
          password = creds.API_PASSWORD || creds.password || password;
          clientId = creds.API_CLIENT_ID || creds.clientId || clientId;
          clientSecret = creds.API_CLIENT_SECRET || creds.clientSecret || clientSecret;
        } else {
          logger.warn(`Credentials for company '${companyName}' not found in COMPANIES_CREDENTIALS, falling back to default.`);
        }
      } catch (e: any) {
        logger.error(`Failed to parse COMPANIES_CREDENTIALS JSON: ${e.message}`);
      }
    }

    if (!username || !password || !clientId || !clientSecret) {
        throw new Error('API credentials are not fully configured in environment variables.');
    }

    try {
      const response = await request.post(envConfig.authUrl, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
          grant_type: 'password',
          client_id: clientId,
          client_secret: clientSecret,
          username: username,
          password: password,
        }
      });

      if (!response.ok()) {
        const errText = await response.text();
        throw new Error(`Failed to obtain token. Status: ${response.status()}, Body: ${errText}`);
      }

      const body = await response.json();
      this.tokens[companyName] = body.access_token;
      
      // Calculate expiry (expires_in is usually in seconds)
      const expiresInSeconds = body.expires_in || 3600;
      this.tokenExpiries[companyName] = now + (expiresInSeconds * 1000) - 5000; // Subtract 5 seconds buffer
      
      logger.info(`Successfully obtained new authentication token for company: ${companyName}. [SECRET REDACTED]`);
      return this.tokens[companyName] as string;
    } catch (error: any) {
      logger.error(`Error fetching token: ${error.message}`);
      throw error;
    }
  }

  public static clearToken(companyName?: string): void {
    if (companyName) {
      delete this.tokens[companyName];
      delete this.tokenExpiries[companyName];
      logger.info(`Cleared cached authentication token for company: ${companyName}.`);
    } else {
      this.tokens = {};
      this.tokenExpiries = {};
      logger.info('Cleared all cached authentication tokens.');
    }
  }
}
