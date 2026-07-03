export type Param = {
	type: 'string' | 'number' | 'boolean' | 'json';
	description?: string;
	default?: string | number | boolean;
	required?: boolean;
};

export type Operation = {
	method: 'GET' | 'POST';
	description?: string;
	params?: Record<string, Param>;
	skipHealthCheck?: boolean;
};

const ops: Record<string, Operation> = {
	// ─── Read: Packages ────────────────────────────────────────────────────────────

	package_search: {
		method: 'GET',
		description:
			'Search for datasets using a Solr query string. Supports filtering, sorting and pagination.',
		params: {
			q: {
				type: 'string',
				description:
					'Solr search query, e.g. "climate change" or "title:flood". Defaults to all datasets (*:*).',
			},
			fq: {
				type: 'string',
				description:
					'Solr filter query applied on top of the main query, e.g. "tags:economy" or "organization:my-org".',
			},
			rows: {
				type: 'number',
				default: 10,
				description: 'Maximum number of datasets to return (upper limit is usually 1000).',
			},
			start: {
				type: 'number',
				default: 0,
				description: 'Offset into the full result set — use together with Rows for pagination.',
			},
			sort: {
				type: 'string',
				description: 'Sort order, e.g. "metadata_modified desc" or "title asc".',
			},
		},
	},

	package_list: {
		method: 'GET',
		description: 'Return a flat list of dataset names (slugs) published on the CKAN instance.',
		params: {
			limit: {
				type: 'number',
				default: 1000,
				description: 'Maximum number of dataset names to return.',
			},
			offset: {
				type: 'number',
				default: 0,
				description: 'Number of dataset names to skip before returning results.',
			},
		},
	},

	package_show: {
		method: 'GET',
		description: 'Return the full metadata of a single dataset, including its list of resources.',
		params: {
			id: {
				type: 'string',
				required: true,
				description:
					'The unique ID or URL slug (name) of the dataset, e.g. "my-dataset" or "6b8fe4b0-…".',
			},
		},
	},

	package_activity_list: {
		method: 'GET',
		description:
			'Return the activity stream for a dataset — a chronological list of who created, updated or deleted it.',
		params: {
			id: {
				type: 'string',
				required: true,
				description: 'The unique ID or name of the dataset.',
			},
			limit: {
				type: 'number',
				default: 31,
				description: 'Maximum number of activity records to return (hard cap: 100).',
			},
			offset: {
				type: 'number',
				default: 0,
				description: 'Number of activity records to skip — use for pagination.',
			},
		},
	},

	recently_changed_packages_activity_list: {
		method: 'GET',
		description:
			'Return the activity stream of all recently created or updated datasets across the whole CKAN instance. Useful for polling workflows.',
		params: {
			limit: {
				type: 'number',
				default: 31,
				description: 'Maximum number of activity records to return (hard cap: 100).',
			},
			offset: {
				type: 'number',
				default: 0,
				description: 'Number of activity records to skip — use for pagination.',
			},
		},
	},

	// ─── Read: Resources ───────────────────────────────────────────────────────────

	resource_show: {
		method: 'GET',
		description: 'Return the metadata of a single resource (file or link) attached to a dataset.',
		params: {
			id: {
				type: 'string',
				required: true,
				description: 'The unique ID of the resource, e.g. "e179e910-…".',
			},
		},
	},

	resource_search: {
		method: 'GET',
		description:
			'Search for resources across all public datasets by matching field values. Returns a count and a list of matching resource dicts.',
		params: {
			query: {
				type: 'string',
				required: true,
				description:
					'One or more "field:term" pairs separated by spaces, e.g. "name:District format:CSV". All terms are AND-ed together.',
			},
			order_by: {
				type: 'string',
				description: 'Field to sort results by, e.g. "name" or "format".',
			},
			limit: {
				type: 'number',
				default: 20,
				description: 'Maximum number of resources to return.',
			},
			offset: {
				type: 'number',
				default: 0,
				description: 'Number of resources to skip — use for pagination.',
			},
		},
	},

	// ─── Read: DataStore ───────────────────────────────────────────────────────────

	datastore_search: {
		method: 'GET',
		description:
			'Query rows stored in the CKAN DataStore for a tabular resource. Supports full-text search, column filters and pagination.',
		params: {
			resource_id: {
				type: 'string',
				required: true,
				description: 'The unique ID of the DataStore resource to query.',
			},
			q: {
				type: 'string',
				description: 'Full-text search query applied across all text columns.',
			},
			filters: {
				type: 'json',
				description:
					'Column-level equality filters as a JSON object, e.g. {"country": "Germany", "year": 2023}.',
			},
			fields: {
				type: 'string',
				description:
					'Comma-separated list of columns to return, e.g. "id,name,value". Returns all columns if omitted.',
			},
			sort: {
				type: 'string',
				description: 'Sort order, e.g. "date desc" or "value asc". Comma-separate multiple fields.',
			},
			distinct: {
				type: 'boolean',
				default: false,
				description: 'When enabled, returns only unique rows.',
			},
			limit: {
				type: 'number',
				default: 100,
				description: 'Maximum number of rows to return (upper limit: 32000).',
			},
			offset: {
				type: 'number',
				default: 0,
				description: 'Number of rows to skip — use for pagination.',
			},
		},
	},

	// ─── Read: Organisations ───────────────────────────────────────────────────────

	organization_list: {
		method: 'GET',
		description: 'Return a list of organization names (slugs) registered on the CKAN instance.',
		params: {
			sort: {
				type: 'string',
				description: 'Sort field and direction, e.g. "title asc" or "name desc". Default: "title asc".',
			},
			limit: {
				type: 'number',
				default: 1000,
				description: 'Maximum number of organization names to return.',
			},
			offset: {
				type: 'number',
				default: 0,
				description: 'Number of organizations to skip — use for pagination.',
			},
			all_fields: {
				type: 'boolean',
				default: false,
				description: 'When enabled, returns full organization objects instead of just name strings.',
			},
			include_dataset_count: {
				type: 'boolean',
				default: true,
				description: 'When all_fields is enabled, include the number of datasets per organization.',
			},
			include_extras: {
				type: 'boolean',
				default: false,
				description: 'When all_fields is enabled, include extra fields for each organization.',
			},
			include_users: {
				type: 'boolean',
				default: false,
				description: 'When all_fields is enabled, include the list of users for each organization.',
			},
		},
	},

	organization_show: {
		method: 'GET',
		description:
			'Return the full details of a single organization, including optional dataset and member information.',
		params: {
			id: {
				type: 'string',
				required: true,
				description: 'The unique ID or name (slug) of the organization.',
			},
			include_datasets: {
				type: 'boolean',
				default: false,
				description: "When enabled, includes a truncated list (up to 10) of the organization's datasets.",
			},
			include_dataset_count: {
				type: 'boolean',
				default: true,
				description: 'Include the total number of datasets owned by this organization.',
			},
			include_extras: {
				type: 'boolean',
				default: true,
				description: 'Include extra fields attached to this organization.',
			},
			include_users: {
				type: 'boolean',
				default: false,
				description: 'Include the list of users (members) of this organization.',
			},
			include_groups: {
				type: 'boolean',
				default: true,
				description: 'Include sub-groups of this organization.',
			},
			include_followers: {
				type: 'boolean',
				default: true,
				description: 'Include the follower count for this organization.',
			},
		},
	},

	// ─── Read: Groups & Tags ──────────────────────────────────────────────────────

	group_show: {
		method: 'GET',
		description: 'Return the full details of a single group, including optional dataset and member information.',
		params: {
			id: {
				type: 'string',
				required: true,
				description: 'The unique ID or name (slug) of the group.',
			},
			include_datasets: {
				type: 'boolean',
				default: false,
				description: "When enabled, includes a truncated list of the group's datasets.",
			},
			include_dataset_count: {
				type: 'boolean',
				default: true,
				description: 'Include the total number of datasets in this group.',
			},
			include_extras: {
				type: 'boolean',
				default: true,
				description: 'Include extra fields attached to this group.',
			},
			include_users: {
				type: 'boolean',
				default: false,
				description: 'Include the list of users (members) of this group.',
			},
			include_groups: {
				type: 'boolean',
				default: true,
				description: 'Include sub-groups of this group.',
			},
			include_followers: {
				type: 'boolean',
				default: true,
				description: 'Include the follower count for this group.',
			},
		},
	},

	group_package_show: {
		method: 'GET',
		description: 'Return a list of datasets that belong to a group.',
		params: {
			id: {
				type: 'string',
				required: true,
				description: 'The unique ID or name of the group.',
			},
			limit: {
				type: 'number',
				description: 'Maximum number of datasets to return.',
			},
		},
	},

	group_activity_list: {
		method: 'GET',
		description: 'Return the activity stream for a group — a chronological list of changes made to it.',
		params: {
			id: {
				type: 'string',
				required: true,
				description: 'The unique ID or name of the group.',
			},
			limit: {
				type: 'number',
				default: 31,
				description: 'Maximum number of activity records to return (hard cap: 100).',
			},
			offset: {
				type: 'number',
				default: 0,
				description: 'Number of activity records to skip — use for pagination.',
			},
		},
	},

	group_list: {
		method: 'GET',
		description: 'Return a list of group names (slugs) on the CKAN instance.',
		params: {
			sort: {
				type: 'string',
				description: 'Sort field and direction, e.g. "title asc" or "name desc". Default: "title asc".',
			},
			limit: {
				type: 'number',
				default: 1000,
				description: 'Maximum number of group names to return.',
			},
			offset: {
				type: 'number',
				default: 0,
				description: 'Number of groups to skip — use for pagination.',
			},
			all_fields: {
				type: 'boolean',
				default: false,
				description: 'When enabled, returns full group objects instead of just name strings.',
			},
			include_dataset_count: {
				type: 'boolean',
				default: true,
				description: 'When all_fields is enabled, include the number of datasets per group.',
			},
			include_extras: {
				type: 'boolean',
				default: false,
				description: 'When all_fields is enabled, include extra fields for each group.',
			},
			include_users: {
				type: 'boolean',
				default: false,
				description: 'When all_fields is enabled, include the list of users for each group.',
			},
		},
	},

	user_list: {
		method: 'GET',
		description: 'Return a list of users registered on the CKAN instance.',
		params: {
			q: {
				type: 'string',
				description: 'Search term to filter users by name or display name.',
			},
			email: {
				type: 'string',
				description: 'Filter users by exact email address (sysadmin only).',
			},
			order_by: {
				type: 'string',
				description: 'Field to sort by, e.g. "name" or "created". Default: "name".',
			},
			all_fields: {
				type: 'boolean',
				default: true,
				description: 'When disabled, returns only user name strings instead of full objects.',
			},
		},
	},

	tag_list: {
		method: 'GET',
		description:
			'Return a list of tags used by datasets on the CKAN instance. Free tags (not in a vocabulary) are returned by default.',
		params: {
			query: {
				type: 'string',
				description: 'Filter tags to those whose names contain this string (case-insensitive).',
			},
			vocabulary_id: {
				type: 'string',
				description:
					"Return only tags belonging to this vocabulary (provide the vocabulary's ID or name).",
			},
			all_fields: {
				type: 'boolean',
				default: false,
				description:
					'When enabled, returns full tag objects (id, name, vocabulary) instead of just name strings.',
			},
		},
	},

	// ─── Status ────────────────────────────────────────────────────────────────────

	status_show: {
		method: 'GET',
		description:
			'Return basic information about the CKAN site — version, installed extensions and site title. Also used internally as a health check.',
		skipHealthCheck: true,
	},

	// ─── Write: Packages ───────────────────────────────────────────────────────────

	package_create: {
		method: 'POST',
		description:
			'Create a new dataset on the CKAN instance. Requires an API token with editor or admin rights on the target organization.',
		params: {
			name: {
				type: 'string',
				required: true,
				description:
					'URL-safe slug for the dataset — 2–100 lowercase alphanumeric characters, hyphens and underscores only, e.g. "my-new-dataset".',
			},
			title: {
				type: 'string',
				description:
					'Human-readable title displayed in the CKAN UI. Defaults to the name if omitted.',
			},
			notes: {
				type: 'string',
				description: 'Long-form description of the dataset. Markdown is supported.',
			},
			owner_org: {
				type: 'string',
				description:
					'ID or name of the owning organization. Required on most CKAN instances unless unowned datasets are permitted.',
			},
			license_id: {
				type: 'string',
				description:
					'License identifier, e.g. "cc-by", "odc-pddl". Use the license_list action to see available values.',
			},
			tags: {
				type: 'json',
				description:
					'List of tag objects to attach to the dataset, e.g. [{"name": "environment"}, {"name": "climate"}].',
			},
			private: {
				type: 'boolean',
				default: false,
				description:
					'When enabled, the dataset is only visible to members of the owning organization.',
			},
			state: {
				type: 'string',
				description: 'Dataset state: "active" (default) or "deleted".',
			},
			extras: {
				type: 'json',
				description:
					'Arbitrary key/value metadata as a JSON array, e.g. [{"key": "temporal_coverage", "value": "2020–2024"}].',
			},
		},
	},

	package_patch: {
		method: 'POST',
		description:
			'Partially update an existing dataset — only the fields you provide are changed, all others are left as-is. Safer than a full update.',
		params: {
			id: {
				type: 'string',
				required: true,
				description: 'The unique ID or name (slug) of the dataset to patch.',
			},
			title: {
				type: 'string',
				description: 'New human-readable title for the dataset.',
			},
			notes: {
				type: 'string',
				description: 'New description for the dataset. Markdown is supported.',
			},
			owner_org: {
				type: 'string',
				description: 'ID or name of the owning organization.',
			},
			license_id: {
				type: 'string',
				description: 'New license identifier, e.g. "cc-by" or "odc-pddl".',
			},
			tags: {
				type: 'json',
				description:
					'Replacement list of tag objects, e.g. [{"name": "environment"}]. This replaces the existing tag list entirely.',
			},
			private: {
				type: 'boolean',
				default: false,
				description: 'Set to true to make the dataset private, false to make it public.',
			},
			extras: {
				type: 'json',
				description:
					'Replacement extras list, e.g. [{"key": "temporal_coverage", "value": "2020–2024"}].',
			},
		},
	},

	package_update: {
		method: 'POST',
		description:
			'Fully replace an existing dataset. All fields not provided revert to their defaults — use package_patch to change only specific fields.',
		params: {
			id: {
				type: 'string',
				required: true,
				description: 'The unique ID or name (slug) of the dataset to update.',
			},
			name: {
				type: 'string',
				required: true,
				description: 'URL-safe slug for the dataset.',
			},
			title: { type: 'string', description: 'Human-readable title.' },
			notes: { type: 'string', description: 'Description. Markdown supported.' },
			owner_org: { type: 'string', description: 'ID or name of the owning organization.' },
			license_id: { type: 'string', description: 'License identifier, e.g. "cc-by".' },
			private: {
				type: 'boolean',
				default: false,
				description: 'When enabled, dataset is only visible to organization members.',
			},
			state: { type: 'string', description: 'Dataset state: "active" or "deleted".' },
			tags: {
				type: 'json',
				description: 'Tag objects, e.g. [{"name": "environment"}].',
			},
			extras: {
				type: 'json',
				description: 'Extra metadata, e.g. [{"key": "region", "value": "EU"}].',
			},
		},
	},

	package_delete: {
		method: 'POST',
		description:
			'Soft-delete a dataset — it is marked as deleted and removed from search results and listings, but can be restored by a sysadmin. This is not a permanent purge.',
		params: {
			id: {
				type: 'string',
				required: true,
				description: 'The unique ID or name (slug) of the dataset to delete.',
			},
		},
	},

	// ─── Write: Resources ──────────────────────────────────────────────────────────

	resource_create: {
		method: 'POST',
		description: 'Add a new resource (an external link or file reference) to an existing dataset.',
		params: {
			package_id: {
				type: 'string',
				required: true,
				description: 'The unique ID or name of the dataset this resource should be added to.',
			},
			url: {
				type: 'string',
				required: true,
				description: 'The URL where the resource data can be accessed.',
			},
			name: {
				type: 'string',
				description: 'Display name for the resource shown in the CKAN UI.',
			},
			description: {
				type: 'string',
				description: 'Short description of what the resource contains.',
			},
			format: {
				type: 'string',
				description: 'File format of the resource, e.g. "CSV", "JSON", "PDF", "GeoJSON".',
			},
		},
	},

	resource_patch: {
		method: 'POST',
		description:
			'Partially update the metadata of an existing resource — only the fields you provide are changed.',
		params: {
			id: {
				type: 'string',
				required: true,
				description: 'The unique ID of the resource to patch.',
			},
			name: {
				type: 'string',
				description: 'New display name for the resource.',
			},
			description: {
				type: 'string',
				description: 'New description of the resource.',
			},
			format: {
				type: 'string',
				description: 'New file format label, e.g. "CSV", "XLSX", "GeoJSON".',
			},
			url: {
				type: 'string',
				description: 'New URL for the resource.',
			},
		},
	},

	resource_update: {
		method: 'POST',
		description:
			'Fully replace an existing resource. All fields not provided revert to their defaults — use resource_patch to change only specific fields.',
		params: {
			id: {
				type: 'string',
				required: true,
				description: 'The unique ID of the resource to update.',
			},
			url: {
				type: 'string',
				required: true,
				description: 'The URL where the resource data can be accessed.',
			},
			name: { type: 'string', description: 'Display name for the resource.' },
			description: { type: 'string', description: 'Description of the resource.' },
			format: { type: 'string', description: 'File format, e.g. "CSV", "JSON", "GeoJSON".' },
			mimetype: { type: 'string', description: 'MIME type, e.g. "text/csv".' },
			size: { type: 'number', description: 'File size in bytes.' },
		},
	},

	// ─── Write: DataStore ──────────────────────────────────────────────────────────

	datastore_create: {
		method: 'POST',
		description:
			'Create a new DataStore table for a resource, optionally defining its column schema. If the resource already has a DataStore table this will replace it.',
		params: {
			resource_id: {
				type: 'string',
				required: true,
				description: 'The unique ID of the resource that will own this DataStore table.',
			},
			fields: {
				type: 'json',
				description:
					'Column definitions as a JSON array, e.g. [{"id": "date", "type": "date"}, {"id": "value", "type": "numeric"}]. If omitted, CKAN infers types from the first batch of records.',
			},
			records: {
				type: 'json',
				description:
					'Initial rows to insert, as a JSON array of objects, e.g. [{"date": "2024-01-01", "value": 42}].',
			},
			force: {
				type: 'boolean',
				default: false,
				description:
					'Set to true to allow creating a DataStore table on an active (non-draft) resource.',
			},
		},
	},

	datastore_upsert: {
		method: 'POST',
		description:
			'Insert or update rows in an existing DataStore table. The method controls conflict behaviour: "insert" errors on duplicates, "update" errors if the row does not exist, "upsert" handles both.',
		params: {
			resource_id: {
				type: 'string',
				required: true,
				description: 'The unique ID of the DataStore resource to write rows into.',
			},
			records: {
				type: 'json',
				required: true,
				description:
					'Rows to write as a JSON array of objects, e.g. [{"id": 1, "temperature": 21.3}, {"id": 2, "temperature": 19.8}].',
			},
			method: {
				type: 'string',
				default: 'upsert',
				description:
					'Conflict resolution strategy: "insert" (fail on duplicate), "update" (fail if missing) or "upsert" (insert or update automatically).',
			},
			force: {
				type: 'boolean',
				default: false,
				description: 'Set to true to allow writing to an active (non-draft) resource.',
			},
			dry_run: {
				type: 'boolean',
				default: false,
				description: 'When enabled, validates and executes the operation but rolls back — no changes are committed.',
			},
		},
	},
	// ─── Write: Groups ────────────────────────────────────────────────────────────

	group_create: {
		method: 'POST',
		description:
			'Create a new group. You must be authorized to create groups.',
		params: {
			name: {
				type: 'string',
				required: true,
				description:
					'URL-safe slug for the group — 2–100 lowercase alphanumeric characters, hyphens and underscores only.',
			},
			id: {
				type: 'string',
				description: 'The id of the group (optional).',
			},
			title: {
				type: 'string',
				description: 'Human-readable title for the group.',
			},
			description: {
				type: 'string',
				description: 'Description of the group.',
			},
			image_url: {
				type: 'string',
				description: "URL to an image displayed on the group's page.",
			},
			type: {
				type: 'string',
				description:
					"Group type (default: \"group\"). IGroupForm plugins handle custom types. Cannot be \"organization\".",
			},
			state: {
				type: 'string',
				description:
					'Current state of the group, e.g. "active" or "deleted". Defaults to "active". Ignored if you lack permission to change state.',
			},
			approval_status: {
				type: 'string',
				description: 'Approval status of the group (optional).',
			},
			extras: {
				type: 'json',
				description:
					'Arbitrary key/value metadata as a JSON array of objects with keys "key", "value", and optionally "deleted", e.g. [{"key": "region", "value": "EU"}].',
			},
			packages: {
				type: 'json',
				description:
					'Datasets belonging to the group, as a JSON array of objects with key "name" (id or slug) and optionally "title", e.g. [{"name": "my-dataset"}].',
			},
			groups: {
				type: 'json',
				description:
					'Sub-groups belonging to the group, as a JSON array of objects with key "name" and optionally "capacity", e.g. [{"name": "sub-group", "capacity": "member"}].',
			},
			users: {
				type: 'json',
				description:
					'Users belonging to the group, as a JSON array of objects with key "name" and optionally "capacity", e.g. [{"name": "john", "capacity": "admin"}].',
			},
		},
	},

	group_update: {
		method: 'POST',
		description:
			'Update a group. Replaces the entire group record — fields not provided revert to defaults. Use group_patch to change only specific fields.',
		params: {
			id: {
				type: 'string',
				required: true,
				description: 'The unique ID or name (slug) of the group to update.',
			},
			name: {
				type: 'string',
				required: true,
				description: 'URL-safe slug for the group.',
			},
			title: { type: 'string', description: 'Human-readable title for the group.' },
			description: { type: 'string', description: 'Description of the group.' },
			image_url: { type: 'string', description: "URL to an image displayed on the group's page." },
			type: {
				type: 'string',
				description: 'Group type (default: "group"). Cannot be "organization".',
			},
			state: {
				type: 'string',
				description: 'State of the group, e.g. "active" or "deleted".',
			},
			approval_status: { type: 'string', description: 'Approval status of the group.' },
			extras: {
				type: 'json',
				description: 'Arbitrary key/value metadata, e.g. [{"key": "region", "value": "EU"}].',
			},
			packages: {
				type: 'json',
				description: 'Datasets in the group, e.g. [{"name": "my-dataset"}].',
			},
			groups: {
				type: 'json',
				description: 'Sub-groups, e.g. [{"name": "sub-group", "capacity": "member"}].',
			},
			users: {
				type: 'json',
				description: 'Members, e.g. [{"name": "john", "capacity": "admin"}].',
			},
		},
	},

	group_patch: {
		method: 'POST',
		description:
			'Partially update a group — only the fields you provide are changed, all others are left as-is.',
		params: {
			id: {
				type: 'string',
				required: true,
				description: 'The unique ID or name (slug) of the group to patch.',
			},
			title: { type: 'string', description: 'New human-readable title for the group.' },
			description: { type: 'string', description: 'New description for the group.' },
			image_url: { type: 'string', description: 'New image URL for the group.' },
			type: { type: 'string', description: 'Group type. Cannot be "organization".' },
			state: { type: 'string', description: 'New state, e.g. "active" or "deleted".' },
			approval_status: { type: 'string', description: 'Approval status of the group.' },
			extras: {
				type: 'json',
				description: 'Replacement extras list, e.g. [{"key": "region", "value": "EU"}].',
			},
			packages: {
				type: 'json',
				description: 'Replacement dataset list, e.g. [{"name": "my-dataset"}].',
			},
			groups: {
				type: 'json',
				description: 'Replacement sub-group list, e.g. [{"name": "sub-group", "capacity": "member"}].',
			},
			users: {
				type: 'json',
				description: 'Replacement member list, e.g. [{"name": "john", "capacity": "admin"}].',
			},
		},
	},

	group_delete: {
		method: 'POST',
		description:
			'Soft-delete a group — it is marked as deleted and removed from listings, but can be restored by a sysadmin.',
		params: {
			id: {
				type: 'string',
				required: true,
				description: 'The unique ID or name (slug) of the group to delete.',
			},
		},
	},

	group_purge: {
		method: 'POST',
		description:
			'Permanently and irreversibly delete a group and all references to it. Requires sysadmin rights.',
		params: {
			id: {
				type: 'string',
				required: true,
				description: 'The unique ID or name (slug) of the group to purge.',
			},
		},
	},

	group_member_create: {
		method: 'POST',
		description: 'Add a user to a group with a given role, or update their role if already a member.',
		params: {
			id: {
				type: 'string',
				required: true,
				description: 'The unique ID or name of the group.',
			},
			username: {
				type: 'string',
				required: true,
				description: 'The username of the user to add.',
			},
			role: {
				type: 'string',
				required: true,
				description: 'Role to assign: "member", "editor", or "admin".',
			},
		},
	},

	group_member_delete: {
		method: 'POST',
		description: 'Remove a user from a group.',
		params: {
			id: {
				type: 'string',
				required: true,
				description: 'The unique ID or name of the group.',
			},
			user_id: {
				type: 'string',
				required: true,
				description: 'The ID or name of the user to remove.',
			},
		},
	},

	// ─── Write: Organisations ──────────────────────────────────────────────────

	organization_create: {
		method: 'POST',
		description: 'Create a new organization. Requires authorization to create organizations.',
		params: {
			name: {
				type: 'string',
				required: true,
				description:
					'URL-safe slug for the organization — 2–100 lowercase alphanumeric characters, hyphens and underscores only.',
			},
			id: { type: 'string', description: 'The id of the organization (optional).' },
			title: { type: 'string', description: 'Human-readable title for the organization.' },
			description: { type: 'string', description: 'Description of the organization.' },
			image_url: {
				type: 'string',
				description: "URL to an image displayed on the organization's page.",
			},
			state: {
				type: 'string',
				description: 'State of the organization, e.g. "active" or "deleted". Defaults to "active".',
			},
			approval_status: {
				type: 'string',
				description: 'Approval status of the organization.',
			},
			extras: {
				type: 'json',
				description: 'Arbitrary key/value metadata, e.g. [{"key": "region", "value": "EU"}].',
			},
			packages: {
				type: 'json',
				description: 'Datasets belonging to the organization, e.g. [{"name": "my-dataset"}].',
			},
			users: {
				type: 'json',
				description: 'Members, e.g. [{"name": "john", "capacity": "admin"}].',
			},
		},
	},

	organization_update: {
		method: 'POST',
		description:
			'Update an organization. Replaces the entire record — fields not provided revert to defaults. Use organization_patch to change only specific fields.',
		params: {
			id: {
				type: 'string',
				required: true,
				description: 'The unique ID or name (slug) of the organization to update.',
			},
			name: {
				type: 'string',
				required: true,
				description: 'URL-safe slug for the organization.',
			},
			title: { type: 'string', description: 'Human-readable title.' },
			description: { type: 'string', description: 'Description of the organization.' },
			image_url: { type: 'string', description: 'Image URL.' },
			state: { type: 'string', description: 'State, e.g. "active" or "deleted".' },
			approval_status: { type: 'string', description: 'Approval status.' },
			extras: {
				type: 'json',
				description: 'Arbitrary key/value metadata, e.g. [{"key": "region", "value": "EU"}].',
			},
			packages: {
				type: 'json',
				description: 'Datasets, e.g. [{"name": "my-dataset"}].',
			},
			users: {
				type: 'json',
				description: 'Members, e.g. [{"name": "john", "capacity": "admin"}].',
			},
		},
	},

	organization_patch: {
		method: 'POST',
		description:
			'Partially update an organization — only the fields you provide are changed, all others are left as-is.',
		params: {
			id: {
				type: 'string',
				required: true,
				description: 'The unique ID or name (slug) of the organization to patch.',
			},
			title: { type: 'string', description: 'New human-readable title.' },
			description: { type: 'string', description: 'New description.' },
			image_url: { type: 'string', description: 'New image URL.' },
			state: { type: 'string', description: 'New state, e.g. "active" or "deleted".' },
			extras: {
				type: 'json',
				description: 'Replacement extras list, e.g. [{"key": "region", "value": "EU"}].',
			},
			packages: {
				type: 'json',
				description: 'Replacement dataset list, e.g. [{"name": "my-dataset"}].',
			},
			users: {
				type: 'json',
				description: 'Replacement member list, e.g. [{"name": "john", "capacity": "admin"}].',
			},
		},
	},

	organization_delete: {
		method: 'POST',
		description:
			'Soft-delete an organization — marked as deleted and removed from listings, but can be restored by a sysadmin.',
		params: {
			id: {
				type: 'string',
				required: true,
				description: 'The unique ID or name (slug) of the organization to delete.',
			},
		},
	},

	organization_purge: {
		method: 'POST',
		description:
			'Permanently and irreversibly delete an organization and all references to it. Requires sysadmin rights.',
		params: {
			id: {
				type: 'string',
				required: true,
				description: 'The unique ID or name (slug) of the organization to purge.',
			},
		},
	},

	organization_member_create: {
		method: 'POST',
		description:
			'Add a user to an organization with a given role, or update their role if already a member.',
		params: {
			id: {
				type: 'string',
				required: true,
				description: 'The unique ID or name of the organization.',
			},
			username: {
				type: 'string',
				required: true,
				description: 'The username of the user to add.',
			},
			role: {
				type: 'string',
				required: true,
				description: 'Role to assign: "member", "editor", or "admin".',
			},
		},
	},

	organization_member_delete: {
		method: 'POST',
		description: 'Remove a user from an organization.',
		params: {
			id: {
				type: 'string',
				required: true,
				description: 'The unique ID or name of the organization.',
			},
			user_id: {
				type: 'string',
				required: true,
				description: 'The ID or name of the user to remove.',
			},
		},
	},
};

export function getOperation(key: string): Operation | undefined {
	return ops[key];
}

export function getAllOperations(): Array<[string, Operation]> {
	return Object.entries(ops);
}
