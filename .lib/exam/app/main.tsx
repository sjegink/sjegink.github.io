'use client';

import quizMaker from "../lib/modules/quiz-maker";
import { useCallback, useEffect, useState } from "react";
import Quizitem, { QuizitemProps } from "../lib/components/quizitem";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../lib/store";
import { setCorrectAnswer } from "lib/features/correctAnswerSlice";
import { IndexNumber } from "lib/features/choiceSlice";

export default function Home() {

	const [quizpropList, setQuizProplist] = useState<QuizitemProps[]>();
	const dispatch = useDispatch();
	const seed = useSelector((state: State) => state.seed.value);
	const onResize = useCallback(_onResize, []);

	useEffect(() => {
		// onResize
		window.addEventListener('resize', onResize);
		return () => {
			window.removeEventListener('resize', onResize);
		}
	}, [onResize]);

	useEffect(() => {
		// DrawBySeed
		if (!seed) return;
		quizMaker('pokemon', seed)
			.then(quizList => {
				quizList.forEach((qi, i) => {
					const seq = i + 1;
					const correctAnswerOption = qi.options[0];
					qi.options.sort(() => Math.random() - .5);
					const correctAnswerIndex = qi.options.indexOf(correctAnswerOption) as IndexNumber;
					dispatch(setCorrectAnswer({
						sequenceNumber: seq,
						answerIndex: correctAnswerIndex
					}));
				});
				return quizList;
			})
			.then(quizList => setQuizProplist(quizList))
			.then(() => onResize());
	}, [seed, onResize]);

	const template = (
		<main className="flex flex-col flex-wrap">
			{
				quizpropList?.map((quizProp, i) => (
					<Quizitem key={`quizitem_${i + 1}`} {...quizProp} />
				))
			}
		</main>
	);

	return template;
}



/** 내용이 많은 경우, 2단 형태로 분할 */
function _onResize() {
	const quizitems: HTMLElement[] = Array.from(document.querySelectorAll('.quizitem'));
	const container = quizitems?.[0]?.parentNode as HTMLElement;
	if (container == null) return;
	let heightHalf = 0;
	let i_divideAfter: number = -1;
	const isSmallView = (document.body.clientWidth < 768);
	if (isSmallView) {
		null;
	} else {
		const heightList = quizitems.map(el => el.getBoundingClientRect().height);
		const heightTotal = heightList.reduce((acc: number, val: number) => acc + val);
		const heightGapList = new Array<number>();
		for (let i = 0; i < heightList.length - 1; i++) {
			heightHalf += heightList[i];
			heightGapList[i] = Math.abs(heightTotal - heightHalf - heightHalf);
			if (i_divideAfter < 0 || heightGapList[i] < heightGapList[i_divideAfter]) {
				i_divideAfter = i;
			} else {
				heightHalf -= heightList[i];
				heightHalf = Math.max(heightHalf, heightTotal - heightHalf);
				break;
			}
		}
	}
	if (0 <= i_divideAfter) {
		container.style.height = Math.ceil(heightHalf).toFixed(0) + 'px';
	} else {
		container.style.height = '';
	}
}

