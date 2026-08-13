import { test, expect } from '../../src/fixtures/api.fixture';
import { allure } from 'allure-playwright';
import { PayloadBuilder } from '../../src/utils/payloadBuilder';

test.describe('IDMission Customer API', () => {

  // Independent test - tagged as Sanity
  test('Validate enroll', { tag: '@sanity' }, async ({ customerClient }) => {
    allure.epic('Customer API');
    allure.feature('enroll');
    allure.story('enroll');

    // Just use the base payload without overrides
    const payload = PayloadBuilder.buildEnrollPayload();

    const response = await customerClient.enroll(payload);
    expect([200]).toContain(response.status);
    expect(response.data.status.statusCode).toBe('000');
    expect(response.data.status.statusMessage).toBe("Form Submitted Successfully");
    expect(response.data.resultData.verificationResult).toBe('Customer Onboarded');

    // Add response parameter to allure report
    allure.parameter('Form ID', response.data.resultData.verificationResultId);
  });

});

