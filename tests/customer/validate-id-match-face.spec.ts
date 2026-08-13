import { test, expect } from '../../src/fixtures/api.fixture';
import { allure } from 'allure-playwright';
import { PayloadBuilder } from '../../src/utils/payloadBuilder';

test.describe('IDMission Customer API', () => {

  // Independent test - tagged as Sanity
  test('Should successfully validate-id-match-face', { tag: '@sanity' }, async ({ customerClient }) => {
    allure.epic('Customer API');
    allure.feature('validate-id-match-face');
    allure.story('validate-id-match-face');

    // Just use the base payload without overrides
    const payload = PayloadBuilder.buildValidateIdMatchFacePayload();

    const response = await customerClient.validateIdMatchFace(payload);
    expect([200]).toContain(response.status);
    expect(response.data.status.statusCode).toBe('000');
    expect(response.data.status.statusMessage).toBe("Form Submitted Successfully");
    expect(response.data.resultData.verificationResult).toBe('Approved');
    // Add response parameter to allure report
    allure.parameter('Form ID', response.data.resultData.verificationResultId);
  });


});


