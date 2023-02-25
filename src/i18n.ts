import * as i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import EN from './i18n/en.json'
import FR from './i18n/fr.json'

const resources = {
    en: {
        translation: EN
    },
    fr: {
        translation: FR
    }
}

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources,
        nonExplicitSupportedLngs: true,
        fallbackLng: 'en',
        supportedLngs: ['en', 'fr'],
        interpolation: {
            escapeValue: false
        }
    })

export default i18n