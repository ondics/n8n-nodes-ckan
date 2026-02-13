import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';
import { ckanNodeProperties } from './CkanProperties';
import { buildRequest, healthCheck, ckanApiRequest, normalizeUrl } from './actions';

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
		credentials: [],
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
				placeholder: 'https://ckan.example.com',
			},
			...ckanNodeProperties,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const ckanUrl = this.getNodeParameter('ckanUrl', i) as string;
				const normalizedCkanUrl = normalizeUrl(ckanUrl);

				await healthCheck(this, operation, normalizedCkanUrl);

				const getParam = (name: string) => this.getNodeParameter(name, i, '');
				const req = buildRequest(this, operation, getParam);

				const response = await ckanApiRequest.call(
					this,
					req.method,
					req.endpoint,
					req.body,
					req.qs,
					normalizedCkanUrl,
				);
				if (!response?.success) {
					throw new NodeOperationError(
						this.getNode(),
						response?.error?.message ?? 'CKAN request failed',
					);
				}
				returnData.push({
					json: { success: true, data: response.result as object },
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
