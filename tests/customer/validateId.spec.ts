import { test, expect } from '../../src/fixtures/api.fixture';
import { allure } from 'allure-playwright';
import { PayloadBuilder } from '../../src/utils/payloadBuilder';

test.describe('IDMission Customer API', () => {

  // Independent test - tagged as Sanity
  test('Should successfully validate ID', { tag: '@sanity' }, async ({ customerClient }) => {
    allure.epic('Customer API');
    allure.feature('Validate ID');
    allure.story('Validate ID');

    // Just use the base payload without overrides
    const payload = PayloadBuilder.buildValidateIdPayload();

    const response = await customerClient.validateId(payload);
    expect([200]).toContain(response.status);
    // Add response parameter to allure report
    allure.parameter('Form ID', response.data.resultData.verificationResultId);
    expect(response.data.status.statusCode).toBe('000');
    expect(response.data.status.statusMessage).toBe("Form Submitted Successfully");
    expect(response.data.resultData.verificationResult).toBe('Approved');


  });


  // Independent test - tagged as Regression
  test('validate ID IND Passport', { tag: '@regression' }, async ({ customerClient }) => {
    allure.epic('Customer API');
    allure.feature('Validate ID');
    allure.story('Validate ID test2');

    // Just use the base payload without overrides
    const payload = PayloadBuilder.buildValidateIdPayload({
      "customerData": {
        "idData": {
          "idImageFront": "{{HWPP2.json}}",
          "idImageBack": ""
        }
      },
      "additionalData": {
        "idBackImageRequired": "N"
      }
    });

    const response = await customerClient.validateId(payload);
    expect([200]).toContain(response.status);
    // Add response parameter to allure report
    allure.parameter('Form ID', response.data.resultData.verificationResultId);
    expect(response.data.status.statusCode).toBe('000');
    expect(response.data.status.statusMessage).toBe("Form Submitted Successfully");
    expect(response.data.resultData.verificationResult).toBe('Approved');

  });


});

