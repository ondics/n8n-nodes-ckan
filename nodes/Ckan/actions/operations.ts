import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { ckanApiRequest } from './transport';

type Param = {
	type: 'string' | 'number' | 'boolean' | 'json';
	description?: string;
	default?: string | number | boolean;
	required?: boolean;
};

type Operation = {
	method: 'GET' | 'POST';
	params?: Record<string, Param>;
	skipHealthCheck?: boolean;
};

const ops: Record<string, Operation> = {
	package_search: {
		method: 'GET',
		params: {
			q: { type: 'string', description: 'Search query' },
			fq: { type: 'string', description: 'Filter query' },
			rows: { type: 'number', default: 10 },
			start: { type: 'number', default: 0 },
			sort: { type: 'string', description: 'Sort order' },
		},
	},
	package_show: {
		method: 'GET',
		params: {
			id: { type: 'string', required: true },
		},
	},
	resource_show: {
		method: 'GET',
		params: {
			id: { type: 'string', description: 'Resource ID', required: true },
		},
	},
	datastore_search: {
		method: 'POST',
		params: {
			resource_id: { type: 'string', description: 'Resource ID', required: true },
			q: { type: 'string', description: 'Search query' },
			filters: { type: 'json', description: 'Filters' },
			limit: { type: 'number', default: 100 },
			offset: { type: 'number', default: 0 },
		},
	},
	organization_show: {
		method: 'GET',
		params: {
			id: { type: 'string', description: 'Organization ID', required: true },
			include_datasets: { type: 'boolean', default: false },
		},
	},
	status_show: {
		method: 'GET',
		skipHealthCheck: true,
	},
};

const toTitle = (s: string) =>
	s
		.split('_')
		.map((w) => w[0].toUpperCase() + w.slice(1))
		.join(' ');

export const operationOptions = Object.keys(ops).map((k) => ({ name: toTitle(k), value: k }));

const getFieldType = (paramType: Param['type']) => paramType === 'json' ? 'json' : paramType;

const getDefaultValue = (paramType: Param['type'], defaultVal?: string | number | boolean) => {
	if (defaultVal !== undefined) return defaultVal;
	if (paramType === 'number') return 0;
	if (paramType === 'boolean') return false;
	return '';
};

export function buildNodeProperties(): INodeProperties[] {
	const props: INodeProperties[] = [];

	for (const [opName, op] of Object.entries(ops)) {
		for (const [name, param] of Object.entries(op.params ?? {})) {
			props.push({
				displayName: toTitle(name),
				name,
				type: getFieldType(param.type),
				default: getDefaultValue(param.type, param.default),
				description: param.description,
				required: param.required,
				displayOptions: { show: { operation: [opName] } },
			});
		}
	}

	return props;
}

export function buildRequest(
	ctx: IExecuteFunctions,
	opName: string,
	getParam: (name: string) => unknown,
) {
	const op = ops[opName];
	if (!op) {
		throw new NodeOperationError(ctx.getNode(), `Unknown operation: ${opName}`);
	}
	const data: IDataObject = {};

	for (const name of Object.keys(op?.params ?? {})) {
		const value = getParam(name);
		if (value !== '' && value !== null) {
			data[name] = value;
		}
	}

	return {
		method: op.method,
		endpoint: opName,
		qs: op.method === 'GET' ? data : {},
		body: op.method === 'POST' ? data : {},
	};
}

export async function healthCheck(ctx: IExecuteFunctions, opName: string, url: string) {
	if (ops[opName]?.skipHealthCheck) return;
	const res = await ckanApiRequest.call(ctx, 'GET', 'status_show', {}, {}, url);
	if (!res?.success) {
		throw new NodeOperationError(ctx.getNode(), 'CKAN not available');
	}
}
