import {normalize} from './src/Utils/TextUtils';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js, ts, tsx, jsx}'],
  theme: {
    fontFamily: {
      regular: ['AktivGrotesk-Regular', 'sans-serif'],
      bold: ['AktivGrotesk-Bold', 'sans-serif'],
      light: ['AktivGrotesk-Light', 'sans-serif'],
    },
    extend: {
      fontSize: {
        description: normalize(8).toString(),
        h4: normalize(10).toString(),
        h3: normalize(12).toString(),
        h2: normalize(14).toString(),
        h1: normalize(20).toString(),
        title: normalize(25).toString(),
      },
    },
  },
};
