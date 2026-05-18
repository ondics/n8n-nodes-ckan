import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
	NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';
import { getOperation } from './actions/operations';
import { buildNodeProperties, operationOptions } from './actions/properties';
import { buildRequest } from './actions/request';
import { ckanApiRequest, healthCheck } from './actions/transport';

const trimUrl = (url: string) => url.replace(/\/+$/, '');

type CkanCredentials = {
	authToken?: string;
	authHeaderName: string;
};

const CREDENTIALS_NOT_FOUND = ['not found', 'No credentials found'];

async function loadCredentials(ctx: IExecuteFunctions): Promise<CkanCredentials> {
	try {
		const creds = (await ctx.getCredentials('ckanApi')) as {
			apiToken?: string;
			authorizationHeaderName?: string;
		};
		return {
			authToken: creds.apiToken,
			authHeaderName: creds.authorizationHeaderName || 'Authorization',
		};
	} catch (error) {
		const message = (error as Error).message || '';
		const isMissingCredentials = CREDENTIALS_NOT_FOUND.some((s) => message.includes(s));
		if (!isMissingCredentials) throw error;
		return { authToken: undefined, authHeaderName: 'Authorization' };
	}
}

export class Ckan implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CKAN',
		name: 'ckan',
		icon: { light: 'file:ckan.svg', dark: 'file:ckan.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with the CKAN API',
		defaults: { name: 'CKAN' },
		credentials: [
			{
				name: 'ckanApi',
				required: false,
			},
		],
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		outputNames: ['CKAN Response'],
		properties: [
			{
				displayName: 'CKAN URL',
				name: 'ckanUrl',
				type: 'string',
				validateType: 'url',
				required: true,
				default: '',
				placeholder: 'https://demo.ckan.org',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: operationOptions,
				default: 'package_search',
			},
			...buildNodeProperties(),
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const opKey = this.getNodeParameter('operation', 0) as string;
		const operation = getOperation(opKey);
		if (!operation) throw new NodeOperationError(this.getNode(), `Unknown operation: ${opKey}`);

		const ckanUrls = items.map((_data, index) =>
			trimUrl(this.getNodeParameter('ckanUrl', index) as string),
		);

		const {
			authToken,
			authHeaderName,
		}: CkanCredentials =
			operation.method === 'POST'
				? await loadCredentials(this)
				: { authToken: undefined, authHeaderName: 'Authorization' };

		if (operation.method === 'POST' && !authToken) {
			throw new NodeOperationError(
				this.getNode(),
				'This operation requires CKAN credentials (API token).',
			);
		}

		const checkedUrls = new Set<string>();

		for (let i = 0; i < items.length; i++) {
			try {
				if (!checkedUrls.has(ckanUrls[i])) {
					await healthCheck(this, operation, ckanUrls[i]);
					checkedUrls.add(ckanUrls[i]);
				}

				const req = buildRequest(this, operation, i);

				const response = await ckanApiRequest(
					this,
					req.method,
					opKey,
					ckanUrls[i],
					req.body,
					req.qs,
					authToken,
					authHeaderName,
				);

				if (!response.success) {
					throw new NodeOperationError(
						this.getNode(),
						response.error?.message ?? 'CKAN request failed',
					);
				}

				returnData.push({
					json: { success: true, data: response.result as IDataObject },
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error instanceof Error ? error.message : String(error) },
						pairedItem: { item: i },
					});
					continue;
				}
				if (error instanceof NodeApiError || error instanceof NodeOperationError) {
					throw error;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject);
			}
		}

		return [returnData];
	}
}
