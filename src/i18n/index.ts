import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json'; //English
import sr from './locales/sr.json'; //Serbian
import hr from './locales/hr.json'; //Croatian
import fr from './locales/fr.json'; //French
import de from './locales/de.json'; //German
import pl from './locales/pl.json'; //Polish
import tr from './locales/tr.json'; //Turkish
import it from './locales/it.json'; //Italian
import es from './locales/es.json'; //Spanish
import pt from './locales/pt.json'; //Portuguese
import ru from './locales/ru.json'; //Russian

const LANGUAGE_KEY = '@app_language';

// Reads persisted language from AsyncStorage — falls back to 'en'
const getStoredLanguage = async (): Promise<string> => {
    try {
        const lang = await AsyncStorage.getItem(LANGUAGE_KEY);
        return lang ?? 'en';
    } catch {
        return 'en';
    }
};

// Persists selected language code to AsyncStorage
export const saveLanguage = async (langCode: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(LANGUAGE_KEY, langCode);
    } catch (e) {
        console.warn('[i18n] saveLanguage failed:', e);
    }
};

// Maps language screen code (e.g. 'GB') to i18n locale key (e.g. 'en')
export const screenCodeToLocale: Record<string, string> = {
    GB: 'en',
    RS: 'sr',
    HR: 'hr',
    FR: 'fr',
    DE: 'de',
    PL: 'pl',
    TR: 'tr',
    IT: 'it',
    ES: 'es',
    PT: 'pt',
    RU: 'ru',
};

// Maps i18n locale key back to language screen code
export const localeToScreenCode: Record<string, string> = Object.fromEntries(
    Object.entries(screenCodeToLocale).map(([k, v]) => [v, k]),
);

const initI18n = async () => {
    const storedLang = await getStoredLanguage();

    await i18n.use(initReactI18next).init({
        compatibilityJSON: 'v4',
        resources: {
            en: { translation: en },
            sr: { translation: sr },
            hr: { translation: hr },
            fr: { translation: fr },
            de: { translation: de },
            pl: { translation: pl },
            tr: { translation: tr },
            it: { translation: it },
            es: { translation: es },
            pt: { translation: pt },
            ru: { translation: ru },
        },
        lng: storedLang,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });
};

export { initI18n };
export default i18n;