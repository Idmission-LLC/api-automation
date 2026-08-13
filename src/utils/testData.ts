import fs from 'fs';
import path from 'path';
import * as crypto from 'crypto';
import { logger } from './logger';

export class TestDataUtils {
    /**
     * Reads a file and returns its base64 string representation.
     * If the file is a .json or .txt, it assumes the file already contains raw base64 text.
     */
    public static getBase64FromFile(filePath: string): string {
        const fullPath = path.resolve(process.cwd(), filePath);
        if (!fs.existsSync(fullPath)) {
            logger.warn(`File not found: ${fullPath}, returning empty string.`);
            return '';
        }
        
        // If it's a json or txt file, assume it's already a base64 string inside
        if (fullPath.endsWith('.json') || fullPath.endsWith('.txt')) {
            return fs.readFileSync(fullPath, 'utf-8').trim();
        }

        // For actual image/pdf files, convert buffer to base64
        const fileContent = fs.readFileSync(fullPath);
        return fileContent.toString('base64');
    }

    /** Replaces placeholders in a payload with dynamic data.
     * Supported placeholders: {{$timestamp}}, {{IDFront.jpeg}}, {{HWPP2.json}}, etc.
     */
    public static processPayload(payload: any): any {
        let payloadStr = JSON.stringify(payload);
        
        // Generate a foolproof unique ID (Timestamp + Random Hex) for parallel execution
        const uniqueId = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
        payloadStr = payloadStr.replace(/\{\{\$timestamp\}\}/g, uniqueId);

        // Dynamically replace any {{filename.ext}} placeholders (images, pdfs, json containing base64)
        const fileRegex = /\{\{([a-zA-Z0-9_-]+\.(?:jpeg|jpg|png|pdf|json|txt))\}\}/gi;
        let match;
        while ((match = fileRegex.exec(payloadStr)) !== null) {
            const fullMatch = match[0]; // e.g. {{USA_DL_GA_FRONT.jpeg}} or {{HWPP2.json}}
            const fileName = match[1];  // e.g. USA_DL_GA_FRONT.jpeg
            const base64Str = this.getBase64FromFile(`test-data/images/${fileName}`);
            
            // Replace globally for this specific placeholder in case it appears multiple times
            payloadStr = payloadStr.split(fullMatch).join(base64Str);
        }

        return JSON.parse(payloadStr);
    }
}
