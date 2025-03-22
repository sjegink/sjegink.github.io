import { type QuizitemProps } from "app/components/quizitem";
import pokedex, { chooseLang, convertPokemonIdToName, TypeName } from '../../lib/pokedex';
import PokeAPI from "pokedex-promise-v2";

export type Subject = 'pokemon';

export default async (subject: Subject, seed: number): Promise<QuizitemProps[]> => {
	console.log("Make QuizList...");
	return factories[subject](seed).then((quizdataList) => {
		return quizdataList.map((props, i) => Object.assign(props, {
			sequenceNumber: i + 1,
		}));
	});
}

type QuizitemPropsEssential = Omit<QuizitemProps, 'sequenceNumber'>;
const factories = {} as { [k in Subject]: (seed: number) => Promise<QuizitemPropsEssential[]> };

factories.pokemon = async function (_seed) {
	/** 교시에 따라 같은 문제가 유지될 수 있도록 */
	function getRandom(min: number, max: number) {
		const seed = (_seed + quizList.length) * (_seed - quizList.length);
		return seed % (max - min + 1) + min;
	}
	function fillRandomIds(ids: number[], check?: (id: number) => (boolean | Promise<boolean>)) {
		let loopLimit = 1024;
		while (ids.length < 4) {
			let id = getRandom(ids[ids.length - 1], 65535);
			while (true) {
				if (--loopLimit < 0) {
					console.warn(new Error('Unlimited Loop Detected!'));
					ids.splice(1, ids.length - 1, ...(ids[0] < 152 ? [1, 4, 7] : [152, 155, 158]));
					break;
				}
				id %= (maxIdByGen[maxIdByGen.length - 1] + 1);
				if (ids.includes(id) || check && !check(id)) {
					id += 100;
					continue;
				}
				ids.push(id);
				break;
			}
		}
		return ids;
	}
	const maxIdByGen = [0, 151, 251, 386, 493, 649, 721, 809, 905, 1025];
	const quizList = new Array<QuizitemPropsEssential>();
	//
	// ### 1. 
	{
		// prepare
		const options = new Array<string>();
		const quizitem: typeof quizList[number] = {
			question: `다음 스타팅 포켓몬 중 세대가 다른 것은?`,
			options,
		}
		// lottery
		const startings = [
			[1, 4, 7], [152, 155, 158], [252, 255, 258],
			[387, 390, 393], [495, 498, 501], [650, 653, 656],
			[722, 725, 728], [810, 813, 816], [906, 909, 912],
		];
		const i = Math.floor(getRandom(0, startings.length - 1));
		let j = Math.floor(getRandom(1, startings.length - 1));
		if (i === j) j = 0;
		const ids = Array.from(startings[i]);
		ids.push(startings[j].sort(() => getRandom(-100, 100))[0]);
		options.push(...await convertPokemonIdToName(ids));
		// return
		options.sort(() => Math.random() - .5);
		quizList.push(quizitem);
	}
	//
	// ### 2.
	{
		// prepare
		const options = new Array<string>();
		const quizitem: typeof quizList[number] = {
			question: `다음 중 %d세대 포켓몬을 고르시오.`,
			options,
		}
		// lottery
		const genId = getRandom(1, maxIdByGen.length - 1);
		quizitem.question = quizitem.question.replace('%d', `${genId}`);
		const localIdMin = maxIdByGen[genId - 1] + 1
		const localIdMax = maxIdByGen[genId];
		const ids = [getRandom(localIdMin, localIdMax)];
		fillRandomIds(ids, (id) => (id < localIdMin || localIdMax < id));
		options.push(...await convertPokemonIdToName(ids));
		// return
		options.sort(() => Math.random() - .5);
		quizList.push(quizitem);
	}
	// 3.
	{
		const options = new Array<string>();
		const quizitem: typeof quizList[number] = {
			question: `다음 실루엣에 해당하는 포켓몬의 이름을 고르시오.`,
			reference: {
				type: 'image.blind',
				url: '',
			},
			options,
		}
		// lottery
		const id = getRandom(1, maxIdByGen[maxIdByGen.length - 1]);
		quizitem.reference!.url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
		const ids = [id];
		fillRandomIds(ids);
		options.push(...await convertPokemonIdToName(ids));
		// return
		options.sort(() => Math.random() - .5);
		quizList.push(quizitem);
	}
	// 4.
	quizList.push(await (async () => {
		const options = new Array<string>();
		const quizitem: typeof quizList[number] = {
			question: ``, // 속성관련, 보기문항에 따라 달라짐.
			options,
		}
		// lottery
		const id = getRandom(1, maxIdByGen[maxIdByGen.length - 1]);
		const ids = [id];
		fillRandomIds(ids);
		// evaluate
		const list = await Promise.all(ids.map(id => pokedex.getPokemonByName(id)));
		const typeHavings: Partial<Record<TypeName, (0 | 1 | 2 | 3)[]>> = {};
		for (let i = 0; i < list.length; i++) {
			const data = list[i];
			data.types.forEach(typeData => {
				const typeName = typeData.type.name as TypeName;
				typeHavings[typeName] ??= [];
				typeHavings[typeName].push(i);
			});
		}
		const typeNames_3Have = Object.entries(typeHavings).reduce((typeNames, [typeName, idxs]) => {
			if (idxs.length === 3) typeNames.push(typeName as TypeName);
			return typeNames;
		}, new Array<TypeName>());
		const typeNames_1Have = Object.entries(typeHavings).reduce((typeNames, [typeName, idxs]) => {
			if (idxs.length === 1) typeNames.push(typeName as TypeName);
			return typeNames;
		}, new Array<TypeName>());
		if (typeNames_3Have.length === 1) {
			// 3마리는 가졌고 1마리는 못 가진 타입-이 딱 하나 있다면
			quizitem.question = `다음 중 타입이 가장 다른 하나를 고르시오.`;
			const ids_3 = typeHavings[typeNames_3Have[0]]!.map(i => ids[i]);
			while (ids_3.includes(ids[0])) ids.push(ids.shift()!); // 정답은 항상 1번
			options.push(...await convertPokemonIdToName(ids));
		} else if (0 < typeNames_1Have.length) {
			const typeName = typeNames_1Have[0];
			const typeLabel = chooseLang((await pokedex.getTypeByName(typeName)).names, 'ko');
			quizitem.question = `다음 중 ${typeLabel} 타입을 가진 포켓몬을 고르시오.`;
			const i = typeHavings[typeNames_1Have[0]]![0];
			ids.unshift(ids.splice(i, 1)[0]); // 정답은 항상 1번
			options.push(...await convertPokemonIdToName(ids));
		} else {
			const data = list[0];
			const pokemonName = await convertPokemonIdToName(ids[0]);
			const itsTypeNames = data.types.map(typeData => typeData.type.name) as TypeName[];
			quizitem.question = `다음 중 ${pokemonName}의 타입을 고르시오.`;
			const allTypeNames = (await pokedex.getTypesList()).results.map((type) => type.name as TypeName);
			const typeNames = new Array<TypeName>();
			typeNames.push(itsTypeNames.sort(() => Math.random() - .5)[0]);
			for (const typeName of allTypeNames.sort(() => Math.random() - .5)) {
				if (itsTypeNames.includes(typeName)) continue;
				typeNames.push(typeName);
				if(4 <= typeNames.length) break;
			}
			options.push(...await Promise.all(typeNames.map(async typeName => chooseLang((await pokedex.getTypeByName(typeName)).names, 'ko'))));
		}
		// return
		options.sort(() => Math.random() - .5);
		return quizitem;
	})());
	// 5. ㅇ포켓몬이 가지고 있지 않는 스킬은
	// 6. 타입이 다른 스킬 하나
	// 7. ㅇ에 가장 유리한 상성을 가진 포켓몬은
	// 8. 
	// 9. TM00의 기술 이름은
	// 10. 종족값 ㅇ이 가장 높은 포켓몬은
	return quizList;
}