import { generateManagementSummary } from '../src/utils/reportUtils';
import * as dotenv from 'dotenv';
import path from 'path';

const environment = process.env.ENV || 'QA';
dotenv.config({ path: path.resolve(__dirname, `../.env.${environment.toLowerCase()}`) });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('Generating management summary...');
generateManagementSummary('allure-results', 'summary.json');
console.log('Summary generated successfully.');
