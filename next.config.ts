import type { NextConfig } from "next";
import createMDX from '@next/mdx';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Increase timeout for static page generation (default is 60s)
  // With 1800+ pages, need extra time even with caching
  staticPageGenerationTimeout: 300, // 5 minutes
};

const withMDX = createMDX({
  // Add markdown plugins here if needed later
});

export default withSentryConfig(withMDX(nextConfig), {
  // Sentry organization and project (from env vars)
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Suppress Sentry CLI output during builds
  silent: true,

  // Hide source maps from the client bundle
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },

  // Disable telemetry
  telemetry: false,
});
