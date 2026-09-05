import { test, expect } from '../../src/fixtures/api.fixture';
import { allure } from 'allure-playwright';
import { PayloadBuilder } from '../../src/utils/payloadBuilder';
import * as http from 'http';
import * as os from 'os';
import { AddressInfo } from 'net';

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    if (!iface) continue;
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return '127.0.0.1';
}

test.describe('IDMission Customer API', () => {

  // Independent test - tagged as Sanity
  test('Should successfully validate ID', { tag: ['@sanity', '@company:HWTest_Sandbox'] }, async ({ customerClient }) => {
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
  test('validate ID IND Passport idBackImageRequired N', { tag: ['@regression', '@company:HWTest_Sandbox'] }, async ({ customerClient }) => {
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

  // Test case for Webhook validation
  test('validate ID with Webhook triggered postDataAPIRequired Y and postDataAPIURL', { tag: ['@regression', '@company:HWTest_Sandbox'] }, async ({ customerClient }) => {
    allure.epic('Customer API');
    allure.feature('Validate ID');
    allure.story('Validate ID with Webhook');

    let webhookTriggered = false;
    let webhookPayload: any = null;

    const server = http.createServer((req, res) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        webhookTriggered = true;
        try {
          webhookPayload = JSON.parse(body);
        } catch (e) {
          webhookPayload = body;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'success' }));
      });
    });

    await new Promise<void>((resolve) => {
      server.listen(0, () => resolve());
    });

    const port = (server.address() as AddressInfo).port;
    const ipAddress = getLocalIpAddress();
    const webhookUrl = `http://${ipAddress}:${port}/webhook`;

    console.log(`Webhook server listening on ${webhookUrl}`);

    try {
      const payload = PayloadBuilder.buildValidateIdPayload({
        "additionalData": {
          "postDataAPIRequired": "Y",
          "postDataAPIURL": webhookUrl
        }
      });

      const response = await customerClient.validateId(payload);
      expect([200]).toContain(response.status);
      allure.parameter('Form ID', response.data.resultData.verificationResultId);
      expect(response.data.status.statusCode).toBe('000');
      expect(response.data.status.statusMessage).toBe("Form Submitted Successfully");
      expect(response.data.resultData.verificationResult).toBe('Approved');

      // Wait briefly for the webhook to be triggered
      let retries = 15;
      while (!webhookTriggered && retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        retries--;
      }

      expect(webhookTriggered, `Webhook should be triggered at ${webhookUrl}`).toBe(true);
      // Optionally log the webhook payload for debugging
      // console.log('Webhook payload received:', webhookPayload);

      // Validate webhook payload
      expect(webhookPayload).toBeDefined();
      expect(webhookPayload.Form_Status).toBe('Approved');
      expect(webhookPayload.Form_Id).toBe(response.data.resultData.verificationResultId);
      expect(webhookPayload.Form_Data).toBeDefined();
      expect(webhookPayload.Form_Data.ID_Number).toBe('062015218');
      expect(webhookPayload.Form_Data.Valid_ID_Number).toBe('Y');
      expect(webhookPayload.Form_Data.Face_Detected).toBe('Y');
      expect(webhookPayload.Form_Data.ID_Number_Match_Result).toBe('Matched');
      expect(webhookPayload.Form_Data.Form_State_Code).toBe('00');
    } finally {
      server.close();
    }
  });

});

