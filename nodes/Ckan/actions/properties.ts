import type { INodeProperties } from 'n8n-workflow';
import { type Param, getAllOperations } from './operations';

function titleCase(s: string): string {
	return s
		.split('_')
		.map((w) => w[0].toUpperCase() + w.slice(1))
		.join(' ');
}

const typeDefaults: Record<Param['type'], string | number | boolean> = {
	string: '',
	number: 0,
	boolean: false,
	json: '',
};

function getDefaultValue(
	paramType: Param['type'],
	defaultVal?: string | number | boolean,
): string | number | boolean {
	return defaultVal !== undefined ? defaultVal : typeDefaults[paramType];
}

// Some param names need a more descriptive label in the UI.
// For example, 'method' in datastore_upsert refers to the upsert strategy,
// not an HTTP method — so we give it a clearer name.
function getParamDisplayName(opName: string, paramName: string): string {
	if (paramName === 'method' && opName === 'datastore_upsert') return 'Upsert Method';
	return titleCase(paramName);
}

function toNodeProperty(opName: string, paramName: string, param: Param): INodeProperties {
	return {
		displayName: getParamDisplayName(opName, paramName),
		name: paramName,
		type: param.type,
		default: getDefaultValue(param.type, param.default),
		description: param.description,
		required: param.required,
		displayOptions: { show: { operation: [opName] } },
	};
}

const sortedOperations = getAllOperations().sort(([a], [b]) => a.localeCompare(b));

export const operationOptions = sortedOperations.map(([key, op]) => ({
	name: titleCase(key),
	value: key,
	description: op.description,
}));

export function buildNodeProperties(): INodeProperties[] {
	return sortedOperations.flatMap(([opName, op]) =>
		Object.entries(op.params ?? {}).map(([name, param]) => toNodeProperty(opName, name, param)),
	);
}
