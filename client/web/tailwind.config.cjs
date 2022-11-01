/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: 'jit',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'area': {
					'blue': '#3a519e',
					'purple': '#695690',
					'red': '#e02527',
					'header': '#262729',
					'button': '#6b727d'
				}
			}
		}
	},
	plugins: []
};
