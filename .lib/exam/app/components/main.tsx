'use client';

import quizMaker from "app/modules/quiz-maker";
import { useEffect, useState } from "react";
import Quizitem, { QuizitemProps } from "./quizitem";
import { useSelector } from "react-redux";
import { State } from "../../lib/store";

export default function Home() {

	const [quizpropList, setQuizProplist] = useState<QuizitemProps[]>();
	const seed = useSelector((state: State) => state.seed.value);

	useEffect(() => {
		// onResize
		window.addEventListener('resize', onResize);
		return () => { window.removeEventListener('resize', onResize); }
	}, []);

	useEffect(() => {
		onLoad();
	}, [seed]);

	const template = (
		<main className="flex flex-col flex-wrap">
			{
				quizpropList?.map((quizProp, i) => (
					<Quizitem key={`quizitem_${i + 1}`} {...quizProp} />
				))
			}
		</main>
	);

	let onLoad = async function () {
		setQuizProplist(await quizMaker('pokemon', seed));

		onResize();
	}
	// }, [searchParams]);

	/** 내용이 많은 경우, 2단 형태로 분할 */
	function onResize() {
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
			container.style.height = heightHalf.toFixed(0) + 'px';
		} else {
			container.style.height = '';
		}
	}

	return template;
}
