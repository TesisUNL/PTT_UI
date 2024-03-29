import { useTranslation } from 'react-i18next';
// material
import { enUS, esES } from '@mui/material/locale';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const LANGS = [
  {
    value: 'es',
    label: 'Spanish',
    systemValue: esES,
    icon: '/static/icons/ic_flag_es.svg',
  },
  {
    value: 'en',
    label: 'English',
    systemValue: enUS,
    icon: '/static/icons/ic_flag_en.svg',
  }

];

export default function useLocales() {
  const { i18n, t: translate } = useTranslation();
  const langStorage = localStorage.getItem('i18nextLng');
  const currentLang = LANGS.find((_lang) => _lang.value === langStorage) || LANGS[1];

  const handleChangeLanguage = (newlang) => {
    i18n.changeLanguage(newlang);
  };

  return {
    onChangeLang: handleChangeLanguage,
    translate,
    currentLang,
    allLang: LANGS
  };
}
