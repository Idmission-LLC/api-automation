import fs from 'fs';
import path from 'path';
import { ExecutionSummary } from '../src/utils/reportUtils';
import * as dotenv from 'dotenv';
// In a real framework, we'd use axios or fetch to send webhook
import axios from 'axios';

const environment = process.env.ENV || 'QA';
dotenv.config({ path: path.resolve(__dirname, `../.env.${environment}`) });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function sendSlackNotification() {
  try {
    if (process.env.ENABLE_SLACK_NOTIFICATIONS !== 'true') {
      console.log('Slack notifications are disabled in .env (ENABLE_SLACK_NOTIFICATIONS=false). Skipping.');
      return;
    }

    const summaryPath = path.resolve(process.cwd(), 'summary.json');
    if (!fs.existsSync(summaryPath)) {
      console.warn('Summary file not found. Skipping Slack notification.');
      return;
    }

    const summary: ExecutionSummary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl || webhookUrl.includes('XXXXX')) {
      console.warn('Invalid or missing SLACK_WEBHOOK_URL. Skipping notification.');
      return;
    }

    const statusIcon = summary.status === 'GO' ? '✅' : (summary.status === 'ATTENTION_REQUIRED' ? '⚠️' : '🔴');
    const color = summary.status === 'GO' ? '#36a64f' : (summary.status === 'ATTENTION_REQUIRED' ? '#ffcc00' : '#ff0000');

    const message = {
      attachments: [
        {
          color: color,
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: '🚀 Daily API Automation Report',
                emoji: true
              }
            },
            {
              type: 'section',
              fields: [
                { type: 'mrkdwn', text: `*Environment:*\n${summary.environment}` },
                { type: 'mrkdwn', text: `*Execution Date:*\n${new Date().toLocaleString()}` }
              ]
            },
            {
              type: 'section',
              fields: [
                { type: 'mrkdwn', text: `*Total:* ${summary.total}` },
                { type: 'mrkdwn', text: `*Pass Rate:* ${summary.passRate}%` },
                { type: 'mrkdwn', text: `✅ *Passed:* ${summary.passed}` },
                { type: 'mrkdwn', text: `❌ *Failed:* ${summary.failed}` },
                { type: 'mrkdwn', text: `⚠️ *Skipped:* ${summary.skipped}` },
                { type: 'mrkdwn', text: `*Duration:* ${summary.duration}` }
              ]
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Status:* ${statusIcon} ${summary.status.replace('_', ' ')}`
              }
            },
            {
              type: 'actions',
              elements: [
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: '📊 View Allure Report'
                  },
                  url: 'https://ci.example.com/job/api-automation/lastSuccessfulBuild/allure/'
                }
              ]
            }
          ]
        }
      ]
    };

    const response = await axios.post(webhookUrl, message);
    console.log(`Slack notification sent successfully: ${response.status}`);
  } catch (error: any) {
    console.error(`Failed to send Slack notification: ${error.message}`);
  }
}

sendSlackNotification();
