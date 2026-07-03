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

Read-only operations require **no** API token. Write operations require a CKAN API token set in the credentials.
See the [CKAN API docs](https://docs.ckan.org/en/latest/api/) for reference.

### Read operations (no API token required)

**Packages (Datasets)**
- **Status Show** - Check CKAN instance status
- **Package List** - List all dataset names on the instance
- **Package Search** - Search datasets with Solr query, filters, facets and sorting
- **Package Show** - Get full metadata of a dataset by ID or name
- **Package Activity List** - Activity stream for a dataset
- **Recently Changed Packages Activity List** - Site-wide activity stream of recently modified datasets

**Resources**
- **Resource Show** - Get metadata of a single resource by ID
- **Resource Search** - Search resources across all public datasets by field values

**DataStore**
- **Datastore Search** - Query rows in a DataStore resource with filters, full-text search, sorting and pagination

**Organizations**
- **Organization List** - List organization names (or full objects) on the instance
- **Organization Show** - Get full details of an organization

**Groups**
- **Group List** - List group names (or full objects) on the instance
- **Group Show** - Get full details of a group
- **Group Activity List** - Activity stream for a group
- **Group Package Show** - List datasets belonging to a group

**Users & Tags**
- **User List** - List users on the instance
- **Tag List** - List tags used by datasets, optionally filtered by vocabulary

### Write operations (API token required)

**Packages (Datasets)**
- **Package Create** - Create a new dataset
- **Package Update** - Fully replace an existing dataset
- **Package Patch** - Partially update a dataset (only provided fields change)
- **Package Delete** - Soft-delete a dataset

**Resources**
- **Resource Create** - Add a new resource to a dataset
- **Resource Update** - Fully replace an existing resource
- **Resource Patch** - Partially update a resource

**DataStore**
- **Datastore Create** - Create or replace a DataStore table with optional schema
- **Datastore Upsert** - Insert or update rows in a DataStore table

**Groups**
- **Group Create** - Create a new group
- **Group Update** - Fully replace a group
- **Group Patch** - Partially update a group
- **Group Delete** - Soft-delete a group
- **Group Purge** - Permanently delete a group (sysadmin only)
- **Group Member Create** - Add a user to a group or update their role
- **Group Member Delete** - Remove a user from a group

**Organizations**
- **Organization Create** - Create a new organization
- **Organization Update** - Fully replace an organization
- **Organization Patch** - Partially update an organization
- **Organization Delete** - Soft-delete an organization
- **Organization Purge** - Permanently delete an organization (sysadmin only)
- **Organization Member Create** - Add a user to an organization or update their role
- **Organization Member Delete** - Remove a user from an organization

## Usage
1. Just enter the CKAN URL
2. Select the CKAN API function
3. The required and optional parameters will be shown

**Heads up**: `package_search` returns paged results (max 1000 per request). `datastore_search` returns up to 32 000 rows per request. Use the `offset` parameter to paginate.

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
