import { test, expect } from '../../src/fixtures/api.fixture';
import { allure } from 'allure-playwright';
import { PayloadBuilder } from '../../src/utils/payloadBuilder';

test.describe('IDMission Customer API', () => {

  // Independent test - tagged as Sanity
  test('Should successfully validate proof of address', { tag: ['@sanity', '@company:HWTest_Sandbox'] }, async ({ customerClient }) => {
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
    expect(response.data.responseCustomerData.extractedData.isPOA).toBe('Y');

  });

  test('Utility with Approved PDF file', { tag: ['@regression', '@company:HWTest_Sandbox'] }, async ({ customerClient }) => {
    allure.epic('Customer API');
    allure.feature('proof of address');
    allure.story('proof of address');

    // Just use the base payload without overrides
    const payload = PayloadBuilder.buildProofOfAddressPayload({
      "customerData": {
        "personalData": {
          "name": "Jane Smith",
          "firstName": "Jane",
          "middleName": "",
          "lastName": "Smith",
          "addressLine1": "1600 Amphitheatre Pkway Mountain View, CA 94043",
          "addressLine2": "",
          "city": "MOUNTAIN VIEW",
          "district": "MOUNTAIN VIEW",
          "state": "CA",
          "postalCode": "94043",
          "country": ""
        },
        "poaData": {
          "documentName": "Test",
          "document": "{{POA_google_invoice.pdf}}",
          "documentType": "Utility"
        }
      }
    });

    const response = await customerClient.proofOfAddress(payload);
    expect([200]).toContain(response.status);
    // Add response parameter to allure report
    allure.parameter('Form ID', response.data.resultData.verificationResultId);
    expect(response.data.status.statusCode).toBe('000');
    expect(response.data.status.statusMessage).toBe("Form Submitted Successfully");
    expect(response.data.resultData.verificationResult).toBe('Approved');
    expect(response.data.responseCustomerData.extractedData.isPOA).toBe('Y');

  });

  test('Utility with Mr in Extracted name Approved jpg file', { tag: ['@regression', '@company:HWTest_Sandbox'] }, async ({ customerClient }) => {
    allure.epic('Customer API');
    allure.feature('proof of address');
    allure.story('proof of address');

    // Just use the base payload without overrides
    const payload = PayloadBuilder.buildProofOfAddressPayload({
      "customerData": {
        "personalData": {
          "name": "John Doe",
          "firstName": "John",
          "middleName": "",
          "lastName": "Doe",
          "addressLine1": "2 Post Alley, Seattle, WA 98101",
          "addressLine2": "",
          "city": "Seattle",
          "district": "Seattle",
          "state": "WA",
          "postalCode": "98101",
          "country": ""
        },
        "poaData": {
          "documentName": "Test",
          "document": "{{POA_FifthThirdBank.jpg}}",
          "documentType": "Utility"
        }
      }
    });

    const response = await customerClient.proofOfAddress(payload);
    expect([200]).toContain(response.status);
    // Add response parameter to allure report
    allure.parameter('Form ID', response.data.resultData.verificationResultId);
    expect(response.data.status.statusCode).toBe('000');
    expect(response.data.status.statusMessage).toBe("Form Submitted Successfully");
    expect(response.data.resultData.verificationResult).toBe('Approved');
    expect(response.data.responseCustomerData.extractedData.isPOA).toBe('Y');

  });

  test('Utility Name Match Failed case due to First name not matching', { tag: ['@regression', '@company:HWTest_Sandbox'] }, async ({ customerClient }) => {
    allure.epic('Customer API');
    allure.feature('proof of address');
    allure.story('proof of address');

    // Just use the base payload without overrides
    const payload = PayloadBuilder.buildProofOfAddressPayload({
      "customerData": {
        "personalData": {
          "name": "John Doe",
          "firstName": "Doe",
          "middleName": "",
          "lastName": "Doe",
          "addressLine1": "2 Post Alley, Seattle, WA 98101",
          "addressLine2": "",
          "city": "Seattle",
          "district": "Seattle",
          "state": "WA",
          "postalCode": "98101",
          "country": ""
        },
        "poaData": {
          "documentName": "Test",
          "document": "{{POA_FifthThirdBank.jpg}}",
          "documentType": "Utility"
        }
      }
    });

    const response = await customerClient.proofOfAddress(payload);
    expect([200]).toContain(response.status);
    // Add response parameter to allure report
    allure.parameter('Form ID', response.data.resultData.verificationResultId);
    expect(response.data.status.statusCode).toBe('000');
    expect(response.data.status.statusMessage).toBe("Form Submitted Successfully");
    expect(response.data.resultData.verificationResult).toBe('Name Match Failed');
    expect(response.data.resultData.verificationResultCode).toBe('66');
    expect(response.data.responseCustomerData.extractedData.isPOA).toBe('Y');

  });

  test('Utility Name Match Failed case due to last name not matching', { tag: ['@regression', '@company:HWTest_Sandbox'] }, async ({ customerClient }) => {
    allure.epic('Customer API');
    allure.feature('proof of address');
    allure.story('proof of address');

    // Just use the base payload without overrides
    const payload = PayloadBuilder.buildProofOfAddressPayload({
      "customerData": {
        "personalData": {
          "name": "John Doe",
          "firstName": "John",
          "middleName": "",
          "lastName": "John",
          "addressLine1": "2 Post Alley, Seattle, WA 98101",
          "addressLine2": "",
          "city": "Seattle",
          "district": "Seattle",
          "state": "WA",
          "postalCode": "98101",
          "country": ""
        },
        "poaData": {
          "documentName": "Test",
          "document": "{{POA_FifthThirdBank.jpg}}",
          "documentType": "Utility"
        }
      }
    });

    const response = await customerClient.proofOfAddress(payload);
    expect([200]).toContain(response.status);
    // Add response parameter to allure report
    allure.parameter('Form ID', response.data.resultData.verificationResultId);
    expect(response.data.status.statusCode).toBe('000');
    expect(response.data.status.statusMessage).toBe("Form Submitted Successfully");
    expect(response.data.resultData.verificationResult).toBe('Name Match Failed');
    expect(response.data.resultData.verificationResultCode).toBe('66');
    expect(response.data.responseCustomerData.extractedData.isPOA).toBe('Y');

  });

  test('Utility with Addres Match Failed case due to postal code not matching', { tag: ['@regression', '@company:HWTest_Sandbox'] }, async ({ customerClient }) => {
    allure.epic('Customer API');
    allure.feature('proof of address');
    allure.story('proof of address');

    // Just use the base payload without overrides
    const payload = PayloadBuilder.buildProofOfAddressPayload({
      "customerData": {
        "personalData": {
          "name": "John Doe",
          "firstName": "John",
          "middleName": "",
          "lastName": "Doe",
          "addressLine1": "2 Post Alley, Seattle, WA 98101",
          "addressLine2": "",
          "city": "Seattle",
          "district": "Seattle",
          "state": "WA",
          "postalCode": "98102",
          "country": ""
        },
        "poaData": {
          "documentName": "Test",
          "document": "{{POA_FifthThirdBank.jpg}}",
          "documentType": "Utility"
        }
      }
    });

    const response = await customerClient.proofOfAddress(payload);
    expect([200]).toContain(response.status);
    // Add response parameter to allure report
    allure.parameter('Form ID', response.data.resultData.verificationResultId);
    expect(response.data.status.statusCode).toBe('000');
    expect(response.data.status.statusMessage).toBe("Form Submitted Successfully");
    expect(response.data.resultData.verificationResult).toBe('Address Match Failed');
    expect(response.data.resultData.verificationResultCode).toBe('152');
    expect(response.data.responseCustomerData.extractedData.isPOA).toBe('Y');

  });

  test('Utility with Addres Match Failed case due to Address not matching', { tag: ['@regression', '@company:HWTest_Sandbox'] }, async ({ customerClient }) => {
    allure.epic('Customer API');
    allure.feature('proof of address');
    allure.story('proof of address');

    // Just use the base payload without overrides
    const payload = PayloadBuilder.buildProofOfAddressPayload({
      "customerData": {
        "personalData": {
          "name": "John Doe",
          "firstName": "John",
          "middleName": "",
          "lastName": "Doe",
          "addressLine1": "2 Post Alley, Seattle, 98101",
          "addressLine2": "",
          "city": "Seattle",
          "district": "Seattle",
          "state": "WA",
          "postalCode": "98101",
          "country": ""
        },
        "poaData": {
          "documentName": "Test",
          "document": "{{POA_FifthThirdBank.jpg}}",
          "documentType": "Utility"
        }
      }
    });

    const response = await customerClient.proofOfAddress(payload);
    expect([200]).toContain(response.status);
    // Add response parameter to allure report
    allure.parameter('Form ID', response.data.resultData.verificationResultId);
    expect(response.data.status.statusCode).toBe('000');
    expect(response.data.status.statusMessage).toBe("Form Submitted Successfully");
    expect(response.data.responseCustomerData.extractedData.isPOA).toBe('Y');
    expect(response.data.resultData.verificationResult).toBe('Address Match Failed');
    expect(response.data.resultData.verificationResultCode).toBe('152');
    expect(response.data.responseCustomerData.extractedData.isPOA).toBe('Y');

  });

  test('BankStatement with Approved Case', { tag: ['@regression', '@company:HWTest_Sandbox'] }, async ({ customerClient }) => {
    allure.epic('Customer API');
    allure.feature('proof of address');
    allure.story('proof of address');

    // Just use the base payload without overrides
    const payload = PayloadBuilder.buildProofOfAddressPayload({
      "customerData": {
        "personalData": {
          "name": "John Doe",
          "firstName": "John",
          "middleName": "",
          "lastName": "Doe",
          "addressLine1": "2 Post Alley, Seattle, WA 98101",
          "addressLine2": "",
          "city": "Seattle",
          "district": "Seattle",
          "state": "WA",
          "postalCode": "98101",
          "country": ""
        },
        "poaData": {
          "documentName": "Test",
          "document": "{{POA_FifthThirdBank.jpg}}",
          "documentType": "BankStatement"
        }
      }
    });

    const response = await customerClient.proofOfAddress(payload);
    expect([200]).toContain(response.status);
    // Add response parameter to allure report
    allure.parameter('Form ID', response.data.resultData.verificationResultId);
    expect(response.data.status.statusCode).toBe('000');
    expect(response.data.status.statusMessage).toBe("Form Submitted Successfully");
    expect(response.data.resultData.verificationResult).toBe('Approved');
    expect(response.data.resultData.verificationResultCode).toBe('00');
    expect(response.data.responseCustomerData.extractedData.isPOA).toBe('Y');
    expect(response.data.responseCustomerData.extractedData.issuerName).toBe('FIFTH THIRD BANK');
    expect(response.data.responseCustomerData.extractedData.customerName).toBe('Mr John Doe');
  });

  test('BankStatement 4th Page details with Approved Case', { tag: ['@regression', '@company:HWTest_Sandbox'] }, async ({ customerClient }) => {
    allure.epic('Customer API');
    allure.feature('proof of address');
    allure.story('proof of address');

    // Just use the base payload without overrides
    const payload = PayloadBuilder.buildProofOfAddressPayload({
      "customerData": {
        "personalData": {
          "name": "Rachael Dean",
          "firstName": "Rachael",
          "middleName": "",
          "lastName": "Dean",
          "addressLine1": "2 King Fork Rd. Indianapolis IN, 46201",
          "addressLine2": "",
          "city": "INDIANAPOLIS",
          "district": "INDIANAPOLIS",
          "state": "IN",
          "postalCode": "46201",
          "country": ""
        },
        "poaData": {
          "documentName": "Test",
          "document": "{{POA_WELLS_FARGO_4thPage.pdf}}",
          "documentType": "BankStatement"
        }
      }
    });

    const response = await customerClient.proofOfAddress(payload);
    expect([200]).toContain(response.status);
    // Add response parameter to allure report
    allure.parameter('Form ID', response.data.resultData.verificationResultId);
    expect(response.data.status.statusCode).toBe('000');
    expect(response.data.status.statusMessage).toBe("Form Submitted Successfully");
    expect(response.data.resultData.verificationResult).toBe('Approved');
    expect(response.data.resultData.verificationResultCode).toBe('00');
    expect(response.data.responseCustomerData.extractedData.isPOA).toBe('Y');
    expect(response.data.responseCustomerData.extractedData.issuerName).toBe('WELLS FARGO');
    expect(response.data.responseCustomerData.extractedData.customerName).toBe('Rachael Dean');
  });

  test('Proof of address Mex VID POA Analysis Failed', { tag: ['@regression', '@company:HWTest_Sandbox'] }, async ({ customerClient }) => {
    allure.epic('Customer API');
    allure.feature('proof of address');
    allure.story('proof of address');

    // Just use the base payload without overrides
    const payload = PayloadBuilder.buildProofOfAddressPayload({
      "customerData": {
        "personalData": {
          "name": "GOMEZ VELAZQUEZ",
          "firstName": "GOMEZ",
          "middleName": "",
          "lastName": "VELAZQUEZ",
          "addressLine1": "VADUCTO TLALPAN NO. 100 COL ARENAL TEPEPAN, ALCALDIA TLALPAN C.P. 14610, CIUDAD DE MEXICO",
          "addressLine2": "",
          "city": "CIUDAD DE",
          "district": "CIUDAD DE",
          "state": "MEX",
          "postalCode": "14610",
          "country": ""
        },
        "poaData": {
          "documentName": "Test",
          "document": "{{POA_MEX_VID.png}}"
        }
      }
    });

    const response = await customerClient.proofOfAddress(payload);
    expect([200]).toContain(response.status);
    // Add response parameter to allure report
    allure.parameter('Form ID', response.data.resultData.verificationResultId);
    expect(response.data.status.statusCode).toBe('000');
    expect(response.data.status.statusMessage).toBe("Form Submitted Successfully");
    expect(response.data.resultData.verificationResult).toBe('POA Analysis Failed');
    expect(response.data.resultData.verificationResultCode).toBe('142');
    expect(response.data.responseCustomerData.extractedData.isPOA).toBe('N');
  });

});


