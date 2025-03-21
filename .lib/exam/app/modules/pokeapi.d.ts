export { };

declare global {

	namespace PokeAPI {

		// #region Named

		interface NamedAPIResourceList<T = any> {
			count: number;
			next: string;
			previous: string;
			results: Array<NamedAPIResource<T>>;
		}

		// #region Unnamed

		interface APIResourceList {
			count: number;
			next: string;
			previous: string;
			results: Array<APIResource>;
		}

		// #region Berries

		interface Berry {
			id: number;
			name: string;
			growth_time: number;
			max_harvest: number;
			natural_gift_power: number;
			size: number;
			smoothness: number;
			soil_dryness: number;
			firmness: NamedAPIResource<BerryFirmness>;
			flavors: Array<BerryFlavorMap>;
			item: NamedAPIResource<Item>;
			natural_gift_type: NamedAPIResource<Type>;
		}

		interface BerryFlavorMap {
			potency: number;
			flavor: NamedAPIResource<BerryFlavor>;
		}

		interface BerryFirmness {
			id: number;
			name: string;
			berries: Array<NamedAPIResource<Berry>>;
			names: Array<Name>;
		}

		interface BerryFlavor {
			id: number;
			name: string;
			berries: Array<FlavorBerryMap>;
			contest_type: NamedAPIResource<ContestType>;
			names: Array<Name>;
		}

		interface FlavorBerryMap {
			potency: number;
			berry: NamedAPIResource<Berry>;
		}

		// #region Contests

		interface ContestType {
			id: number;
			name: string;
			berry_flavor: NamedAPIResource<BerryFlavor>;
			names: Array<ContestName>;
		}

		interface ContestName {
			name: string;
			color: string;
			language: NamedAPIResource<Language>;
		}

		interface ContestEffect {
			id: number;
			appeal: number;
			jam: number;
			effect_entries: Array<Effect>;
			flavor_text_entries: Array<FlavorText>;
		}

		interface SuperContestEffect {
			id: number;
			appeal: number;
			flavor_text_entries: Array<FlavorText>;
			moves: Array<NamedAPIResource<Move>>;
		}

		// #region Encounters

		interface EncounterMethod {
			id: number;
			name: string;
			order: number;
			names: Array<Name>;
		}

		interface EncounterCondition {
			id: number;
			name: string;
			names: Array<Name>;
			values: Array<NamedAPIResource<EncounterConditionValue>>;
		}

		interface EncounterConditionValue {
			id: number;
			name: string;
			condition: NamedAPIResource<EncounterCondition>;
			names: Array<Name>;
		}

		// #region Evolution

		interface EvolutionChain {
			id: number;
			baby_trigger_item: NamedAPIResource<Item>;
			chain: ChainLink;
		}

		interface ChainLink {
			is_baby: boolean;
			species: NamedAPIResource<PokemonSpecies>;
			evolution_details: Array<EvolutionDetail>;
			evolves_to: Array<ChainLink>;
		}

		interface EvolutionDetail {
			item: NamedAPIResource<Item>;
			trigger: NamedAPIResource<EvolutionTrigger>;
			gender: number;
			held_item: NamedAPIResource<Item>;
			known_move: NamedAPIResource<Move>;
			known_move_type: NamedAPIResource<Type>;
			location: NamedAPIResource<Location>;
			min_level: number;
			min_happiness: number;
			min_beauty: number;
			min_affection: number;
			needs_overworld_rain: boolean;
			party_species: NamedAPIResource<PokemonSpecies>;
			party_type: NamedAPIResource<Type>;
			relative_physical_stats: number;
			time_of_day: string;
			trade_species: NamedAPIResource<PokemonSpecies>;
			turn_upside_down: boolean;
		}

		interface EvolutionTrigger {
			id: number;
			name: string;
			names: Array<Name>;
			pokemon_species: Array<NamedAPIResource<PokemonSpecies>>;
		}

		// #region Games

		interface Generation {
			id: number;
			name: string;
			abilities: Array<NamedAPIResource<Ability>>;
			names: Array<Name>;
			main_region: NamedAPIResource<Region>;
			moves: Array<NamedAPIResource<Move>>;
			pokemon_species: Array<NamedAPIResource<PokemonSpecies>>;
			types: Array<NamedAPIResource<Type>>;
			version_groups: Array<NamedAPIResource<VersionGroup>>;
		}

		interface Pokedex {
			id: number;
			name: string;
			is_main_series: boolean;
			descriptions: Array<Description>;
			names: Array<Name>;
			pokemon_entries: Array<PokemonEntry>;
			region: NamedAPIResource<Region>;
			version_groups: Array<NamedAPIResource<VersionGroup>>;
		}

		interface PokemonEntry {
			entry_number: number;
			pokemon_species: NamedAPIResource<PokemonSpecies>;
		}

		interface Version {
			id: number;
			name: string;
			names: Array<Name>;
			version_group: NamedAPIResource<VersionGroup>;
		}

		interface VersionGroup {
			id: number;
			name: string;
			order: number;
			generation: NamedAPIResource<Generation>;
			move_learn_methods: Array<NamedAPIResource<MoveLearnMethod>>;
			pokedexes: Array<NamedAPIResource<Pokedex>>;
			regions: Array<NamedAPIResource<Region>>;
			versions: Array<NamedAPIResource<Version>>;
		}

		// #region Items

		interface Item {
			id: number;
			name: string;
			cost: number;
			fling_power: number;
			fling_effect: NamedAPIResource<ItemFlingEffect>;
			attributes: Array<NamedAPIResource<ItemAttribute>>;
			category: NamedAPIResource<ItemCategory>;
			effect_entries: Array<VerboseEffect>;
			flavor_text_entries: Array<VersionGroupFlavorText>;
			game_indices: Array<GenerationGameIndex>;
			names: Array<Name>;
			sprites: ItemSprites;
			held_by_pokemon: Array<ItemHolderPokemon>;
			baby_trigger_for: APIResource<EvolutionChain>;
			machines: Array<MachineVersionDetail>;
		}

		interface ItemSprites { default: string; }

		interface ItemHolderPokemon {
			pokemon: NamedAPIResource<Pokemon>;
			version_details: Array<ItemHolderPokemonVersionDetail>;
		}

		interface ItemHolderPokemonVersionDetail {
			rarity: number;
			version: NamedAPIResource<Version>;
		}

		interface ItemAttribute {
			id: number;
			name: string;
			items: Array<NamedAPIResource<Item>>;
			names: Array<Name>;
			descriptions: Array<Description>;
		}

		interface ItemCategory {
			id: number;
			name: string;
			items: Array<NamedAPIResource<Item>>;
			names: Array<Name>;
			pocket: NamedAPIResource<ItemPocket>;
		}

		interface ItemFlingEffect {
			id: number;
			name: string;
			effect_entries: Array<Effect>;
			items: Array<NamedAPIResource<Item>>;
		}

		interface ItemPocket {
			id: number;
			name: string;
			categories: Array<NamedAPIResource<ItemCategory>>;
			names: Array<Name>;
		}

		// #region Locations

		interface Location {
			id: number;
			name: string;
			region: NamedAPIResource<Region>;
			names: Array<Name>;
			game_indices: Array<GenerationGameIndex>;
			areas: Array<NamedAPIResource<LocationArea>>;
		}

		interface LocationArea {
			id: number;
			name: string;
			game_index: number;
			encounter_method_rates: Array<EncounterMethodRate>;
			location: NamedAPIResource<Location>;
			names: Array<Name>;
			pokemon_encounters: Array<PokemonEncounter>;
		}

		interface EncounterMethodRate {
			encounter_method: NamedAPIResource<EncounterMethod>;
			version_details: Array<EncounterVersionDetails>;
		}

		interface EncounterVersionDetails {
			rate: number;
			version: NamedAPIResource<Version>;
		}

		interface PokemonEncounter {
			pokemon: NamedAPIResource<Pokemon>;
			version_details: Array<VersionEncounterDetail>;
		}

		interface PalParkArea {
			id: number;
			name: string;
			names: Array<Name>;
			pokemon_encounters: Array<PalParkEncounterSpecies>;
		}

		interface PalParkEncounterSpecies {
			base_score: number;
			rate: number;
			pokemon_species: NamedAPIResource<PokemonSpecies>;
		}

		interface Region {
			id: number;
			locations: Array<NamedAPIResource<Location>>;
			name: string;
			names: Array<Name>;
			main_generation: NamedAPIResource<Generation>;
			pokedexes: Array<NamedAPIResource<Pokedex>>;
			version_groups: Array<NamedAPIResource<VersionGroup>>;
		}

		// #region Machines

		interface Machine {
			id: number;
			item: NamedAPIResource<Item>;
			move: NamedAPIResource<Move>;
			version_group: NamedAPIResource<VersionGroup>;
		}

		// #region Moves

		interface Move {
			id: number;
			name: string;
			accuracy: number;
			effect_chance: number;
			pp: number;
			priority: number;
			power: number;
			contest_combos: ContestComboSets;
			contest_type: NamedAPIResource<ContestType>;
			contest_effect: APIResource<ContestEffect>;
			damage_class: NamedAPIResource<MoveDamageClass>;
			effect_entries: Array<VerboseEffect>;
			effect_changes: Array<AbilityEffectChange>;
			learned_by_pokemon: Array<NamedAPIResource<Pokemon>>;
			flavor_text_entries: Array<MoveFlavorText>;
			generation: NamedAPIResource<Generation>;
			machines: Array<MachineVersionDetail>;
			meta: MoveMetaData;
			names: Array<Name>;
			past_values: Array<PastMoveStatValues>;
			stat_changes: Array<MoveStatChange>;
			super_contest_effect: APIResource<SuperContestEffect>;
			target: NamedAPIResource<MoveTarget>;
			type: NamedAPIResource<Type>;
		}

		interface ContestComboSets {
			normal: ContestComboDetail;
			super: ContestComboDetail;
		}

		interface ContestComboDetail {
			use_before: Array<NamedAPIResource<Move>>;
			use_after: Array<NamedAPIResource<Move>>;
		}

		interface MoveFlavorText {
			flavor_text: string;
			language: NamedAPIResource<Language>;
			version_group: NamedAPIResource<VersionGroup>;
		}

		interface MoveMetaData {
			ailment: NamedAPIResource<MoveAilment>;
			category: NamedAPIResource<MoveCategory>;
			min_hits: number;
			max_hits: number;
			min_turns: number;
			max_turns: number;
			drain: number;
			healing: number;
			crit_rate: number;
			ailment_chance: number;
			flinch_chance: number;
			stat_chance: number;
		}

		interface MoveStatChange {
			change: number;
			stat: NamedAPIResource<Stat>;
		}

		interface PastMoveStatValues {
			accuracy: number;
			effect_chance: number;
			power: number;
			pp: number;
			effect_entries: Array<VerboseEffect>;
			type: NamedAPIResource<Type>;
			version_group: NamedAPIResource<VersionGroup>;
		}

		interface MoveAilment {
			id: number;
			name: string;
			moves: Array<NamedAPIResource<Move>>;
			names: Array<Name>;
		}

		interface MoveBattleStyle {
			id: number;
			name: string;
			names: Array<Name>;
		}

		interface MoveCategory {
			id: number;
			name: string;
			moves: Array<NamedAPIResource<Move>>;
			descriptions: Array<Description>;
		}

		interface MoveDamageClass {
			id: number;
			name: string;
			descriptions: Array<Description>;
			moves: Array<NamedAPIResource<Move>>;
			names: Array<Name>;
		}

		interface MoveLearnMethod {
			id: number;
			name: string;
			descriptions: Array<Description>;
			names: Array<Name>;
			version_groups: Array<NamedAPIResource<VersionGroup>>;
		}

		interface MoveTarget {
			id: number;
			name: string;
			descriptions: Array<Description>;
			moves: Array<NamedAPIResource<Move>>;
			names: Array<Name>;
		}

		// #region Pokemon

		interface Ability {
			id: number;
			name: string;
			is_main_series: boolean;
			generation: NamedAPIResource<Generation>;
			names: Array<Name>;
			effect_entries: Array<VerboseEffect>;
			effect_changes: Array<AbilityEffectChange>;
			flavor_text_entries: Array<AbilityFlavorText>;
			pokemon: Array<AbilityPokemon>;
		}

		interface AbilityEffectChange {
			effect_entries: Array<Effect>;
			version_group: NamedAPIResource<VersionGroup>;
		}

		interface AbilityFlavorText {
			flavor_text: string;
			language: NamedAPIResource<Language>;
			version_group: NamedAPIResource<VersionGroup>;
		}

		interface AbilityPokemon {
			is_hidden: boolean;
			slot: number;
			pokemon: NamedAPIResource<Pokemon>;
		}

		interface Characteristic {
			id: number;
			gene_modulo: number;
			possible_values: Array<number>;
			highest_stat: NamedAPIResource<Stat>;
			descriptions: Array<Description>;
		}

		interface EggGroup {
			id: number;
			name: string;
			names: Array<Name>;
			pokemon_species: Array<NamedAPIResource<PokemonSpecies>>;
		}

		interface Gender {
			id: number;
			name: string;
			pokemon_species_details: Array<PokemonSpeciesGender>;
			required_for_evolution: Array<NamedAPIResource<PokemonSpecies>>;
		}

		interface PokemonSpeciesGender {
			rate: number;
			pokemon_species: NamedAPIResource<PokemonSpecies>;
		}

		interface GrowthRate {
			id: number;
			name: string;
			formula: string;
			descriptions: Array<Description>;
			levels: Array<GrowthRateExperienceLevel>;
			pokemon_species: Array<NamedAPIResource<PokemonSpecies>>;
		}

		interface GrowthRateExperienceLevel {
			level: number;
			experience: number;
		}

		interface Nature {
			id: number;
			name: string;
			decreased_stat: NamedAPIResource<Stat>;
			increased_stat: NamedAPIResource<Stat>;
			hates_flavor: NamedAPIResource<BerryFlavor>;
			likes_flavor: NamedAPIResource<BerryFlavor>;
			pokeathlon_stat_changes: Array<NatureStatChange>;
			move_battle_style_preferences: Array<MoveBattleStylePreference>;
			names: Array<Name>;
		}

		interface NatureStatChange {
			max_change: number;
			pokeathlon_stat: NamedAPIResource<PokeathlonStat>;
		}

		interface MoveBattleStylePreference {
			low_hp_preference: number;
			high_hp_preference: number;
			move_battle_style: NamedAPIResource<MoveBattleStyle>;
		}

		interface PokeathlonStat {
			id: number;
			name: string;
			names: Array<Name>;
			affecting_natures: NaturePokeathlonStatAffectSets;
		}

		interface NaturePokeathlonStatAffectSets {
			increase: Array<NaturePokeathlonStatAffect>;
			decrease: Array<NaturePokeathlonStatAffect>;
		}

		interface NaturePokeathlonStatAffect {
			max_change: number;
			nature: NamedAPIResource<Nature>;
		}

		interface Pokemon {
			id: number;
			name: string;
			base_experience: number;
			height: number;
			is_default: boolean;
			order: number;
			weight: number;
			abilities: Array<PokemonAbility>;
			forms: Array<NamedAPIResource<PokemonForm>>;
			game_indices: Array<VersionGameIndex>;
			held_items: Array<PokemonHeldItem>;
			location_area_encounters: string;
			moves: Array<PokemonMove>;
			past_types: Array<PokemonTypePast>;
			sprites: PokemonSprites;
			cries: PokemonCries;
			species: NamedAPIResource<PokemonSpecies>;
			stats: Array<PokemonStat>;
			types: Array<PokemonType>;
		}

		interface PokemonAbility {
			is_hidden: boolean;
			slot: number;
			ability: NamedAPIResource<Ability>;
		}

		interface PokemonType {
			slot: number;
			type: NamedAPIResource<Type>;
		}

		interface PokemonFormType {
			slot: number;
			type: NamedAPIResource<Type>;
		}

		interface PokemonTypePast {
			generation: NamedAPIResource<Generation>;
			types: Array<PokemonType>;
		}

		interface PokemonHeldItem {
			item: NamedAPIResource<Item>;
			version_details: Array<PokemonHeldItemVersion>;
		}

		interface PokemonHeldItemVersion {
			version: NamedAPIResource<Version>;
			rarity: number;
		}

		interface PokemonMove {
			move: NamedAPIResource<Move>;
			version_group_details: Array<PokemonMoveVersion>;
		}

		interface PokemonMoveVersion {
			move_learn_method: NamedAPIResource<MoveLearnMethod>;
			version_group: NamedAPIResource<VersionGroup>;
			level_learned_at: number;
		}

		interface PokemonStat {
			stat: NamedAPIResource<Stat>;
			effort: number;
			base_stat: number;
		}

		interface PokemonSprites {
			front_default: string;
			front_shiny: string;
			front_female: string;
			front_shiny_female: string;
			back_default: string;
			back_shiny: string;
			back_female: string;
			back_shiny_female: string;
		}

		interface PokemonCries {
			latest: string;
			legacy: string;
		}

		interface LocationAreaEncounter {
			location_area: NamedAPIResource<LocationArea>;
			version_details: Array<VersionEncounterDetail>;
		}

		interface PokemonColor {
			id: number;
			name: string;
			names: Array<Name>;
			pokemon_species: Array<NamedAPIResource<PokemonSpecies>>;
		}

		interface PokemonForm {
			id: number;
			name: string;
			order: number;
			form_order: number;
			is_default: boolean;
			is_battle_only: boolean;
			is_mega: boolean;
			form_name: string;
			pokemon: NamedAPIResource<Pokemon>;
			types: Array<PokemonFormType>;
			sprites: PokemonFormSprites;
			version_group: NamedAPIResource<VersionGroup>;
			names: Array<Name>;
			form_names: Array<Name>;
		}

		interface PokemonFormSprites {
			front_default: string;
			front_shiny: string;
			back_default: string;
			back_shiny: string;
		}

		interface PokemonHabitat {
			id: number;
			name: string;
			names: Array<Name>;
			pokemon_species: Array<NamedAPIResource<PokemonSpecies>>;
		}

		interface PokemonShape {
			id: number;
			name: string;
			awesome_names: Array<AwesomeName>;
			names: Array<Name>;
			pokemon_species: Array<NamedAPIResource<PokemonSpecies>>;
		}

		interface AwesomeName {
			awesome_name: string;
			language: NamedAPIResource<Language>;
		}

		interface PokemonSpecies {
			id: number;
			name: string;
			order: number;
			gender_rate: number;
			capture_rate: number;
			base_happiness: number;
			is_baby: boolean;
			is_legendary: boolean;
			is_mythical: boolean;
			hatch_counter: number;
			has_gender_differences: boolean;
			forms_switchable: boolean;
			growth_rate: NamedAPIResource<GrowthRate>;
			pokedex_numbers: Array<PokemonSpeciesDexEntry>;
			egg_groups: Array<NamedAPIResource<EggGroup>>;
			color: NamedAPIResource<PokemonColor>;
			shape: NamedAPIResource<PokemonShape>;
			evolves_from_species: NamedAPIResource<PokemonSpecies>;
			evolution_chain: APIResource<EvolutionChain>;
			habitat: NamedAPIResource<PokemonHabitat>;
			generation: NamedAPIResource<Generation>;
			names: Array<Name>;
			pal_park_encounters: Array<PalParkEncounterArea>;
			flavor_text_entries: Array<FlavorText>;
			form_descriptions: Array<Description>;
			genera: Array<Genus>;
			varieties: Array<PokemonSpeciesVariety>;
		}

		interface Genus {
			genus: string;
			language: NamedAPIResource<Language>;
		}

		interface PokemonSpeciesDexEntry {
			entry_number: number;
			pokedex: NamedAPIResource<Pokedex>;
		}

		interface PalParkEncounterArea {
			base_score: number;
			rate: number;
			area: NamedAPIResource<PalParkArea>;
		}

		interface PokemonSpeciesVariety {
			is_default: boolean;
			pokemon: NamedAPIResource<Pokemon>;
		}

		interface Stat {
			id: number;
			name: string;
			game_index: number;
			is_battle_only: boolean;
			affecting_moves: MoveStatAffectSets;
			affecting_natures: NatureStatAffectSets;
			characteristics: Array<APIResource<Characteristic>>;
			move_damage_class: NamedAPIResource<MoveDamageClass>;
			names: Array<Name>;
		}

		interface MoveStatAffectSets {
			increase: Array<MoveStatAffect>;
			decrease: Array<MoveStatAffect>;
		}

		interface MoveStatAffect {
			change: number;
			move: NamedAPIResource<Move>;
		}

		interface NatureStatAffectSets {
			increase: Array<NamedAPIResource<Nature>>;
			decrease: Array<NamedAPIResource<Nature>>;
		}

		interface Type {
			id: number;
			name: string;
			damage_relations: TypeRelations;
			past_damage_relations: Array<TypeRelationsPast>;
			game_indices: Array<GenerationGameIndex>;
			generation: NamedAPIResource<Generation>;
			move_damage_class: NamedAPIResource<MoveDamageClass>;
			names: Array<Name>;
			pokemon: Array<TypePokemon>;
			moves: Array<NamedAPIResource<Move>>;
		}

		interface TypePokemon {
			slot: number;
			pokemon: NamedAPIResource<Pokemon>;
		}

		interface TypeRelations {
			no_damage_to: Array<NamedAPIResource<Type>>;
			half_damage_to: Array<NamedAPIResource<Type>>;
			double_damage_to: Array<NamedAPIResource<Type>>;
			no_damage_from: Array<NamedAPIResource<Type>>;
			half_damage_from: Array<NamedAPIResource<Type>>;
			double_damage_from: Array<NamedAPIResource<Type>>;
		}

		interface TypeRelationsPast {
			generation: NamedAPIResource<Generation>;
			damage_relations: TypeRelations;
		}

		interface Language {
			id: number;
			name: string;
			official: boolean;
			iso639: string;
			iso3166: string;
			names: Array<Name>;
		}

		type LanguageName = 'ja-Hrkt' | 'roomaji' | 'ko' | 'zh-Hant' | 'fr' | 'de' | 'es' | 'it' | 'en' | 'ja' | 'zh-Hans';

		interface APIResource<T = string> { url: string; }

		interface Description {
			description: string;
			language: NamedAPIResource<Language>;
		}

		interface Effect {
			effect: string;
			language: NamedAPIResource<Language>;
		}

		interface Encounter {
			min_level: number;
			max_level: number;
			condition_values: Array<NamedAPIResource<EncounterConditionValue>>;
			chance: number;
			method: NamedAPIResource<EncounterMethod>;
		}

		interface FlavorText {
			flavor_text: string;
			language: NamedAPIResource<Language>;
			version: NamedAPIResource<Version>;
		}

		interface GenerationGameIndex {
			game_index: number;
			generation: NamedAPIResource<Generation>;
		}

		interface MachineVersionDetail {
			machine: APIResource<Machine>;
			version_group: NamedAPIResource<VersionGroup>;
		}

		interface Name {
			name: string;
			language: NamedAPIResource<Language>;
		}

		interface NamedAPIResource<T = any> {
			name: T extends Language
			? LanguageName
			: string;
			url: string;
		}

		interface VerboseEffect {
			effect: string;
			short_effect: string;
			language: NamedAPIResource<Language>;
		}

		interface VersionEncounterDetail {
			version: NamedAPIResource<Version>;
			max_chance: number;
			encounter_details: Array<Encounter>;
		}

		interface VersionGameIndex {
			game_index: number;
			version: NamedAPIResource<Version>;
		}

		interface VersionGroupFlavorText {
			text: string;
			language: NamedAPIResource<Language>;
			version_group: NamedAPIResource<VersionGroup>;
		}

	}
}