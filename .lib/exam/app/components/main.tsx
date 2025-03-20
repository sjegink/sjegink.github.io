'use client';

import Image from "next/image";
import QuizItem from "./quizitem";
import { useEffect } from "react";

export default function Home() {

	const template = (
		<main className="flex flex-col flex-wrap">
			{
				new Array(10).fill(0).map((_, i) => i + 1).map(seq => (
					<QuizItem key={`quizitem_${seq}`}
						sequenceNumber={seq}
						question="다음 중 ㅁㄴㅇㄹ에 대한 설명으로 옳지 않은 것을 고르시오."
					/>
				))
			}
		</main>
	);

	useEffect(() => {
		onResize();
		window.addEventListener('resize', onResize);
		return () => { window.removeEventListener('resize', onResize); }
	}, []);

	function onResize() {
		const isSmallView = (document.body.clientWidth < 768);
		const quizitems: HTMLElement[] = Array.from(document.querySelectorAll('.quizitem'));
		const container = quizitems?.[0]?.parentNode as HTMLElement;
		const heightContainer = window.innerHeight - container.getBoundingClientRect().y;
		const heightList = quizitems.map(el => el.getBoundingClientRect().height);
		const heightTotal = heightList.reduce((acc: number, val: number) => acc + val);
		const heightGapList = new Array<number>();
		const isOverflowY = (heightContainer < heightTotal);
		let heightHalf = 0;
		let i_divideAfter: number = -1;
		if (isSmallView) {
			null;
		} else for (let i = 0; i < heightList.length - 1; i++) {
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
		if (0 <= i_divideAfter) {
			container.style.height = heightHalf.toFixed(0) + 'px';
		} else {
			container.style.height = '';
		}
	}

	return template;
}
