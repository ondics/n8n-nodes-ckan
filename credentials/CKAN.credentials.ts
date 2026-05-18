import type { ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';

export class Ckan implements ICredentialType {
	name = 'ckanApi';

	displayName = 'CKAN API';

	documentationUrl =
		'https://docs.ckan.org/en/latest/maintaining/configuration.html#api-token-settings';

	properties: INodeProperties[] = [
		{
			displayName: 'CKAN URL',
			name: 'ckanUrl',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'https://demo.ckan.org',
			description: 'Base URL of your CKAN instance.',
		},
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Your CKAN API token. Generate one from your user profile page under Manage → API Tokens.',
		},
		{
			displayName: 'Authorization Header Name',
			name: 'authorizationHeaderName',
			type: 'string',
			default: 'Authorization',
			description:
				'The HTTP header used to send your API token. Defaults to "Authorization". Only change this if your CKAN instance has been configured with a custom apitoken_header_name.',
		},
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.ckanUrl.replace(/\\/+$/, "")}}',
			url: '/api/3/action/status_show',
			headers: {
				'={{$credentials.authorizationHeaderName || "Authorization"}}':
					'={{$credentials.apiToken}}',
			},
		},
	};
}
