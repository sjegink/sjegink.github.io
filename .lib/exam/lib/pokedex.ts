import Pokedex from 'pokedex-promise-v2';

const pokedex = new Pokedex();
export default pokedex;

/**
 * ## choose lang
 */
export function chooseLang(names: Pokedex.Name[], lang: LanguageName, defaultValue?: string) {
	return names.filter((nameData) => lang === nameData.language.name)[0]
		?.name ?? defaultValue;
}
export type LanguageName = 'ja-Hrkt' | 'roomaji' | 'ko' | 'zh-Hant' | 'fr' | 'de' | 'es' | 'it' | 'en' | 'ja' | 'zh-Hans';

/**
 * ## convert #id to name
 */
export async function convertIdToName(id: number): Promise<string>;
export async function convertIdToName(ids: number[]): Promise<string[]>;
export async function convertIdToName(idsOrId: number | number[]): Promise<string | string[]> {
	const ids = [idsOrId].flat();
	const names = await Promise.all(ids.map(async id => {
		const data = await pokedex.getPokemonSpeciesByName(id);
		return chooseLang(data.names, 'ko', data.name);
	}));
	return Array.isArray(idsOrId)
		? names
		: names[0];
}