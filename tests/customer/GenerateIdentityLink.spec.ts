import { test, expect } from '../../src/fixtures/api.fixture';
import { allure } from 'allure-playwright';
import { PayloadBuilder } from '../../src/utils/payloadBuilder';

test.describe('IDMission Customer API', () => {

  // Independent test - tagged as Sanity
  test('Validate GenerateIdentityLink', { tag: '@sanity' }, async ({ customerClient }) => {
    allure.epic('Customer API');
    allure.feature('GenerateIdentityLink');
    allure.story('GenerateIdentityLink');

    // Just use the base payload without overrides
    const payload = PayloadBuilder.buildGenerateIdentityLinkPayload();

    const response = await customerClient.generateIdentityLink(payload);
    expect([200]).toContain(response.status);
    expect(response.data.status.statusCode).toBe('000');
    expect(response.data.status.statusMessage).toBe("Successfully generated Kyc Url.");
  });

});

