import { test, expect } from '../../src/fixtures/api.fixture';
import { allure } from 'allure-playwright';
import { PayloadBuilder } from '../../src/utils/payloadBuilder';

test.describe('IDMission Customer API', () => {

  // Independent test - tagged as Sanity
  test('Validate Autofill', { tag: ['@sanity', '@company:HWTest_Sandbox'] }, async ({ customerClient }) => {
    allure.epic('Customer API');
    allure.feature('Autofill');
    allure.story('Autofill');

    // Just use the base payload without overrides
    const payload = PayloadBuilder.buildAutofillPayload();

    const response = await customerClient.autofill(payload);
    expect([200], 'Response status should be 200').toContain(response.status);
    // Add response parameter to allure report
    allure.parameter('Form ID', response.data.resultData.verificationResultId);
    expect(response.data.status.statusCode, 'Status code should be 000').toBe('000');
    expect(response.data.status.statusMessage, 'Status message should be "Form Submitted Successfully"').toBe("Form Submitted Successfully");
    expect(response.data.resultData.verificationResult, 'Verification result should be "Data Extraction Successful"').toBe('Data Extraction Successful');

  });

});

