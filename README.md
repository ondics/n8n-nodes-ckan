# n8n-nodes-ckan

This n8n node lets you interact with the CKAN API directly in n8n workflows.

[n8n](https://n8n.io/) is a workflow automation platform.
[CKAN](https://ckan.org/) is an open-source data portal platform.

Tested with:
* **n8n** v2.7.4
* **ckan** 2.11.4

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Features

Read access to CKAN, CKAN API functions.

This is a list of the features this node offers. Read-only features require **no** API key or credentials.
Write operations require a CKAN API token (set in the credentials).
See the [CKAN API docs](https://docs.ckan.org/en/latest/api/) for reference.

- **Status Show** - Check CKAN instance status
- **Package List** - Return a list of the names of the site’s datasets (packages)
- **Package Search** - Search datasets with filters, facets, and sorting
- **Package Show** - Get details of a specific dataset by ID
- **Package Activity List** - Return the activity stream for a dataset
- **Recently Changed Packages Activity List** - Return activity stream of all recently created or updated datasets
- **Resource Show** - Get details of a specific resource by ID
- **Resource Search** - Search for resources across all public datasets by field values
- **Datastore Search** - Query data from a DataStore resource
- **Organization List** - Return a list of organization names on the CKAN instance
- **Organization Show** - Get details of an organization
- **Group List** - Return a list of group names on the CKAN instance
- **Tag List** - Return a list of tags used by datasets

Write operations (API token required):

- **Package Create** - Create a new dataset
- **Package Patch** - Partially update a dataset
- **Package Delete** - Soft-delete a dataset
- **Resource Create** - Add a new resource
- **Resource Patch** - Partially update a resource
- **Datastore Create** - Create or replace a DataStore table
- **Datastore Upsert** - Insert or update DataStore records

## Usage
1. Just enter the CKAN URL
2. Select the CKAN API function
3. The required and optional parameters will be shown

**Heads up**: package_search and datastore_search return paged results (max 1000). To get the next 1000, use the offset parameter.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [CKAN documentation](https://docs.ckan.org/)
- [CKAN API reference](https://docs.ckan.org/en/latest/api/)

## License

[MIT](LICENSE)

## Credits
Credits apply to the valuable work of:
* [n8n](https://n8n.io)
* [CKAN](https://ckan.org)

## Author

(C) 2026, Ondics GmbH, https://ondics.de/
