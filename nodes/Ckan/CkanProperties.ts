import type { INodeProperties } from 'n8n-workflow';
import { buildNodeProperties, operationOptions } from './actions';

export const ckanNodeProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: operationOptions,
		default: 'package_search',
	},
	...buildNodeProperties(),
];
