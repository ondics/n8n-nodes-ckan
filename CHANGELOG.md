### Changelog

#### [1.3.0](https://github.com/ondics/n8n-nodes-ckan/compare/1.2.0...1.3.0)

> 3 July 2026

- feat: read operations for groups and users (Group Show, Group Package Show, Group Activity List, User List)
- feat: manage groups and organizations from a workflow, including create, update, patch, delete, purge, and member changes
- feat: Package Update and Resource Update to fully replace a dataset or resource
- enh: Group List now supports sorting and returning full objects instead of names
- enh: added CKAN query options on read and write operations: `order_by`, `fields`, `sort`, `distinct`, `include_*`
- fix: DataStore Search filters were ignored and returned all rows; they are now applied correctly

#### [1.2.0](https://github.com/ondics/n8n-nodes-ckan/compare/1.1.8...1.2.0)

> 18 May 2026

- feat: the CKAN URL is now configured once in the credential instead of per node
- feat: write operations now authenticate with your CKAN API token
- enh: reduced redundant status checks against the CKAN instance

#### 1.1.8

> 13 February 2026

- chore: maintenance release

#### [1.1.6](https://github.com/ondics/n8n-nodes-ckan/compare/1.1.5...1.1.6)

> 13 February 2026

- chore: resolved several packaging and npm publish issues

#### [1.1.0](https://github.com/ondics/n8n-nodes-ckan/compare/1.0.1...1.1.0)

> 13 February 2026

- feat: added Package List to retrieve all datasets, with pagination for large portals

#### [1.0.1](https://github.com/ondics/n8n-nodes-ckan/compare/1.0.0...1.0.1)

> 13 February 2026

- enh: updated the node icon

#### 1.0.0

> 13 February 2026

- feat: initial release
