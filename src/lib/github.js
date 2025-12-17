/**
 * Fetches the latest release data from GitHub API during build time.
 * This runs at build time in Astro, not in the browser.
 */

const GITHUB_OWNER = 'josstei';
const GITHUB_REPO = 'prismgb-app';
const GITHUB_API = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;

/**
 * Platform-specific asset filename patterns.
 * These match the electron-builder artifactName configurations.
 */
const ASSET_PATTERNS = {
  windows: /PrismGB-Setup-[\d.]+\.exe$/,
  'macos-arm64': /PrismGB-[\d.]+-mac-arm64\.dmg$/,
  'macos-x64': /PrismGB-[\d.]+-mac-x64\.dmg$/,
  linux: /PrismGB-[\d.]+-x86_64\.AppImage$/,
};

/**
 * Platform metadata - single source of truth for platform display info.
 */
const PLATFORM_METADATA = [
  { name: 'windows', icon: 'windows', label: 'Windows' },
  { name: 'macos-arm64', icon: 'apple', label: 'macOS (Apple Silicon)', subtitle: 'M1/M2/M3/M4' },
  { name: 'macos-x64', icon: 'apple', label: 'macOS (Intel)', subtitle: 'Intel Macs' },
  { name: 'linux', icon: 'linux-download', label: 'Linux' },
];

/**
 * Fallback version used when GitHub API is unavailable or rate-limited.
 */
const FALLBACK_VERSION = '1.0.0';

/**
 * Generates platform download info from a version string.
 */
function buildPlatformData(version) {
  const baseUrl = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/download/v${version}`;

  const filenamePatterns = {
    windows: `PrismGB-Setup-${version}.exe`,
    'macos-arm64': `PrismGB-${version}-mac-arm64.dmg`,
    'macos-x64': `PrismGB-${version}-mac-x64.dmg`,
    linux: `PrismGB-${version}-x86_64.AppImage`,
  };

  return PLATFORM_METADATA.map((platform) => ({
    ...platform,
    filename: filenamePatterns[platform.name],
    downloadUrl: `${baseUrl}/${filenamePatterns[platform.name]}`,
  }));
}

/**
 * Fallback data used when GitHub API is unavailable or rate-limited.
 */
const FALLBACK_DATA = {
  version: FALLBACK_VERSION,
  platforms: buildPlatformData(FALLBACK_VERSION),
};

/**
 * Finds a release asset matching the given platform pattern.
 */
function findAsset(assets, pattern) {
  return assets.find((asset) => pattern.test(asset.name));
}

/**
 * Fetches the latest release data from GitHub.
 * Returns formatted data for use in the Download component.
 */
export async function getLatestRelease() {
  try {
    const response = await fetch(GITHUB_API, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'PrismGB-Site',
      },
    });

    if (!response.ok) {
      console.warn(`GitHub API returned ${response.status}, using fallback data`);
      return FALLBACK_DATA;
    }

    const release = await response.json();
    const version = release.tag_name.replace(/^v/, '');
    const assets = release.assets || [];

    const platforms = PLATFORM_METADATA.map((platform) => ({
      ...platform,
      ...getAssetInfo(assets, platform.name),
    }));

    return {
      version,
      platforms,
    };
  } catch (error) {
    console.warn('Failed to fetch GitHub release:', error.message);
    return FALLBACK_DATA;
  }
}

/**
 * Gets asset info for a specific platform.
 */
function getAssetInfo(assets, platform) {
  const pattern = ASSET_PATTERNS[platform];
  const asset = findAsset(assets, pattern);

  if (asset) {
    return {
      filename: asset.name,
      downloadUrl: asset.browser_download_url,
    };
  }

  return {
    filename: null,
    downloadUrl: null,
  };
}

export const GITHUB_REPO_URL = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`;
