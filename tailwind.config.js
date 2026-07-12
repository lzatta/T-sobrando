/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#2F6F4F',
        background: '#FFFFFF',
        'background-dark': '#111714',
        surface: '#F4F6F5',
        'surface-dark': '#1B211D',
        border: '#E1E5E3',
        'border-dark': '#2B332E',
        'text-primary': '#14231C',
        'text-primary-dark': '#F2F5F3',
        'text-secondary': '#5B6B63',
        'text-secondary-dark': '#9AA6A0',
        success: '#2F6F4F',
        error: '#B3261E',
      },
      borderRadius: {
        DEFAULT: '8px',
      },
      spacing: {
        4: '4px',
        8: '8px',
        12: '12px',
        16: '16px',
        24: '24px',
        32: '32px',
      },
    },
  },
  plugins: [],
}
