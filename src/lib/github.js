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
  macos: /PrismGB-[\d.]+-mac\.dmg$/,
  linux: /PrismGB-[\d.]+-x86_64\.AppImage$/,
};

/**
 * Fallback data used when GitHub API is unavailable or rate-limited.
 */
const FALLBACK_DATA = {
  version: '1.1.2',
  releasesUrl: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases`,
  platforms: [
    {
      name: 'windows',
      icon: 'windows',
      label: 'Windows',
      filename: 'PrismGB-Setup-1.1.2.exe',
      downloadUrl: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/download/v1.1.2/PrismGB-Setup-1.1.2.exe`,
    },
    {
      name: 'macos',
      icon: 'apple',
      label: 'macOS',
      filename: 'PrismGB-1.1.2-mac.dmg',
      downloadUrl: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/download/v1.1.2/PrismGB-1.1.2-mac.dmg`,
    },
    {
      name: 'linux',
      icon: 'linux-download',
      label: 'Linux',
      filename: 'PrismGB-1.1.2-x86_64.AppImage',
      downloadUrl: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/releases/download/v1.1.2/PrismGB-1.1.2-x86_64.AppImage`,
    },
  ],
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
        name: 'macos',
        icon: 'apple',
        label: 'macOS',
        ...getAssetInfo(assets, 'macos'),
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
