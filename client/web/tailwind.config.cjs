/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: 'jit',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: [
		'bg-red-500',
		'bg-green-500',
		'bg-orange-500',
		'text-red-500',
		'text-green-500',
		'text-orange-500',
	],
	theme: {
		extend: {
			colors: {
				'area': {
					'blue': '#3a519e',
					'purple': '#695690',
					'red': '#e02527',
					'header': '#262729',
					'button': '#6b727d',
					'blue2': '#4B67C6',
					'purple2': '#4B67C6',
					'red2': '#FF3F41',
					'spotify': '#2ebd59'
				},
				'ui-blue': 'rgb(26,115,232)',
			},
			fontFamily: {
			    area: ['Product Sans Regular', 'sans-serif'],
			}
		}
	},
	plugins: []
};
