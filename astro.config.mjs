import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypePrettyCode from "rehype-pretty-code";

const prettyCodeOptions = {
	theme: "nord",
	// Callbacks to customize the output of the nodes
	onVisitLine(node) {
		// Prevent lines from collapsing in `display: grid` mode, and
		// allow empty lines to be copy/pasted
		if (node.children.length === 0) {
			node.children = [{type: 'text', value: ' '}];
		}
	},
	onVisitHighlightedLine(node) {
		// Adding a class to the highlighted line
		node.properties.className.push('highlighted');
	},
};

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.knolyx.com',
	markdown: {
		extendDefaultPlugins: true,
		syntaxHighlight: false,
		rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
	},
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
						// { label: 'SSO', link: '/guides/sso/' },
						{ label: 'Webhooks', link: '/guides/webhooks/' },
						// { label: 'Course API', link: '/guides/course/' },
						// { label: 'Rules API', link: '/guides/rules/' },
						// { label: 'Theming API', link: '/guides/theme/' },
						// { label: 'Payment Integration', link: '/guides/payment-integration' }
					],
				},
			],
		}),
	],
});
