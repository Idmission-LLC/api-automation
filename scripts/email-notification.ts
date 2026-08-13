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

    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;
    const from = process.env.EMAIL_FROM;
    const to = process.env.EMAIL_TO;

    if (!host || !user || !pass || !from || !to) {
      console.warn('Incomplete SMTP configuration. Skipping Email notification.');
      return;
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false
      }
    });

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
        
        <p style="margin-top: 20px;">
          <a href="https://ci.example.com/job/api-automation/lastSuccessfulBuild/allure/" style="background-color: #0056b3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Full Allure Report</a>
        </p>
      </div>
    `;

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html
    });

    console.log(`Email notification sent successfully: ${info.messageId}`);
  } catch (error: any) {
    console.error(`Failed to send Email notification: ${error.message}`);
  }
}

sendEmailNotification();
