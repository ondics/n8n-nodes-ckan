export function normalizeUrl(url: string): string {
	return url.replace(/\/+$/, '');
}
