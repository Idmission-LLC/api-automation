import fs from 'fs';
import path from 'path';
import { logger } from './logger';
import { envConfig } from '../config/config';

export interface ExecutionSummary {
  environment: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
  passRate: string;
  duration: string;
  status: 'GO' | 'NO-GO' | 'ATTENTION_REQUIRED';
}

export function generateManagementSummary(resultsDir: string, outputFile: string): void {
  try {
    let passed = 0, failed = 0, skipped = 0, flaky = 0, total = 0;
    let durationStr = '0m 0s';
    
    const jsonReportPath = path.resolve(process.cwd(), 'test-results.json');
    if (fs.existsSync(jsonReportPath)) {
      const report = JSON.parse(fs.readFileSync(jsonReportPath, 'utf8'));
      if (report.stats) {
        passed = report.stats.expected || 0;
        failed = report.stats.unexpected || 0;
        skipped = report.stats.skipped || 0;
        flaky = report.stats.flaky || 0;
        total = passed + failed + skipped + flaky;
        
        const durationMs = report.stats.duration || 0;
        const mins = Math.floor(durationMs / 60000);
        const secs = Math.floor((durationMs % 60000) / 1000);
        durationStr = `${mins}m ${secs}s`;
      }
    } else {
      logger.warn(`Playwright JSON report not found at ${jsonReportPath}. Summary will be 0.`);
    }

    const passRate = total > 0 ? ((passed / (total - skipped)) * 100).toFixed(1) : '0.0';
    let status: 'GO' | 'NO-GO' | 'ATTENTION_REQUIRED' = 'GO';
    if (failed > 0) status = 'NO-GO';
    else if (flaky > 0 || skipped > 0) status = 'ATTENTION_REQUIRED';

    const summary: ExecutionSummary = {
      environment: process.env.ENV || 'QA',
      total,
      passed,
      failed,
      skipped,
      flaky,
      passRate,
      duration: durationStr,
      status
    };

    const outPath = path.resolve(process.cwd(), outputFile);
    fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
    logger.info(`Execution summary generated at: ${outPath}`);
  } catch (error: any) {
    logger.error(`Failed to generate management summary: ${error.message}`);
  }
}
