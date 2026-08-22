import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from './BaseApiClient';
import { TokenManager } from '../utils/tokenManager';
import { ApiResponse } from '../types/api.types';

export class CustomerClient extends BaseApiClient {
  private companyName?: string;

  constructor(request: APIRequestContext, companyName?: string) {
    super(request);
    this.companyName = companyName;
  }

  private async postWithAuth(endpoint: string, payload: any): Promise<ApiResponse<any>> {
    const token = await TokenManager.getToken(this.request, this.companyName);
    return this.post(endpoint, payload, { 'Authorization': `Bearer ${token}` });
  }

  public async autofill(payload: any): Promise<ApiResponse<any>> { return this.postWithAuth('/Autofill', payload); }
  public async createVerificationRecord(payload: any): Promise<ApiResponse<any>> { return this.postWithAuth('/create-verification-record', payload); }
  public async declineConsent(payload: any): Promise<ApiResponse<any>> { return this.postWithAuth('/decline-consent', payload); }
  public async enroll(payload: any): Promise<ApiResponse<any>> { return this.postWithAuth('/enroll', payload); }
  public async enrollBiometrics(payload: any): Promise<ApiResponse<any>> { return this.postWithAuth('/enroll-biometrics', payload); }
  public async generateIdentityLink(payload: any): Promise<ApiResponse<any>> { return this.postWithAuth('/generate-identity-link', payload); }
  public async getProcessedData(payload: any): Promise<ApiResponse<any>> { return this.postWithAuth('/get-processed-data', payload); }
  public async idRealcheck(payload: any): Promise<ApiResponse<any>> { return this.postWithAuth('/id-realcheck', payload); }
  public async identify(payload: any): Promise<ApiResponse<any>> { return this.postWithAuth('/identify', payload); }
  public async liveCheck(payload: any): Promise<ApiResponse<any>> { return this.postWithAuth('/live-check', payload); }
  public async matchIdFace(payload: any): Promise<ApiResponse<any>> { return this.postWithAuth('/match-id-face', payload); }
  public async matchSelfieToSelfie(payload: any): Promise<ApiResponse<any>> { return this.postWithAuth('/match-selfie-to-selfie', payload); }
  public async proofOfAddress(payload: any): Promise<ApiResponse<any>> { return this.postWithAuth('/proof-of-address', payload); }
  public async validateId(payload: any): Promise<ApiResponse<any>> { return this.postWithAuth('/validate-id', payload); }
  public async validateIdMatchFace(payload: any): Promise<ApiResponse<any>> { return this.postWithAuth('/validate-id-match-face', payload); }
  public async verify(payload: any): Promise<ApiResponse<any>> { return this.postWithAuth('/verify', payload); }
}
