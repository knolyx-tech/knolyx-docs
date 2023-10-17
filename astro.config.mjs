import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.knolyx.com',
	integrations: [
		starlight({
			title: 'Knolyx Docs',
			favicon: 'favicon.png',
			logo: {
				light: './src/assets/logo-short.png',
				dark: './src/assets/logo-short.png'
			},
			customCss: [
				// Relative path to your custom CSS file
				'./src/styles/custom.css',
			],
			sidebar: [
				{
					label: 'Guides',
					items: [
						{ label: 'Getting Started', link: '/guides/getting-started/' },
						{ label: 'SSO', link: '/guides/sso/' },
						{ label: 'Course API', link: '/guides/course/' },
						{ label: 'Rules API', link: '/guides/rules/' },
						{ label: 'Theming API', link: '/guides/theme/' },
						{ label: 'Payment Integration', link: '/guides/payment-integration' }
					],
				},
			],
		}),
	],
});
