import { type QuizitemProps } from "app/components/quizitem";
import pokedex, { chooseLang, convertIdToName } from '../../lib/pokedex';

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
	function fillRandomIds(ids: number[], check?: (id: number) => boolean) {
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
	// 1. 
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
		options.push(...await convertIdToName(ids));
		// return
		options.sort(() => Math.random() - .5);
		quizList.push(quizitem);
	}
	// 2.
	quizList.push(await (async () => {
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
		options.push(...await convertIdToName(ids));
		// return
		options.sort(() => Math.random() - .5);
		return quizitem;
	})());
	// 3. (이미지)뭘까요 
	quizList.push(await (async () => {
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
		options.push(...await convertIdToName(ids));
		// return
		return quizitem;
	})());
	// 4. 타입이 다른 포켓몬 하나는
	// 5. ㅇ포켓몬이 가지고 있지 않는 스킬은
	// 6. 타입이 다른 스킬 하나
	// 7. ㅇ에 가장 유리한 상성을 가진 포켓몬은
	// 8. 
	// 9. TM00의 기술 이름은
	// 10. 종족값 ㅇ이 가장 높은 포켓몬은
	return quizList;
}