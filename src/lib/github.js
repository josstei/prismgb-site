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
 * Fallback version used when GitHub API is unavailable or rate-limited.
 */
const FALLBACK_VERSION = '1.0.0';

/**
 * Generates platform download info from a version string.
 */
function buildPlatformData(version) {
  const baseUrl = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/download/v${version}`;
  return [
    {
      name: 'windows',
      icon: 'windows',
      label: 'Windows',
      filename: `PrismGB-Setup-${version}.exe`,
      downloadUrl: `${baseUrl}/PrismGB-Setup-${version}.exe`,
    },
    {
      name: 'macos-arm64',
      icon: 'apple',
      label: 'macOS (Apple Silicon)',
      subtitle: 'M1/M2/M3/M4',
      filename: `PrismGB-${version}-mac-arm64.dmg`,
      downloadUrl: `${baseUrl}/PrismGB-${version}-mac-arm64.dmg`,
    },
    {
      name: 'macos-x64',
      icon: 'apple',
      label: 'macOS (Intel)',
      subtitle: 'Intel Macs',
      filename: `PrismGB-${version}-mac-x64.dmg`,
      downloadUrl: `${baseUrl}/PrismGB-${version}-mac-x64.dmg`,
    },
    {
      name: 'linux',
      icon: 'linux-download',
      label: 'Linux',
      filename: `PrismGB-${version}-x86_64.AppImage`,
      downloadUrl: `${baseUrl}/PrismGB-${version}-x86_64.AppImage`,
    },
  ];
}

/**
 * Fallback data used when GitHub API is unavailable or rate-limited.
 */
const FALLBACK_DATA = {
  version: FALLBACK_VERSION,
  releasesUrl: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases`,
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

    const platforms = [
      {
        name: 'windows',
        icon: 'windows',
        label: 'Windows',
        ...getAssetInfo(assets, 'windows'),
      },
      {
        name: 'macos-arm64',
        icon: 'apple',
        label: 'macOS (Apple Silicon)',
        subtitle: 'M1/M2/M3/M4',
        ...getAssetInfo(assets, 'macos-arm64'),
      },
      {
        name: 'macos-x64',
        icon: 'apple',
        label: 'macOS (Intel)',
        subtitle: 'Intel Macs',
        ...getAssetInfo(assets, 'macos-x64'),
      },
      {
        name: 'linux',
        icon: 'linux-download',
        label: 'Linux',
        ...getAssetInfo(assets, 'linux'),
      },
    ];

    return {
      version,
      releasesUrl: release.html_url,
      publishedAt: release.published_at,
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
      size: asset.size,
    };
  }

  // Return empty values if asset not found
  return {
    filename: null,
    downloadUrl: null,
  };
}

export const GITHUB_REPO_URL = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`;
export const GITHUB_ISSUES_URL = `${GITHUB_REPO_URL}/issues`;
