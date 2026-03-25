/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tailwind.config.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/19 17:08:43 by eric              #+#    #+#             */
/*   Updated: 2026/03/25 13:59:19 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Active le dark mode avec la classe 'dark'
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // Support RTL avec Tailwind
    function({ addUtilities }) {
      addUtilities({
        '.rtl-mr': {
          '[dir=rtl] &': {
            marginRight: 'auto',
            marginLeft: 'calc(var(--tw-space-x) * var(--tw-space-reverse, -1))',
          },
        },
        '.rtl-ml': {
          '[dir=rtl] &': {
            marginLeft: 'auto',
            marginRight: 'calc(var(--tw-space-x) * var(--tw-space-reverse, -1))',
          },
        },
        '.ltr\\:flex-row-reverse': {
          '[dir=ltr] &': {
            flexDirection: 'row',
          },
          '[dir=rtl] &': {
            flexDirection: 'row-reverse',
          },
        },
      });
    },
  ],
}
