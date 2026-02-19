/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tailwind.config.js                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/19 17:08:43 by eric              #+#    #+#             */
/*   Updated: 2026/02/19 17:08:49 by eric             ###   ########.fr       */
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
  plugins: [],
}
