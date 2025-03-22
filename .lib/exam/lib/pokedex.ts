import Pokedex from 'pokedex-promise-v2';

export default new Pokedex();

export type LanguageName = 'ja-Hrkt' | 'roomaji' | 'ko' | 'zh-Hant' | 'fr' | 'de' | 'es' | 'it' | 'en' | 'ja' | 'zh-Hans';
export function chooseLang(names: Pokedex.Name[], lang: LanguageName, defaultValue?: string) {
	return names.filter((nameData) => lang === nameData.language.name)[0]
		?.name ?? defaultValue;
}