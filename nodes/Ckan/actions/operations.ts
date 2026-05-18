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
			limit: {
				type: 'number',
				default: 100,
				description: 'Maximum number of rows to return.',
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
				description:
					'When enabled, returns full organization objects instead of just name strings.',
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
				description:
					"When enabled, includes a truncated list (up to 10) of the organization's datasets in the response.",
			},
		},
	},

	// ─── Read: Groups & Tags ──────────────────────────────────────────────────────

	group_list: {
		method: 'GET',
		description: 'Return a list of group names (slugs) on the CKAN instance.',
		params: {
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
		},
	}, 
};

export function getOperation(key: string): Operation | undefined {
	return ops[key];
}

export function getAllOperations(): Array<[string, Operation]> {
	return Object.entries(ops);
}
