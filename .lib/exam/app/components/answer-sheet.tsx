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
			onDragStart={onDragStart}
			onDrag={onDrag}
			onDragExit={onDragLeave}
			onDragEnd={onDragLeave}
		>
			<img className="bg w-full" src="omr.jpg" />
			<div className="fg absolute" style={{ inset: 0 }}></div>
		</Styled_div>
	);

	function addEventListeners() {
		window.addEventListener('resize', onResize);
		refSelf.current!.addEventListener('mousedown', onDragStart);
		document.addEventListener('mousemove', onDrag);
		document.addEventListener('mouseup', onDragEnd);
		document.addEventListener('mouseout', onDragLeave);
	}
	function removeEventListeners() {
		window.removeEventListener('resize', onResize);
		refSelf.current!.removeEventListener('mousedown', onDragStart);
		document.removeEventListener('mousemove', onDrag);
		document.removeEventListener('mouseup', onDragEnd);
		document.removeEventListener('mouseout', onDragLeave);
	}

	function onDragStart(ev: React.DragEvent | MouseEvent) {
		ev.preventDefault();
		pointTemp = [
			ev.pageX - pointDiv[0],
			ev.pageY - pointDiv[1],
		];
	}
	function onDrag(ev: React.DragEvent | MouseEvent) {
		if (pointTemp) {
			const [x, y]: Point2D = [
				ev.pageX - pointTemp[0],
				ev.pageY - pointTemp[1],
			];
			pointDiv = [x, y];
			keepBoundary();
			updateDivTranslate();
		}
	}
	function onDragEnd(ev: React.DragEvent | MouseEvent) {
		if (pointTemp) {
			pointTemp = null;
		}
	}
	function onDragLeave(ev: React.DragEvent | MouseEvent) {
		const eHtml = document.body.parentNode as HTMLElement;
		if (eHtml === ev.relatedTarget) {
			onDragEnd(ev)
		}
	}

	function onResize() {
		keepBoundary();
		updateDivTranslate();
	}

	function keepBoundary() {
		let [x, y] = pointDiv;
		const LIMIT_L = window.innerWidth * -0.2;
		const LIMIT_R = window.innerWidth * 1.2;
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
	width: 45rem;
	cursor: move;
	> * {
		transform: translate(-50%, -50%);
	}
`