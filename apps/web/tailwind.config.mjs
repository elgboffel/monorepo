import baseConfig from '@project/styles-config/tailwind.config.mjs';

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    '../../packages/ui/src/**/*.{js,jsx,ts,tsx}',
  ],
};
