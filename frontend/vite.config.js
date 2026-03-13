/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   vite.config.js                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/20 09:18:33 by eric              #+#    #+#             */
/*   Updated: 2026/03/13 11:16:19 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // Plante proprement si le port est pris, au lieu de chercher un autre
  },
})
