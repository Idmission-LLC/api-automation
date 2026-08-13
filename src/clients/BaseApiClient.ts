import { APIRequestContext, APIResponse } from '@playwright/test';
import { ApiResponse } from '../types/api.types';
import { logger } from '../utils/logger';
import { envConfig } from '../config/config';

export class BaseApiClient {
  protected request: APIRequestContext;
  protected baseUrl: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseUrl = envConfig.baseUrl;
  }

  protected async get<T>(endpoint: string, headers?: { [key: string]: string }): Promise<ApiResponse<T>> {
    return this.sendRequest<T>('GET', endpoint, undefined, headers);
  }

  protected async post<T>(endpoint: string, data: any, headers?: { [key: string]: string }): Promise<ApiResponse<T>> {
    return this.sendRequest<T>('POST', endpoint, data, headers);
  }

  protected async put<T>(endpoint: string, data: any, headers?: { [key: string]: string }): Promise<ApiResponse<T>> {
    return this.sendRequest<T>('PUT', endpoint, data, headers);
  }

  protected async patch<T>(endpoint: string, data: any, headers?: { [key: string]: string }): Promise<ApiResponse<T>> {
    return this.sendRequest<T>('PATCH', endpoint, data, headers);
  }

  protected async delete<T>(endpoint: string, headers?: { [key: string]: string }): Promise<ApiResponse<T>> {
    return this.sendRequest<T>('DELETE', endpoint, undefined, headers);
  }

  private truncateForLogs(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'string') {
      return obj.length > 200 ? `${obj.substring(0, 50)}... [TRUNCATED ${obj.length} chars]` : obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(item => this.truncateForLogs(item));
    }
    if (typeof obj === 'object') {
      const newObj: any = {};
      for (const key in obj) {
        newObj[key] = this.truncateForLogs(obj[key]);
      }
      return newObj;
    }
    return obj;
  }

  private async sendRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    data?: any,
    customHeaders?: { [key: string]: string }
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    logger.info(`Sending ${method} request to ${url}`);

    if (data) {
      const truncatedData = this.truncateForLogs(data);
      const requestJson = JSON.stringify(truncatedData, null, 2);
      if (process.env.ENABLE_DEBUG_LOGS === 'true') {
        logger.info(`Request Payload:\n${requestJson}`);
        try {
          const { allure } = require('allure-playwright');
          allure.attachment('Request Payload', requestJson, 'application/json');
        } catch (e) {}
      }
    }

    const startTime = Date.now();
    let response: APIResponse;

    try {
      response = await this.request.fetch(url, {
        method,
        data,
        headers: customHeaders,
        timeout: envConfig.timeout,
      });
    } catch (error: any) {
      logger.error(`Request failed: ${error.message}`);
      throw error;
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    logger.info(`Received Response: ${response.status()} in ${duration}ms`);

    let responseData: any = null;
    const contentType = response.headers()['content-type'];
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    const truncatedResponse = this.truncateForLogs(responseData);
    const responseJson = JSON.stringify(truncatedResponse, null, 2);
    
    if (process.env.ENABLE_DEBUG_LOGS === 'true') {
      logger.info(`Response Payload:\n${responseJson}`);
      try {
        const { allure } = require('allure-playwright');
        allure.attachment('Response Payload', responseJson, 'application/json');
      } catch (e) {}
    }

    return {
      status: response.status(),
      data: responseData as T,
      headers: response.headers(),
      time: duration,
    };
  }
}
