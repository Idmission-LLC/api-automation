import { APIRequestContext } from '@playwright/test';
import { envConfig } from '../config/config';
import { logger } from './logger';

export class TokenManager {
  private static token: string | null = null;
  private static tokenExpiry: number | null = null;

  public static async getToken(request: APIRequestContext): Promise<string> {
    const now = Date.now();

    if (this.token && this.tokenExpiry && this.tokenExpiry > now) {
      return this.token;
    }

    logger.info('Fetching new authentication token...');
    
    const username = process.env.API_USERNAME;
    const password = process.env.API_PASSWORD;
    const clientId = process.env.API_CLIENT_ID;
    const clientSecret = process.env.API_CLIENT_SECRET;

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
      this.token = body.access_token;
      
      // Calculate expiry (expires_in is usually in seconds)
      const expiresInSeconds = body.expires_in || 3600;
      this.tokenExpiry = now + (expiresInSeconds * 1000) - 5000; // Subtract 5 seconds buffer
      
      logger.info('Successfully obtained new authentication token. [SECRET REDACTED]');
      return this.token as string;
    } catch (error: any) {
      logger.error(`Error fetching token: ${error.message}`);
      throw error;
    }
  }

  public static clearToken(): void {
    this.token = null;
    this.tokenExpiry = null;
    logger.info('Cleared cached authentication token.');
  }
}
