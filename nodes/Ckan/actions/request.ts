import {
	IDataObject,
	INodeParameters,
	NodeOperationError,
	type IExecuteFunctions,
} from 'n8n-workflow';
import type { Operation, Param } from './operations';

export type Request = {
	method: 'GET' | 'POST';
	qs: IDataObject;
	body: IDataObject;
};

function parseJsonValue(ctx: IExecuteFunctions, name: string, value: string): unknown {
	try {
		return JSON.parse(value);
	} catch (error) {
		const message = (error as Error).message || 'Invalid JSON';
		throw new NodeOperationError(ctx.getNode(), `Invalid JSON for "${name}": ${message}`);
	}
}

function shouldIncludeParam(
	params: INodeParameters,
	name: string,
	paramDef: Param,
	value: unknown,
): boolean {
	if (value === '' || value === null) return false;

	const isAtDefault = paramDef.default !== undefined && value === paramDef.default;
	if (isAtDefault) {
		return Object.prototype.hasOwnProperty.call(params, name);
	}

	return true;
}

export function buildRequest(ctx: IExecuteFunctions, op: Operation, itemIndex: number): Request {
	const data: IDataObject = {};
	const empty: IDataObject = {};

	const params = op.params ?? {};
	for (const name of Object.keys(params)) {
		const paramDef = params[name];
		const value = ctx.getNodeParameter(name, itemIndex, '');

		if (!shouldIncludeParam(ctx.getNode().parameters, name, paramDef, value)) continue;

		if (paramDef.type === 'json' && typeof value === 'string') {
			data[name] = parseJsonValue(ctx, name, value) as object;
			continue;
		}

		data[name] = value;
	}

	const qs: IDataObject = {};
	if (op.method === 'GET') {
		for (const [key, value] of Object.entries(data)) {
			qs[key] = typeof value === 'object' && value !== null ? JSON.stringify(value) : value;
		}
	}

	return {
		method: op.method,
		qs: op.method === 'GET' ? qs : empty,
		body: op.method === 'POST' ? data : empty,
	};
}
