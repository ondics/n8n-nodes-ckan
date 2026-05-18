import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import type { Operation } from './operations';

export interface CkanResponse {
	success: boolean;
	result: unknown;
	error?: { message: string; __type: string };
}

const omitIfEmpty = (o: IDataObject) => (Object.keys(o).length ? o : undefined);

export async function ckanApiRequest(
	ctx: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	ckanUrl: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	authToken?: string,
	authHeaderName = 'Authorization',
): Promise<CkanResponse> {
	const url = `${ckanUrl}/api/3/action/${endpoint}`;

	ctx.logger.debug(`CKAN API: ${method} ${url}`);
	try {
		const headers: IDataObject = {
			'Content-Type': 'application/json',
		};

		if (authToken) {
			headers[authHeaderName] = authToken;
		}

		const options: IHttpRequestOptions = {
			method,
			url,
			qs,
			body: omitIfEmpty(body),
			headers,
		};

		return (await ctx.helpers.httpRequest(options)) as CkanResponse;
	} catch (error) {
		ctx.logger.error(`CKAN API request failed: ${(error as Error).message}`);

		throw new NodeApiError(ctx.getNode(), error as JsonObject);
	}
}

export async function healthCheck(ctx: IExecuteFunctions, op: Operation, url: string): Promise<void> {
	if (op.skipHealthCheck) return;
	const res = await ckanApiRequest(ctx, 'GET', 'status_show', url);
	if (!res.success) {
		throw new NodeApiError(
			ctx.getNode(),
			res.error ?? {
				message: 'CKAN instance is not reachable or returned an error on status_show.',
				__type: 'Transport Error',
			},
		);
	}
}
