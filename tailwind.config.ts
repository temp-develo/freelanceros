import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			'base-black': '#100f0f',
  			'base-950': '#1c1b1a',
  			'base-900': '#282726',
  			'base-850': '#343331',
  			'base-800': '#403e3c',
  			'base-700': '#575653',
  			'base-600': '#6f6e69',
  			'base-500': '#878580',
  			'base-300': '#b7b5ac',
  			'base-200': '#cecdc3',
  			'base-150': '#dad8ce',
  			'base-100': '#e6e4d9',
  			'base-50': '#f2f0e5',
  			'base-paper': '#fffcf0',
  			red: {
  				DEFAULT: '#af3029',
  				light: '#d14d41'
  			},
  			orange: {
  				DEFAULT: '#bc5215',
  				light: '#da702c'
  			},
  			yellow: {
  				DEFAULT: '#ad8301',
  				light: '#d0a215'
  			},
  			green: {
  				DEFAULT: '#66800b',
  				light: '#879a39'
  			},
  			cyan: {
  				DEFAULT: '#24837b',
  				light: '#3aa99f'
  			},
  			blue: {
  				DEFAULT: '#205ea6',
  				light: '#4385be'
  			},
  			purple: {
  				DEFAULT: '#5e409d',
  				light: '#8b7ec8'
  			},
  			magenta: {
  				DEFAULT: '#a02f6f',
  				light: '#ce5d97'
  			},
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			card: {
  				DEFAULT: 'var(--card)',
  				foreground: 'var(--card-foreground)'
  			},
  			popover: {
  				DEFAULT: 'var(--popover)',
  				foreground: 'var(--popover-foreground)'
  			},
  			primary: {
  				DEFAULT: 'var(--primary)',
  				foreground: 'var(--primary-foreground)'
  			},
  			secondary: {
  				DEFAULT: 'var(--secondary)',
  				foreground: 'var(--secondary-foreground)'
  			},
  			muted: {
  				DEFAULT: 'var(--muted)',
  				foreground: 'var(--muted-foreground)'
  			},
  			accent: {
  				DEFAULT: 'var(--accent)',
  				foreground: 'var(--accent-foreground)'
  			},
  			destructive: {
  				DEFAULT: 'var(--destructive)',
  				foreground: 'var(--destructive-foreground)'
  			},
  			border: 'var(--border)',
  			input: 'var(--input)',
  			ring: 'var(--ring)',
  			chart: {
  				'1': 'var(--chart-1)',
  				'2': 'var(--chart-2)',
  				'3': 'var(--chart-3)',
  				'4': 'var(--chart-4)',
  				'5': 'var(--chart-5)'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;