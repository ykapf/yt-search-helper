import type { ManifestV3Export } from "@crxjs/vite-plugin";

const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: "Search Flow Assistant",
  description:
    "Keeps YouTube search routes stable and redirects noisy search surfaces to clean results.",
  version: "1.0.0",
  permissions: ["storage"],
  host_permissions: ["https://www.youtube.com/*", "https://m.youtube.com/*"],
  background: {
    service_worker: "src/worker/main.ts",
    type: "module",
  },
  action: {
    default_title: "Search Flow Assistant",
    default_popup: "popup.html",
  },
  options_page: "options.html",
  content_scripts: [
    {
      matches: ["https://www.youtube.com/*", "https://m.youtube.com/*"],
      js: ["src/inject/main.ts"],
      run_at: "document_start",
    },
  ],
  browser_specific_settings: {
    safari: {
      strict_min_version: "16.4",
    },
    gecko: {
      id: "search-flow-assistant@example.org",
    },
  },
};

export default manifest;
