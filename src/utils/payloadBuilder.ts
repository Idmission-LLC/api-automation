import { env } from 'process';
import { TestDataUtils } from './testData';

/**
 * Deep merges two objects.
 */
function deepMerge(target: any, source: any): any {
    if (typeof target !== 'object' || target === null) {
        return source;
    }
    if (typeof source !== 'object' || source === null) {
        return target;
    }

    if (Array.isArray(source)) {
        return source;
    }

    const output = { ...target };
    for (const key of Object.keys(source)) {
        if (source[key] instanceof Object && !Array.isArray(source[key])) {
            output[key] = deepMerge(target[key] || {}, source[key]);
        } else {
            output[key] = source[key];
        }
    }
    return output;
}

export class PayloadBuilder {

    /**
     * Internal helper to merge overrides and process dynamic data
     */
    private static processAndMerge(basePayload: any, overrides: any = {}): any {
        const base = JSON.parse(JSON.stringify(basePayload));
        const merged = deepMerge(base, overrides);
        return TestDataUtils.processPayload(merged);
    }

    // ==========================================
    // VALIDATE ID
    // ==========================================
    public static buildValidateIdPayload(overrides: any = {}): any {
        const base = {
            "customerData": {
                "idData": {
                    "idType": "NSP",
                    "idCountry": "NSP",
                    "idState": "",
                    "idImageFront": "{{IDFront.jpeg}}",
                    "idImageBack": "{{IDBack.jpeg}}",
                    "idNumber": "",
                    "idNumber2": "",
                    "issueDate": "",
                    "expDate": ""
                },
                "personalData": {
                    "uniqueNumber": "{{$timestamp}}",
                    "name": "",
                    "phone": "",
                    "phoneCountryCode": "",
                    "email": "",
                    "dob": "",
                    "gender": "",
                    "addressLine1": "",
                    "addressLine2": "",
                    "city": "",
                    "district": "",
                    "country": ""
                },
                "additionalDocuments": [
                    {
                        "documentName": "",
                        "additionalDocument": "",
                        "processAsPOA": "N",
                        "analysePOA": "N"
                    }
                ]
            },
            "additionalData": {
                "uniqueRequestId": "{{$timestamp}}",
                "clientTraceId": "{{$timestamp}}",
                "manualReviewRequired": "N",
                "bypassAgeValidation": "N",
                "deDuplicationRequired": "N",
                "bypassNameMatching": "Y",
                "postDataAPIRequired": "N",
                "sendInputImagesInPost": "N",
                "sendProcessedImagesInPost": "N",
                "needImmediateResponse": "N",
                "verifyDataWithHost": "N",
                "advancedTamperDetection": "N",
                "idBackImageRequired": "Y",
                "stripSpecialCharacters": "Y",
                "idImageResolutionCheck": "Y",
                "postDataOnReviewRequired": "N",
                "gpsCoordinates": ""
            }
        };
        return this.processAndMerge(base, overrides);
    }

    // ==========================================
    // ENROLL
    // ==========================================
    public static buildEnrollPayload(overrides: any = {}): any {
        // TODO: Populate the exact base JSON for Enroll
        const base = {
            "customerData": {
                "idData": {
                    "idType": "NSP",
                    "idCountry": "NSP",
                    "idState": "",
                    "idImageFront": "{{IDFront.jpeg}}",
                    "idImageBack": "{{IDBack.jpeg}}",
                    "idNumber": "",
                    "idNumber2": "",
                    "issueDate": "",
                    "expDate": ""
                },
                "personalData": {
                    "uniqueNumber": "062015218",
                    "name": "",
                    "phone": "",
                    "phoneCountryCode": "",
                    "email": "",
                    "dob": "",
                    "gender": "",
                    "addressLine1": "",
                    "addressLine2": "",
                    "city": "",
                    "district": "",
                    "postalCode": "",
                    "country": ""
                },
                "signatureData": {
                    "signatureImage": ""
                },
                "additionalDocuments": [
                    {
                        "documentName": "",
                        "additionalDocument": ""
                    }
                ],
                "biometricData": {
                    "selfie": "{{Selfie.jpeg}}"
                }
            },
            "additionalData": {
                "uniqueRequestId": "{{$timestamp}}",
                "clientTraceId": "{{$timestamp}}",
                "manualReviewRequired": "N",
                "bypassAgeValidation": "N",
                "deDuplicationRequired": "N",
                "bypassNameMatching": "Y",
                "postDataAPIRequired": "N",
                "sendInputImagesInPost": "N",
                "sendProcessedImagesInPost": "N",
                "needImmediateResponse": "N",
                "deduplicationSynchronous": "N",
                "verifyDataWithHost": "N",
                "idBackImageRequired": "Y",
                "stripSpecialCharacters": "Y",
                "idImageResolutionCheck": "Y",
                "deDupDataRequiredInResponse": "N",
                "deDupManualReviewRequired": "N",
                "gpsCoordinates": "",
                "sendProcessedImagesInResponse": "Y"
            },
            "signature": {
                "signatureImage": ""
            }
        };
        return this.processAndMerge(base, overrides);
    }

    // ==========================================
    // GET PROCESSED DATA
    // ==========================================
    public static buildGetProcessedDataPayload(overrides: any = {}): any {
        // TODO: Populate the exact base JSON for Get Processed Data
        const base = {
            "additionalData": {
                "verificationResultId": "",
                "sendInputImages": "N",
                "sendProcessedImages": "N",
                "stripSpecialCharacters": "Y",
                "sendHostDataInPost": "N",
                "sendSignatureFromIdInResponse": "N",
                "sendDocumentIdInResponse": "Y",
                "sendMetaDataInResponse": "N"
            }
        };
        return this.processAndMerge(base, overrides);
    }

    // ==========================================
    // OTHER ENDPOINTS (SCAFFOLDING)
    // ==========================================

    public static buildAutofillPayload(overrides: any = {}): any {
        const base = {
            "customerData": {
                "idData": {
                    "idImageFront": "{{IDFront.jpeg}}",
                    "idImageBack": "{{IDBack.jpeg}}",
                    "idBarcodeImage": ""
                },
                "additionalData": {
                    "uniqueRequestId": "{{$timestamp}}",
                    "clientRequestID": "{{$timestamp}}",
                    "sendDocumentIdInResponse": "Y",
                    "gpsCoordinates": ""
                },
                "additionalDocuments": [
                    {
                        "documentName": "",
                        "additionalDocument": ""
                    }
                ]
            }
        }; // Replace with Autofill base JSON
        return this.processAndMerge(base, overrides);
    }

    public static buildCreateVerificationRecordPayload(overrides: any = {}): any {
        const base = {}; // Replace with create-verification-record base JSON
        return this.processAndMerge(base, overrides);
    }

    public static buildDeclineConsentPayload(overrides: any = {}): any {
        const base = {}; // Replace with decline-consent base JSON
        return this.processAndMerge(base, overrides);
    }

    public static buildEnrollBiometricsPayload(overrides: any = {}): any {
        const base = {
            "customerData": {
                "personalData": {
                    "uniqueNumber": "{{$timestamp}}",
                    "name": "",
                    "phone": "",
                    "phoneCountryCode": "",
                    "email": "",
                    "dob": "",
                    "gender": "",
                    "addressLine1": "",
                    "addressLine2": "",
                    "city": "",
                    "district": "",
                    "country": "",
                    "cardToken": "",
                    "cardLast4": ""
                },
                "biometricData": {
                    "selfie": "{{Selfie3.jpeg}}",
                    "fingerPrintData": {
                        "fingerPrints": [
                            {
                                "fpData": "{{FP.json}}",
                                "fpPosition": "LTHUMB",
                                "imageHashValue": "23A4055DC846501ECEDCE503684DA8648F86E289618D9BE010C9FF23E0BE5D94",
                                "nfiq": "1"
                            }
                        ],
                        "metadata": {
                            "format": "JPEG",
                            "model": "FS80",
                            "serialNumber": "FS80-4C4C4544-0039-4D10-8035-B1C04F353332",
                            "backgroundColor": "W"
                        }

                    }
                }
            },
            "additionalData": {
                "uniqueRequestId": "{{$timestamp}}",
                "manualReviewRequired": "N",
                "detectLiveness": "Y",
                "stripSpecialCharacters": "N",
                "needImmediateResponse": "N",
                "deDuplicationRequired": "N",
                "postDataAPIRequired": "Y",
                "gpsCoordinates": ""
            }
        }; // Replace with enroll-biometrics base JSON
        return this.processAndMerge(base, overrides);
    }

    public static buildGenerateIdentityLinkPayload(overrides: any = {}): any {
        const base = {
            "customerData": {
                "countryCodeSMS": "",
                "requestType": "IDV",
                "mobileNumber": "",
                "personalData": {
                    "name": "Test123",
                    "uniqueNumber": "{{$timestamp}}"
                },
                "email": "Hemantw@idmission.com"
            },
            "additionalData": {
                "clientRequestID": "Test{{$timestamp}}",
                "notifyLink": "true"
            },
            "companyData": {
                "companyCode": env.client_id
            }
        }; // Replace with generate-identity-link base JSON
        return this.processAndMerge(base, overrides);
    }

    public static buildIdRealcheckPayload(overrides: any = {}): any {
        const base = {
            "customerData": {
                "idData": {
                    "idImageFront": "{{IDFront.jpeg}}",
                    "idImageBack": "{{IDBack.jpeg}}"
                },
                "additionalData": {
                    "uniqueRequestId": "{{$timestamp}}",
                    "clientRequestID": "{{$timestamp}}",
                    "detectLiveness": "Y",
                    "advancedTamperDetection": "Y",
                    "stripSpecialCharacters": "Y",
                    "idImageResolutionCheck": "Y",
                    "gpsCoordinates": ""
                },
                "additionalDocuments": [
                    {
                        "documentName": "",
                        "additionalDocument": ""
                    }
                ]
            }
        }; // Replace with id-realcheck base JSON
        return this.processAndMerge(base, overrides);
    }

    public static buildIdentifyPayload(overrides: any = {}): any {
        const base = {
            "additionalData": {
                "uniqueRequestId": "{{$timestamp}}",
                "stripSpecialCharacters": "Y",
                "postDataAPIRequired": "N",
                "postDataAPIURL": "",
                "piiExclusion": "Y",
                "detectLabel": "Y",
                "detectClosedEyes": "Y",
                "sendDocumentIdInResponse": "Y"
            },
            "customerData": {
                "additionalDocuments": [],
                "biometricData": {
                    "selfie": "{{Selfie.jpeg}}"
                }
            }
        }; // Replace with identify base JSON
        return this.processAndMerge(base, overrides);
    }

    public static buildLiveCheckPayload(overrides: any = {}): any {
        const base = {
            "customerData": {
                "additionalDocuments": [
                    {
                        "documentName": "",
                        "additionalDocument": ""
                    }
                ],
                "biometricData": {
                    "selfie": "{{Selfie.jpeg}}"
                }
            },
            "additionalData": {
                "uniqueRequestId": "{{$timestamp}}",
                "clientRequestID": "{{$timestamp}}",
                "stripSpecialCharacters": "Y",
                "estimateAge": "Y",
                "predictGender": "Y",
                "gpsCoordinates": "",
                "detectLabel": "Y",
                "detectClosedEyes": "Y",
                "sendDocumentIdInResponse": "Y"
            }
        }; // Replace with live-check base JSON
        return this.processAndMerge(base, overrides);
    }

    public static buildMatchIdFacePayload(overrides: any = {}): any {
        const base = {
            "customerData": {
                "idData": {
                    "idImageFront": "{{IDFront.jpeg}}"
                },
                "biometricData": {
                    "selfie": "{{Selfie.jpeg}}"
                }
            },
            "additionalData": {
                "uniqueRequestId": "{{$timestamp}}",
                "manualReviewRequired": "N",
                "postDataAPIRequired": "N",
                "postDataAPIURL": "",
                "postDataOnReviewRequired": "N",
                "postDataOnReviewAPIURL": "",
                "sendInputImagesInPost": "N",
                "needImmediateResponse": "N",
                "gpsCoordinates": "",
                "piiExclusion": "Y",
                "detectClosedEyes": "Y",
                "sendDocumentIdInResponse": "Y"
            }
        }; // Replace with match-id-face base JSON
        return this.processAndMerge(base, overrides);
    }

    public static buildMatchSelfieToSelfiePayload(overrides: any = {}): any {
        const base = {
            "customerData": {
                "biometricData": {
                    "selfie": "{{Selfie2.jpeg}}",
                    "enrolledSelfie": "{{Selfie.jpeg}}"
                }
            },
            "additionalData": {
                "uniqueRequestId": "{{$timestamp}}",
                "clientRequestID": "{{$timestamp}}",
                "manualReviewRequired": "N",
                "postDataAPIRequired": "N",
                "postDataAPIURL": "",
                "sendMetaDataInPost": "N",
                "postDataOnReviewRequired": "N",
                "postDataOnReviewAPIURL": "",
                "sendInputImagesInPost": "N",
                "needImmediateResponse": "N",
                "gpsCoordinates": "",
                "piiExclusion": "Y",
                "detectClosedEyes": "Y",
                "sendDocumentIdInResponse": "Y"
            }
        }; // Replace with match-selfie-to-selfie base JSON
        return this.processAndMerge(base, overrides);
    }

    public static buildProofOfAddressPayload(overrides: any = {}): any {
        const base = {
            "customerData": {
                "personalData": {
                    "name": "LLANO ALVAREZ DIEGO",
                    "firstName": "LLANO",
                    "middleName": "ALVAREZ",
                    "lastName": "DIEGO",
                    "addressLine1": "",
                    "addressLine2": "",
                    "city": "",
                    "district": "",
                    "state": "",
                    "postalCode": "",
                    "country": ""
                },
                "poaData": {
                    "documentName": "Test",
                    "document": "{{POA.pdf}}"
                }
            },
            "additionalData": {
                "uniqueRequestId": "{{$timestamp}}",
                "clientRequestID": "{{$timestamp}}",
                "gpsCoordinates": "",
                "customerDataMatchConfig": {
                    "nameMatch": "Y",
                    "nameMatchAlgorithm": "JW",
                    "nameMatchThreshold": "90",
                    "firstNameMatch": "Y",
                    "firstNameMatchAlgorithm": "JW",
                    "firstNameMatchThreshold": "90",
                    "middleNameMatch": "Y",
                    "middleNameMatchAlgorithm": "JW",
                    "middleNameMatchThreshold": "90",
                    "lastNameMatch": "Y",
                    "lastNameMatchAlgorithm": "JW",
                    "lastNameMatchThreshold": "90",
                    "addressMatch": "Y",
                    "addressMatchAlgorithm": "JW",
                    "addressMatchThreshold": "90",
                    "postalCodeMatch": "Y",
                    "postalCodeMatchAlgorithm": "JW",
                    "postalCodeMatchThreshold": "100"
                }
            }
        }; // Replace with proof-of-address base JSON
        return this.processAndMerge(base, overrides);
    }

    public static buildValidateIdMatchFacePayload(overrides: any = {}): any {
        const base = {
            "customerData": {
                "idData": {
                    "idType": "NSP",
                    "idCountry": "NSP",
                    "idState": "",
                    "idImageFront": "{{IDFront.jpeg}}",
                    "idImageBack": "{{IDBack.jpeg}}",
                    "idNumber": "",
                    "idNumber2": "",
                    "issueDate": "",
                    "expDate": ""
                },
                "personalData": {
                    "uniqueNumber": "{{$timestamp}}",
                    "name": "",
                    "phone": "",
                    "phoneCountryCode": "",
                    "email": "",
                    "dob": "",
                    "gender": "",
                    "addressLine1": "",
                    "addressLine2": "",
                    "city": "",
                    "district": "",
                    "postalCode": "",
                    "country": ""
                },
                "additionalDocuments": [
                    {
                        "documentName": "",
                        "additionalDocument": "",
                        "processAsPOA": "N",
                        "analysePOA": "N"
                    }
                ],
                "biometricData": {
                    "selfie": "{{Selfie.jpeg}}"
                }
            },
            "additionalData": {
                "uniqueRequestId": "{{$timestamp}}",
                "clientTraceId": "{{$timestamp}}",
                "manualReviewRequired": "N",
                "bypassAgeValidation": "N",
                "deDuplicationRequired": "N",
                "bypassNameMatching": "Y",
                "postDataAPIRequired": "N",
                "postDataAPIURL": "",
                "sendInputImagesInPost": "N",
                "sendProcessedImagesInPost": "N",
                "needImmediateResponse": "N",
                "deduplicationSynchronous": "N",
                "verifyDataWithHost": "N",
                "idBackImageRequired": "Y",
                "stripSpecialCharacters": "Y",
                "idImageResolutionCheck": "Y",
                "deDupDataRequiredInResponse": "N",
                "postDataOnReviewRequired": "N",
                "gpsCoordinates": "",
                "piiExclusion": "N",
                "detectLiveness": "Y",
                "advancedTamperDetection": "N",
                "detectLabel": "Y",
                "detectClosedEyes": "Y",
                "sendSignatureFromIdInResponse": "Y",
                "sendProcessedImagesInResponse": "Y",
                "sendDocumentIdInResponse": "Y",
                "customerDataMatchConfig": {
                    "idNumberMatch": "N",
                    "idNumberMatchAlgorithm": "JW",
                    "idNumberMatchThreshold": "80",
                    "dateOfBirthMatch": "N",
                    "dateOfBirthMatchAlgorithm": "JW",
                    "dateOfBirthMatchThreshold": "80",
                    "expiryDateMatch": "N",
                    "expiryDateMatchAlgorithm": "JW",
                    "expiryDateMatchThreshold": "90",
                    "nameMatch": "N",
                    "nameMatchAlgorithm": "JW",
                    "nameMatchThreshold": "70",
                    "firstNameMatch": "N",
                    "firstNameMatchAlgorithm": "JW",
                    "firstNameMatchThreshold": "70",
                    "middleNameMatch": "N",
                    "middleNameMatchAlgorithm": "JW",
                    "middleNameMatchThreshold": "15",
                    "lastNameMatch": "N",
                    "lastNameMatchAlgorithm": "JW",
                    "lastNameMatchThreshold": "90",
                    "addressMatch": "N",
                    "addressMatchAlgorithm": "JW",
                    "addressMatchThreshold": "70"
                }
            }
        }; // Replace with validate-id-match-face base JSON
        return this.processAndMerge(base, overrides);
    }

    public static buildVerifyPayload(overrides: any = {}): any {
        const base = {
            "customerData": {
                "personalData": {
                    "uniqueNumber": "062015218"
                },
                "biometericData": {
                    "selfie": "{{Selfie2.jpeg}}"
                }
            },
            "additionalData": {
                "uniqueRequestId": "{{$timestamp}}",
                "stripSpecialCharacters": "Y",
                "postDataAPIRequired": "N",
                "gpsCoordinates": "",
                "piiExclusion": "Y",
                "detectLabel": "Y",
                "detectClosedEyes": "Y",
                "sendDocumentIdInResponse": "Y"
            }
        }; // Replace with verify base JSON
        return this.processAndMerge(base, overrides);
    }
}
