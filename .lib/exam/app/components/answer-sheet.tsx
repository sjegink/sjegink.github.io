'use client';

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

type Point2D = [number, number];

export default function AnswerSheet() {

	const refSelf = useRef<HTMLDivElement>(null);
	let pointTemp: Point2D | null = null;
	let pointDiv: Point2D = [NaN, NaN];
	const [translate, setTranslate] = useState<string>('scale(0,0)');

	useEffect(() => {
		pointDiv = [
			Math.floor(window.innerWidth * 1.2),
			Math.floor(window.innerHeight * 0.5),
		]
		updateDivTranslate();
		addEventListeners();
		return removeEventListeners;
	}, []);

	return (
		<Styled_div ref={refSelf} className="fixed top-0 left-0 drop-shadow-md"
			style={{ transform: translate }}
		>
			<img className="bg w-full" src="omr.jpg" />
			<div className="fg absolute" style={{ inset: 0 }}></div>
		</Styled_div>
	);

	function addEventListeners() {
		window.addEventListener('resize', onResize);
		refSelf.current!.addEventListener('pointerdown', onDragStart);
		document.addEventListener('pointermove', onDrag);
		document.addEventListener('pointerup', onDragEnd);
		document.addEventListener('touchmove', onScroll, { passive: false });
	}
	function removeEventListeners() {
		window.removeEventListener('resize', onResize);
		refSelf.current!.removeEventListener('pointerdown', onDragStart);
		document.removeEventListener('pointermove', onDrag);
		document.removeEventListener('pointerup', onDragEnd);
		document.removeEventListener('touchmove', onScroll);
	}

	function onDragStart(ev: PointerEvent) {
		console.debug('50 start', ev);
		if (refSelf.current!.contains(ev.target as HTMLElement)) {
			refSelf.current!.setPointerCapture(ev.pointerId);
			pointTemp = [
				ev.clientX - pointDiv[0],
				ev.clientY - pointDiv[1],
			];
		}
	}
	function onDrag(ev: PointerEvent) {
		if (pointTemp) {
			const [x, y]: Point2D = [
				ev.clientX - pointTemp[0],
				ev.clientY - pointTemp[1],
			];
			pointDiv = [x, y];
			keepBoundary();
			updateDivTranslate();
		}
	}
	function onDragEnd(ev: MouseEvent) {
		if (pointTemp) {
			console.log(73, 'end', ev);
			pointTemp = null;
		}
	}
	function onScroll(ev: Event) {
		if (pointTemp) {
			ev.preventDefault();
		}
	}

	function onResize() {
		keepBoundary();
		updateDivTranslate();
	}

	function keepBoundary() {
		let [x, y] = pointDiv;
		const LIMIT_L = window.innerWidth * -0.45 + 30;
		const LIMIT_R = window.innerWidth * 1.45 - 30;
		const LIMIT_T = window.innerHeight * -0.2;
		const LIMIT_B = window.innerHeight * 1.2;
		x = Math.max(LIMIT_L, Math.min(LIMIT_R, x));
		y = Math.max(LIMIT_T, Math.min(LIMIT_B, y));
		pointDiv = [x, y];
	}
	function updateDivTranslate() {
		const [x, y] = pointDiv;
		setTranslate(`translate(${x}px, ${y}px)`);
	}
}

const Styled_div = styled.div`
	width: 90vw;
	cursor: move;
	> * {
		transform: translate(-50%, -50%);
	}
`