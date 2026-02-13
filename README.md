# n8n-nodes-ckan

This node lets you interact with the CKAN API directly in n8n workflows.

[n8n](https://n8n.io/) is a workflow automation platform.
[CKAN](https://ckan.org/) is an open-source data portal platform.

Tested with:
* **n8n** v1.x.x
* **ckan** 2.11.x

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Features

Read access to CKAN, CKAN API functions.

This is a list of the features this node offers. All features require **no** API key or credentials.
See the [CKAN API docs](https://docs.ckan.org/en/latest/api/) for reference.

- **Package Search** - Search datasets with filters, facets, and sorting
- **Package Show** - Get details of a specific dataset by ID
- **Resource Show** - Get details of a specific resource by ID
- **Datastore Search** - Query data from a DataStore resource
- **Organization Show** - Get details of an organization
- **Status Show** - Check CKAN instance status

## Usage
1. Just enter the CKAN URL
2. Select the CKAN API function
3. The required and optional parameters will be shown
4. Heads up: package_search and datastore_search return paged results (max 1000). To get the next 1000, use the offset parameter.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [CKAN documentation](https://docs.ckan.org/)
- [CKAN API reference](https://docs.ckan.org/en/latest/api/)

## License

[MIT](LICENSE)

## Credits
Credits apply to the valuable work of:
* n8n
* CKAN

## Author

(C) 2026, Ondics GmbH, https://ondics.de/
