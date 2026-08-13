import { test, expect } from '../../src/fixtures/api.fixture';
import { allure } from 'allure-playwright';
import { PayloadBuilder } from '../../src/utils/payloadBuilder';

test.describe('IDMission Customer API', () => {

  // Independent test - tagged as Sanity
  test('Should successfully validate proof of address', { tag: '@sanity' }, async ({ customerClient }) => {
    allure.epic('Customer API');
    allure.feature('proof of address');
    allure.story('proof of address');

    // Just use the base payload without overrides
    const payload = PayloadBuilder.buildProofOfAddressPayload();

    const response = await customerClient.proofOfAddress(payload);
    expect([200]).toContain(response.status);
    // Add response parameter to allure report
    allure.parameter('Form ID', response.data.resultData.verificationResultId);
    expect(response.data.status.statusCode).toBe('000');
    expect(response.data.status.statusMessage).toBe("Form Submitted Successfully");
    expect(response.data.resultData.verificationResult).toBe('Approved');

  });


});


