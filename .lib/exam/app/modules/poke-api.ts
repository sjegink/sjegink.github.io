export default {

	// #region API

	async getBerries(limit: number = 20, offset: number = 0) {
		return await _req('berry', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getBerry(id: number | string) {
		return await _req('berry', id) as PokeAPI.Berry;
	},
	async getBerryFirmnesses(limit: number = 20, offset: number = 0) {
		return await _req('berry-firmness', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getBerryFirmness(id: number | string) {
		return await _req('berry-firmness', id) as PokeAPI.BerryFirmness;
	},
	async getBerryFlavors(limit: number = 20, offset: number = 0) {
		return await _req('berry-flavor', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getBerryFlavor(id: number | string) {
		return await _req('berry-flavor', id) as PokeAPI.BerryFlavor;
	},
	async getContestTypes(limit: number = 20, offset: number = 0) {
		return await _req('contest-type', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getContestType(id: number | string) {
		return await _req('contest-type', id) as PokeAPI.ContestType;
	},
	async getContestEffects(limit: number = 20, offset: number = 0) {
		return await _req('contest-effect', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getContestEffect(id: number) {
		return await _req('contest-effect', id) as PokeAPI.ContestEffect;
	},
	async getSuperContestEffects(limit: number = 20, offset: number = 0) {
		return await _req('super-contest-effect', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getSuperContestEffect(id: number) {
		return await _req('super-contest-effect', id) as PokeAPI.SuperContestEffect;
	},
	async getEncounterMethods(limit: number = 20, offset: number = 0) {
		return await _req('encounter-method', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getEncounterMethod(id: number | string) {
		return await _req('encounter-method', id) as PokeAPI.EncounterMethod;
	},
	async getEncounterConditions(limit: number = 20, offset: number = 0) {
		return await _req('encounter-condition', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getEncounterCondition(id: number | string) {
		return await _req('encounter-condition', id) as PokeAPI.EncounterCondition;
	},
	async getEncounterConditionValues(limit: number = 20, offset: number = 0) {
		return await _req('encounter-condition-value', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getEncounterConditionValue(id: number | string) {
		return await _req('encounter-condition-value', id) as PokeAPI.EncounterConditionValue;
	},
	async getEvolutionChains(limit: number = 20, offset: number = 0) {
		return await _req('evolution-chain', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getEvolutionChain(id: number) {
		return await _req('evolution-chain', id) as PokeAPI.EvolutionChain;
	},
	async getEvolutionTriggers(limit: number = 20, offset: number = 0) {
		return await _req('evolution-trigger', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getEvolutionTrigger(id: number | string) {
		return await _req('evolution-trigger', id) as PokeAPI.EvolutionTrigger;
	},
	async getGenerations(limit: number = 20, offset: number = 0) {
		return await _req('generation', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getGeneration(id: number | string) {
		return await _req('generation', id) as PokeAPI.Generation;
	},
	async getPokedexs(limit: number = 20, offset: number = 0) {
		return await _req('pokedex', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getPokedex(id: number | string) {
		return await _req('pokedex', id) as PokeAPI.Pokedex;
	},
	async getVersions(limit: number = 20, offset: number = 0) {
		return await _req('version', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getVersion(id: number | string) {
		return await _req('version', id) as PokeAPI.Version;
	},
	async getVersionGroups(limit: number = 20, offset: number = 0) {
		return await _req('version-group', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getVersionGroup(id: number | string) {
		return await _req('version-group', id) as PokeAPI.VersionGroup;
	},
	async getItems(limit: number = 20, offset: number = 0) {
		return await _req('item', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getItem(id: number | string) {
		return await _req('item', id) as PokeAPI.Item;
	},
	async getItemAttributes(limit: number = 20, offset: number = 0) {
		return await _req('item-attribute', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getItemAttribute(id: number | string) {
		return await _req('item-attribute', id) as PokeAPI.ItemAttribute;
	},
	async getItemCategories(limit: number = 20, offset: number = 0) {
		return await _req('item-category', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getItemCategory(id: number | string) {
		return await _req('item-category', id) as PokeAPI.ItemCategory;
	},
	async getItemFlingEffects(limit: number = 20, offset: number = 0) {
		return await _req('item-fling-effect', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getItemFlingEffect(id: number | string) {
		return await _req('item-fling-effect', id) as PokeAPI.ItemFlingEffect;
	},
	async getItemPockets(limit: number = 20, offset: number = 0) {
		return await _req('item-pocket', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getItemPocket(id: number | string) {
		return await _req('item-pocket', id) as PokeAPI.ItemPocket;
	},
	async getLocations(limit: number = 20, offset: number = 0) {
		return await _req('location', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getLocation(id: number | string) {
		return await _req('location', id) as PokeAPI.Location;
	},
	async getLocationAreas(limit: number = 20, offset: number = 0) {
		return await _req('location-area', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getLocationArea(id: number | string) {
		return await _req('location-area', id) as PokeAPI.LocationArea;
	},
	async getPalParkAreas(limit: number = 20, offset: number = 0) {
		return await _req('pal-park-area', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getPalParkArea(id: number | string) {
		return await _req('pal-park-area', id) as PokeAPI.PalParkArea;
	},
	async getRegions(limit: number = 20, offset: number = 0) {
		return await _req('region', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getRegion(id: number | string) {
		return await _req('region', id) as PokeAPI.Region;
	},
	async getMachines(limit: number = 20, offset: number = 0) {
		return await _req('machine', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getMachine(id: number) {
		return await _req('machine', id) as PokeAPI.Machine;
	},
	async getMoves(limit: number = 20, offset: number = 0) {
		return await _req('move', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getMove(id: number | string) {
		return await _req('move', id) as PokeAPI.Move;
	},
	async getMoveAilments(limit: number = 20, offset: number = 0) {
		return await _req('move-ailment', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getMoveAilment(id: number | string) {
		return await _req('move-ailment', id) as PokeAPI.MoveAilment;
	},
	async getMoveBattleStyles(limit: number = 20, offset: number = 0) {
		return await _req('move-battle-style', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getMoveBattleStyle(id: number | string) {
		return await _req('move-battle-style', id) as PokeAPI.MoveBattleStyle;
	},
	async getMoveCategorys(limit: number = 20, offset: number = 0) {
		return await _req('move-category', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getMoveCategory(id: number | string) {
		return await _req('move-category', id) as PokeAPI.MoveCategory;
	},
	async getMoveDamageClasses(limit: number = 20, offset: number = 0) {
		return await _req('move-damage-class', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getMoveDamageClass(id: number | string) {
		return await _req('move-damage-class', id) as PokeAPI.MoveDamageClass;
	},
	async getMoveLearnMethods(limit: number = 20, offset: number = 0) {
		return await _req('move-learn-method', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getMoveLearnMethod(id: number | string) {
		return await _req('move-learn-method', id) as PokeAPI.MoveLearnMethod;
	},
	async getMoveTargets(limit: number = 20, offset: number = 0) {
		return await _req('move-target', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getMoveTarget(id: number | string) {
		return await _req('move-target', id) as PokeAPI.MoveTarget;
	},
	async getAbilities(limit: number = 20, offset: number = 0) {
		return await _req('ability', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getAbility(id: number | string) {
		return await _req('ability', id) as PokeAPI.Ability;
	},
	async getCharacteristics(limit: number = 20, offset: number = 0) {
		return await _req('characteristic', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getCharacteristic(id: number) {
		return await _req('characteristic', id) as PokeAPI.Characteristic;
	},
	async getEggGroups(limit: number = 20, offset: number = 0) {
		return await _req('egg-group', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getEggGroup(id: number | string) {
		return await _req('egg-group', id) as PokeAPI.EggGroup;
	},
	async getGenders(limit: number = 20, offset: number = 0) {
		return await _req('gender', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getGender(id: number | string) {
		return await _req('gender', id) as PokeAPI.Gender;
	},
	async getGrowthRates(limit: number = 20, offset: number = 0) {
		return await _req('growth-rate', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getGrowthRate(id: number | string) {
		return await _req('growth-rate', id) as PokeAPI.GrowthRate;
	},
	async getNatures(limit: number = 20, offset: number = 0) {
		return await _req('nature', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getNature(id: number | string) {
		return await _req('nature', id) as PokeAPI.Nature;
	},
	async getPokeathlonStats(limit: number = 20, offset: number = 0) {
		return await _req('pokeathlon-stat', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getPokeathlonStat(id: number | string) {
		return await _req('pokeathlon-stat', id) as PokeAPI.PokeathlonStat;
	},
	async getPokemons(limit: number = 20, offset: number = 0) {
		return await _req('pokemon', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getPokemon(id: number | string) {
		return await _req('pokemon', id) as PokeAPI.Pokemon;
	},
	async getPokemonEncounter(id: number | string) {
		return await _req('pokemon',`${id}/encounters`) as PokeAPI.LocationAreaEncounter;
	},
	async getPokemonColors(limit: number = 20, offset: number = 0) {
		return await _req('pokemon-color', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getPokemonColor(id: number | string) {
		return await _req('pokemon-color', id) as PokeAPI.PokemonColor;
	},
	async getPokemonForms(limit: number = 20, offset: number = 0) {
		return await _req('pokemon-form', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getPokemonForm(id: number | string) {
		return await _req('pokemon-form', id) as PokeAPI.PokemonForm;
	},
	async getPokemonHabitats(limit: number = 20, offset: number = 0) {
		return await _req('pokemon-habitat', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getPokemonHabitat(id: number | string) {
		return await _req('pokemon-habitat', id) as PokeAPI.PokemonHabitat;
	},
	async getPokemonShapes(limit: number = 20, offset: number = 0) {
		return await _req('pokemon-shape', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getPokemonShape(id: number | string) {
		return await _req('pokemon-shape', id) as PokeAPI.PokemonShape;
	},
	async getPokemonSpeciesList(limit: number = 20, offset: number = 0) {
		return await _req('pokemon-species', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getPokemonSpecies(id: number | string) {
		return await _req('pokemon-species', id) as PokeAPI.PokemonSpecies;
	},
	async getStats(limit: number = 20, offset: number = 0) {
		return await _req('stat', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getStat(id: number | string) {
		return await _req('stat', id) as PokeAPI.Stat;
	},
	async getTypes(limit: number = 20, offset: number = 0) {
		return await _req('type', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getType(id: number | string) {
		return await _req('type', id) as PokeAPI.Type;
	},
	async getLanguages(limit: number = 20, offset: number = 0) {
		return await _req('language', { limit, offset }) as PokeAPI.NamedAPIResourceList;
	},
	async getLanguage(id: number | string) {
		return await _req('language', id) as PokeAPI.Language;
	},

	// #region utilties
	chooseLang(names: PokeAPI.Name[], lang: PokeAPI.LanguageName, defaultValue?: string) {
		return names.filter((nameData) => lang === nameData.language.name)[0]
			?.name ?? defaultValue;
	}
}

async function _req(domain: string, id: number | string): Promise<any>;
async function _req(domain: string, params: Record<string, string | number>): Promise<any>;
async function _req(domain: string, id: number | string, params: Record<string, string | number>): Promise<any>;
async function _req(domain: string, idOrParams: number | string | Record<string, string | number>, params?: Record<string, string | number>): Promise<any> {
	let url = `https://pokeapi.co/api/v2/${domain}/`;
	if (typeof idOrParams === 'number' || typeof idOrParams === 'string') {
		url += `${idOrParams}/`;
	}
	else {
		params = idOrParams;
	}
	url += `?${new URLSearchParams(params as Record<string, string>).toString()}`
	return fetch(url).then(response => {
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		return response.json();
	});
}