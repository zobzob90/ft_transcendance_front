/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   i18n.js                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: eric <eric@student.42.fr>                  +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026/02/19 17:16:27 by eric              #+#    #+#             */
/*   Updated: 2026/02/19 17:46:33 by eric             ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import des fichiers de traduction
import fr from '../locales/fr.json';
import en from '../locales/en.json';
import de from '../locales/de.json';
import es from '../locales/es.json';
import pt from '../locales/pt.json';
import ar from '../locales/ar.json';

// Langues RTL (Right-To-Left)
const rtlLanguages = ['ar', 'he'];

// Configuration i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      de: { translation: de },
      es: { translation: es },
      pt: { translation: pt },
      ar: { translation: ar }
    },
    lng: localStorage.getItem('language') || 'fr', // Langue par défaut
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    },
    debug: false // Mettre en true pour voir les debug dans la console
  });

// Gérer la direction RTL/LTR
i18n.on('languageChanged', (lng) => {
  const dir = rtlLanguages.includes(lng) ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lng);
});

// Initialiser la direction au chargement
const currentLang = i18n.language;
const initialDir = rtlLanguages.includes(currentLang) ? 'rtl' : 'ltr';
document.documentElement.setAttribute('dir', initialDir);
document.documentElement.setAttribute('lang', currentLang);

export default i18n;
