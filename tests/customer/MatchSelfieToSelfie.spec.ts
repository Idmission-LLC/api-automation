import { test, expect } from '../../src/fixtures/api.fixture';
import { allure } from 'allure-playwright';
import { PayloadBuilder } from '../../src/utils/payloadBuilder';

test.describe('IDMission Customer API', () => {

  // Independent test - tagged as Sanity
  test('Validate MatchSelfieToSelfie', { tag: '@sanity' }, async ({ customerClient }) => {
    allure.epic('Customer API');
    allure.feature('MatchSelfieToSelfie');
    allure.story('MatchSelfieToSelfie');

    // Just use the base payload without overrides
    const payload = PayloadBuilder.buildMatchSelfieToSelfiePayload();

    const response = await customerClient.matchSelfieToSelfie(payload);
    expect([200]).toContain(response.status);
    // Add response parameter to allure report
    allure.parameter('Form ID', response.data.resultData.verificationResultId);
    expect(response.data.status.statusCode).toBe('000');
    expect(response.data.status.statusMessage).toBe("Form Submitted Successfully");
    expect(response.data.resultData.verificationResult).toBe('Approved');

  });

});

