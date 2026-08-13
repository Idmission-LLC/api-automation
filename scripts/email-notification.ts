import fs from 'fs';
import path from 'path';
import { ExecutionSummary } from '../src/utils/reportUtils';
import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

const environment = process.env.ENV || 'QA';
dotenv.config({ path: path.resolve(__dirname, `../.env.${environment}`) });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function sendEmailNotification() {
  try {
    if (process.env.ENABLE_EMAIL_NOTIFICATIONS !== 'true') {
      console.log('Email notifications are disabled in .env (ENABLE_EMAIL_NOTIFICATIONS=false). Skipping.');
      return;
    }

    const summaryPath = path.resolve(process.cwd(), 'summary.json');
    if (!fs.existsSync(summaryPath)) {
      console.warn('Summary file not found. Skipping Email notification.');
      return;
    }

    const summary: ExecutionSummary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));

    const to = process.env.EMAIL_TO;

    if (!to) {
      console.warn('EMAIL_TO is not defined. Skipping Email notification content generation.');
      return;
    }

    const statusColor = summary.status === 'GO' ? 'green' : (summary.status === 'ATTENTION_REQUIRED' ? 'orange' : 'red');
    const resultText = summary.failed > 0 ? 'FAILED' : 'PASSED';

    const subject = `Daily API Automation Report - ${resultText} - Pass Rate: ${summary.passRate}%`;

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">Daily API Automation Report</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Environment</th>
            <td style="padding: 10px; border: 1px solid #ddd;">${summary.environment}</td>
          </tr>
          <tr>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Execution Date</th>
            <td style="padding: 10px; border: 1px solid #ddd;">${new Date().toLocaleString()}</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Total Tests</th>
            <td style="padding: 10px; border: 1px solid #ddd;">${summary.total}</td>
          </tr>
          <tr>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left; color: green;">Passed</th>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: green;">${summary.passed}</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left; color: red;">Failed</th>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: red;">${summary.failed}</td>
          </tr>
          <tr>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left; color: orange;">Skipped</th>
            <td style="padding: 10px; border: 1px solid #ddd; color: orange;">${summary.skipped}</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Pass Rate</th>
            <td style="padding: 10px; border: 1px solid #ddd;">${summary.passRate}%</td>
          </tr>
          <tr>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Duration</th>
            <td style="padding: 10px; border: 1px solid #ddd;">${summary.duration}</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Status</th>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: ${statusColor};">${summary.status.replace('_', ' ')}</td>
          </tr>
        </table>
      </div>
    `;

    fs.writeFileSync(path.resolve(process.cwd(), 'email-subject.txt'), subject);
    fs.writeFileSync(path.resolve(process.cwd(), 'email-content.html'), html);
    fs.writeFileSync(path.resolve(process.cwd(), 'email-to.txt'), to);

    console.log(`Email content generated successfully for Jenkins emailext.`);
  } catch (error: any) {
    console.error(`Failed to generate Email content: ${error.message}`);
  }
}

sendEmailNotification();
