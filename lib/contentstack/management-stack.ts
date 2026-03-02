/**
 * @file management-stack.ts
 * @description Contentstack Management API client for build-time operations.
 * 
 * ⚠️ SECURITY WARNING: Only use in Node.js build scripts, never in browser code.
 * Requires CONTENTSTACK_MANAGEMENT_TOKEN with sensitive permissions.
 */

import * as contentstackManagementSDK from '@contentstack/management';
import { Locales } from '@contentstack/management/types/stack/contentType/entry';
import { Locale } from '@contentstack/management/types/stack/locale';
import { cache } from 'react';

interface ManagementClientConfig {
    /** Management API authentication token */
    authtoken: string;
    /** Stack API key */
    apiKey: string;
    /** Optional API host URL */
    host?: string;
}

/** Validates required environment variables */
function validateEnvironment(): void {
    const requiredVars = ['CONTENTSTACK_MANAGEMENT_TOKEN', 'CONTENTSTACK_API_KEY'];
    const missingVars = requiredVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missingVars.join(', ')}\n` +
            'Please ensure your .env file contains all required Contentstack credentials.'
        );
    }
}

/**
 * Creates Contentstack Management SDK client for build-time operations.
 * Used for fetching locales, schemas, and stack configuration.
 * 
 * @example
 * const stack = await createManagementClient();
 * const locales = await stack.locale().query().find();
 */
export async function createManagementClient() {
    validateEnvironment();

    const config: ManagementClientConfig = {
        authtoken: process.env.CONTENTSTACK_MANAGEMENT_TOKEN!,
        apiKey: process.env.CONTENTSTACK_API_KEY!,
    };

    try {
        const client = contentstackManagementSDK.client();
        const stack = client.stack({
            api_key: config.apiKey,
            management_token: config.authtoken,
        });

        return stack;
    } catch (error) {
        throw new Error(
            `Failed to initialize Contentstack Management client: ${error instanceof Error ? error.message : 'Unknown error'
            }`
        );
    }
}

/** Fetches all available locales from stack */
export async function fetchLocales(): Promise<Locale[]> {
    try {
        const stack = await createManagementClient();
        const response = await stack.locale().query().find();

        if (!response || !response.items) {
            throw new Error('Invalid response structure from Contentstack API');
        }

        return response.items as Locale[];
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch locales from Contentstack: ${error.message}`);
        }
        throw new Error('Failed to fetch locales from Contentstack: Unknown error');
    }
}

/** Tests Management API connection by attempting to fetch locales */
export async function testConnection(): Promise<boolean> {
    try {
        const stack = await createManagementClient();
        await stack.locale().query().find();
        return true;
    } catch (error) {
        throw new Error(
            `Contentstack Management API connection test failed: ${error instanceof Error ? error.message : 'Unknown error'
            }`
        );
    }
}

/** Fetches all locales in which an entry exists or has been published */
export const getEntryLocales = cache(async (entryUid: string, contentTypeUid: string) => {
    if (!entryUid || !contentTypeUid) {
        console.error('getEntryLocales: entryUid and contentTypeUid are required');
        return undefined;
    }

    try {
        const stack = await createManagementClient();
        const locales: Locales = await stack.contentType(contentTypeUid).entry(entryUid).locales();

        return locales || undefined;
    } catch (error) {
        console.error(
            `Failed to fetch locales for entry "${entryUid}" of type "${contentTypeUid}":`,
            error instanceof Error ? error.message : error
        );
        return undefined;
    }
});