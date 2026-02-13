import type { IDataObject, IExecuteFunctions, IHttpRequestMethods } from 'n8n-workflow';

export interface CkanResponse<T = unknown> {
	success: boolean;
	result: T;
	error?: { message: string; __type: string };
}

export async function ckanApiRequest<T = unknown>(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	ckanUrl: string,
): Promise<CkanResponse<T>> {
	const url = `${ckanUrl}/api/3/action/${endpoint}`;

	this.logger.debug(`CKAN API: ${method} ${url}`);

	return this.helpers.httpRequest({
		method,
		url,
		json: true,
		body: Object.keys(body).length ? body : undefined,
		qs: Object.keys(qs).length ? qs : undefined,
	});
}
