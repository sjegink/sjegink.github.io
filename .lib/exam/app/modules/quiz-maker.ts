import Quizitem, { type QuizitemProps } from "app/components/quizitem";
import { ReactElement } from "react";

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
		return Math.floor(seed % (max - min + 1) + min);
	}
	const maxIdByGen = [0, 151, 251, 386, 493, 649, 721, 809, 905, 1025];
	const quizList = new Array<QuizitemPropsEssential>();
	// 1. 
	{
		const options = new Array<string>();
		const quizitem: typeof quizList[number] = {
			question: `다음 스타팅포켓몬 중 세대가 다른 것은?`,
			options,
		}
		const startings = [
			[1, 4, 7], [152, 155, 158], [252, 255, 258],
			[387, 390, 393], [495, 498, 501], [650, 653, 656],
			[722, 725, 728], [810, 813, 816], [906, 909, 912],
		];
		const i = Math.floor(getRandom(0, startings.length - 1));
		let j = Math.floor(getRandom(1, startings.length - 1));
		if (i === j) j = 0;
		const ids = Array.from(startings[i]);
		ids.push(startings[j].sort(() => getRandom(-100,100))[0]);
		await Promise.all(ids.map(async id => {
			const data: PokeAPI.PokemonSpecies = await fetchData(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
			options.push(data.names
				.filter((nameData: PokeAPI.Name) => /^ko\b/.test(nameData.language.name))[0]
				?.name ?? data.name);
		}));
		options.sort(() => Math.random() - .5);
		quizList.push(quizitem);
	}
	// 2. ㅇㅇ지방 포켓몬 찾기
	// 3. (이미지)뭘까요 https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png
	// 4. 타입이 다른 포켓몬 하나는
	// 5. ㅇ포켓몬이 가지고 있지 않는 스킬은
	// 6. 타입이 다른 스킬 하나
	// 7. ㅇ에 가장 유리한 상성을 가진 포켓몬은
	// 8. 
	// 9. TM00의 기술 이름은
	// 10. 종족값 ㅇ이 가장 높은 포켓몬은
	return quizList;
}

async function fetchData(url: string) {
	return fetch(url).then(response => {
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		return response.json();
	});
}