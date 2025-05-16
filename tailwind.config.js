/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
const animatePlugin = require('tailwindcss-animate');

module.exports = {
    content: ['./resources/js/**/*.{js,jsx,ts,tsx}', './resources/css/**/*.css', './resources/views/**/*.blade.php'],
    theme: {
        extend: {
            keyframes: {
                'fade-in': {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
                'fade-out': {
                    '0%': { opacity: 1 },
                    '100%': { opacity: 0 },
                },
                'zoom-in': {
                    '0%': { opacity: 0, transform: 'scale(0.95)' },
                    '100%': { opacity: 1, transform: 'scale(1)' },
                },
                'zoom-out': {
                    '0%': { opacity: 1, transform: 'scale(1)' },
                    '100%': { opacity: 0, transform: 'scale(0.95)' },
                },
                'slide-in-from-top': {
                    '0%': { opacity: 0, transform: 'translateY(-10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                'slide-in-from-bottom': {
                    '0%': { opacity: 0, transform: 'translateY(10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                'slide-in-from-left': {
                    '0%': { opacity: 0, transform: 'translateX(-10px)' },
                    '100%': { opacity: 1, transform: 'translateX(0)' },
                },
                'slide-in-from-right': {
                    '0%': { opacity: 0, transform: 'translateX(10px)' },
                    '100%': { opacity: 1, transform: 'translateX(0)' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.3s ease-out forwards',
                'fade-out': 'fade-out 0.2s ease-in forwards',
                'zoom-in': 'zoom-in 0.3s ease-out forwards',
                'zoom-out': 'zoom-out 0.2s ease-in forwards',
                'slide-in-from-top': 'slide-in-from-top 0.3s ease-out forwards',
                'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out forwards',
                'slide-in-from-left': 'slide-in-from-left 0.3s ease-out forwards',
                'slide-in-from-right': 'slide-in-from-right 0.3s ease-out forwards',
            },
        },
    },
    plugins: [animatePlugin],
};
