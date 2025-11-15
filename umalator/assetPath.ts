let cachedPrefix: string | null = null;

function getAssetPrefix(): string {
	if (cachedPrefix != null) {
		return cachedPrefix;
	}
	if (typeof window === 'undefined') {
		// When running in a build step fall back to the legacy root so assetPath
		// still returns usable strings in generated bundles.
		cachedPrefix = '/uma-tools';
		return cachedPrefix;
	}

	const marker = '/umalator-global';
	const path = window.location.pathname;
	const idx = path.indexOf(marker);
	if (idx === -1) {
		cachedPrefix = '';
	} else {
		cachedPrefix = path.slice(0, idx);
	}

	// Normalise away trailing slashes to avoid double separators when concatenating.
	cachedPrefix = cachedPrefix.replace(/\/+$/, '');
	return cachedPrefix;
}

const LEGACY_PREFIX = '/uma-tools';

export function assetPath(path: string): string {
	if (!path) return path;
	if (path.startsWith(LEGACY_PREFIX)) {
		const prefix = getAssetPrefix();
		const remainder = path.slice(LEGACY_PREFIX.length);
		return `${prefix}${remainder || ''}` || remainder || path;
	}
	return path;
}

