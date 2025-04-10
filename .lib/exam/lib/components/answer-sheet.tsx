'use client';

import clsx from "clsx";
import { State } from "lib/store";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import tw from "tailwind-styled-components";

type Point2D = [number, number];

export default function AnswerSheet() {

	const refSelf = useRef<HTMLDivElement>(null);
	const refZone = useRef<HTMLDivElement>(null);
	let pointTemp: Point2D | null = null;
	let pointDiv: Point2D = [NaN, NaN];
	const [isSubmitOver, setSubmitOver] = useState<boolean | undefined>();
	const [translate, setTranslate] = useState<string>('scale(0,0)');
	const [myname, setMyname] = useState<string>('');
	const [mycode, setMycode] = useState<string>('      ');
	const [isSigned, setSigned] = useState<boolean>(false);
	const choosenIndexes = useSelector((state: State) => state.choice.value);

	useEffect(() => {
		pointDiv = [
			Math.floor(window.innerWidth * 1.2),
			Math.floor(window.innerHeight * 0.5),
		]
		updateDivTranslate();
		addEventListeners();
		return removeEventListeners;
	}, []);

	const calculate = useCallback((value: number) => `calc(var(--layer-width) * ${value})`, []);

	return (
		<div id="answer-sheet">
			<SubmitZoneDiv ref={refZone} isSubmitOver={isSubmitOver}>답안지를 제출하려면 이곳으로 끌어놓으세요.</SubmitZoneDiv>
			<Styled_sheetBody ref={refSelf}
				className="fixed top-0 left-0 drop-shadow-md"
				style={{ transform: translate }}
			>
				<div className="box absolute aspect-30/23 flex items-stretch justify-between">
					<div className="lefthand flex flex-col justify-between relative" style={{ width: calculate(.25), marginTop: calculate(.005) }}>
						<p className="absolute bottom-full">※ 컴퓨터용 수성싸인펜만 사용</p>
						<table style={{ height: calculate(.16) }}>
							<thead>
								<tr>
									<th style={{ width: '16%' }} />
									<th style={{ width: '84%' }} />
								</tr>
							</thead>
							<tbody>
								<tr style={{ height: '50%' }}>
									<th>성　명</th>
									<td>
										<div className="h-full flex items-center relative">
											<span className="absolute top-1/2 left-0" style={{ transform: "translateY(-50%)" }}>(한글)</span>
											<input name="myname"
												defaultValue={myname} onChange={e => {
													setMyname(e.target.value);
													setSigned(false);
												}}
												className="w-full h-full flex-grow overflow-hidden"
												style={{
													paddingLeft: '1.5em',
													fontSize: '200%',
												}}
												tabIndex={-1} />
										</div>
									</td>
								</tr>
								<tr style={{ height: '25%' }}>
									<th rowSpan={2}>본　인<br />확인란</th>
									<td align="center">위 본인임을 서약합니다.</td>
								</tr>
								<tr style={{ height: '25%' }}>
									<td align="center">{isSigned
										? <span className="text-[120%] text-black font-bold opacity-75">위 본인임을 서약합니다.</span>
										: <SignatureHandle className="cursor-pointer" onClick={ev => setSigned(true)}>클릭하여 서약</SignatureHandle>
									}</td>
								</tr>
							</tbody>
						</table>
						<table>
							<thead>
								<tr>
									{new Array(7).fill(0).map((i) => (
										<th key={i} style={{ width: '14.286%' }} />
									))}
								</tr>
							</thead>
							<tbody>
								<tr style={{ height: calculate(.023) }}>
									<th colSpan={7}>수　험　번　호</th>
								</tr>
								<tr style={{ height: 'var(--marking-slot-height)' }}>
									{[0, '-', 1, 2, 3, 4, 5].map((i) => (
										typeof i === 'string'
											? <th key={i}>─</th>
											: <td key={i} align="center">{mycode.charAt(i) ?? false}</td>
									))}
								</tr>
								<tr>
									<td colSpan={7} rowSpan={10}>
										<div className="inset-0 flex flex-wrap justify-between">
											{new Array(10).fill(0).map((_, i) => (
												[0, '─', 1, 2, 3, 4, 5].map((j) => (
													<div key={`${i}x${j}`} className="flex items-center justify-center" style={{ width: calculate(.035) }}>
														{typeof j !== 'number'
															? [1, 2, 3].includes(i) && <span style={{ height: '1em', lineHeight: '1em' }}>{j}</span>
															: (j !== 0 || [1, 2, 3].includes(i)) &&
															<MarkingSlot value={i} isActive={mycode.charAt(j) === String(i)}
																onClick={ev => { let arr = mycode.split(''); arr.splice(j, 1, String(i)); setMycode(arr.join('')); }}
															/>
														}
													</div>
												))
											))}
										</div>
									</td>
								</tr>
							</tbody>
						</table>
						<table style={{
							fontSize: `${calculate(.01)}`,
							lineHeight: '135%',
							height: `${calculate(.17)}`,
						}}>
							<tbody>
								<tr>
									<td>
										<H3>(가장 올바른 기입예)</H3>
										<div className="flex justify-center">{
											Object.entries({
												'●': true,
												'ⓥ': false,
												'ⓧ': false,
												'ⓛ': false,
												'◑': false,
											}).map(([markingExample, isCorrect], i) => (
												<div key={i} className="flex-grow-0 text-center" style={{ margin: `0 ${calculate(.005)}` }}>
													{markingExample}<br />{isCorrect ? 'ㅇ' : '×'}
												</div>
											))
										}
										</div>
										<H3>유　의　사　항</H3>
										<ol className="list-decimal ps-4">
											<li>반드시 컴퓨터용 수성싸인펜을 사용해야 합니다.</li>
											<li>본인확인란에는 상기내용을 동일하게 기재하고 수험번호를 정확하게 표기해야 합니다.</li>
											<li>답안표기는 해당 칸마다 반드시 하나의 답안을 골라 바르고 진하게 표기해야 합니다. 예: ●</li>
											<li>본인의 부주의로 인하여 전산기기에 의한 채점이 불가한 경우에 발생하는 불이익은 전적으로 본인의 책임으로 합니다.</li>
										</ol>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className="righthand flex flex-col justify-between" style={{ width: calculate(.66) }}>
						<div className="topside flex">
							<div className="flex-grow">
								<H2>　　　년 　월 　일 시행</H2>
								<H1>시험 답안지</H1>
							</div>
							<table style={{ width: calculate(.135) }}>
								<thead>
									<tr>
										<th style={{ width: '40%' }}></th>
										<th style={{ width: '60%' }}></th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<th>감독관<br />확인란</th>
										<td align="center"><span className="circled">인</span></td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className="bottomside flex">
							<table>
								<thead>
									<tr>
										<th style={{ width: calculate(.035) }} />
										<th style={{ width: calculate(.090) }} />
									</tr>
								</thead>
								<tbody>
									<tr style={{
										height: calculate(.03),
										lineHeight: calculate(.03),
									}}>
										<th colSpan={2} align="center" className="relative">
											<div className="absolute left-1/2 w-full max-h-full" style={{
												lineHeight: '100%',
												transform: `translate(-50%,-50%)`,
											}}>
												<H3 style={{ lineHeight: 'inherit' }}>제 1 과목</H3>
												<p className="text-xs">({'포켓몬'} 영역)</p>
											</div>
										</th>
									</tr>
									{new Array(4).fill(0).map((_, i) => i * 5 + 1).map(startNum => (
										<tr key={startNum}>
											<th style={{ margin: '-1% 0' }}>
												<div className="flex flex-col items-center justify-space" style={{ margin: '-.125em 0' }}>
													{new Array(5).fill(0).map((_, i) => startNum + i).map(n => (
														<span key={n} className="place-content-center" style={{ height: 'var(--marking-slot-height)' }}>{n}</span>
													))}
												</div>
											</th>
											<td>
												<div className="flex flex-col items-center justify-space" style={{ margin: '-.125em 0' }}>
													{new Array(5).fill(0).map((_, i) => startNum + i).map(n => <div key={n} className="flex">
														{new Array(4).fill(0).map((_, j) => j + 1).map(j => (
															<MarkingSlot key={j} value={j} isActive={choosenIndexes[n] + 1 === j} />
														))}
													</div>)}
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</Styled_sheetBody >
		</div>
	);

	// #region Event Handlers

	function addEventListeners() {
		window.addEventListener('resize', onResize);
		refSelf.current!.addEventListener('pointerdown', onDragStart);
		document.addEventListener('pointermove', onDrag);
		document.addEventListener('pointerup', onDragEnd);
		document.addEventListener('touchmove', onScroll, { passive: false });
	}
	function removeEventListeners() {
		window.removeEventListener('resize', onResize);
		refSelf.current?.removeEventListener('pointerdown', onDragStart);
		document.removeEventListener('pointermove', onDrag);
		document.removeEventListener('pointerup', onDragEnd);
		document.removeEventListener('touchmove', onScroll);
	}

	function onDragStart(ev: PointerEvent) {
		console.debug('50 start', ev);
		const el = ev.target as HTMLElement;
		if (el.matches('input,.cursor-pointer')) {
			ev.stopPropagation();
			return;
		}
		if (refSelf.current!.contains(el)) {
			refSelf.current!.setPointerCapture(ev.pointerId);
			pointTemp = [
				ev.clientX - pointDiv[0],
				ev.clientY - pointDiv[1],
			];
			setSubmitOver(false);
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
			const eZone = refZone.current!;
			const eSheet = refSelf.current!.children[0] as HTMLDivElement;
			setSubmitOver(y < window.innerHeight / 2 && y - eSheet.clientHeight / 2 < eZone.clientHeight);
			updateDivTranslate();
		}
	}
	function onDragEnd(ev: MouseEvent) {
		console.debug('onDragEnd.', { pointTemp, isSubmitOver });
		const wasSubmitOver = refZone.current!.classList.contains('active');
		if (pointTemp) {
			pointTemp = null;
			if (wasSubmitOver) {
				submit();
			}
			setSubmitOver(undefined);
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
	async function submit() {
		if (confirm(`[${myname}]님 답안지를 제출합니다.`)) {
			location.href = "#result";
		}
	}
}

// #region Styled/Components

const StyledH1 = styled.h1`
	font-size: 2em;
	line-height: 150%;
`;
const H1 = tw(StyledH1)` text-center font-bold `;
const StyledH2 = styled.h2`
	font-size: 1.5em;
	line-height: 150%;
`;
const H2 = tw(StyledH2)` text-center font-bold `;
const StyledH3 = styled.h3`
	font-size: 1.2em;
	line-height: 135%;
`;
const H3 = tw(StyledH3)` text-center font-bold `;

const Styled_submitZone = styled.div`
	background-color: rgba(0,255,0, .4);
	border: 1vw dashed #0F0F;
	border-top: 0 none;
	border-radius: 0 0 2em 2em;
	&:not(.active) {
		filter: brightness(0.4) saturate(0);
	}
`;

const Styled_signatureHandle = styled.a`
	@keyframes fading {
		0% { opacity: .1; }
		20% { opacity: .25; }
		80% { opacity: .75; }
		100% { opacity: .9; }
	}
	animation-duration: 700ms;
	animation-name: fading;
	animation-iteration-count: infinite;
	animation-direction: alternate;
`;
const SignatureHandle = tw(Styled_signatureHandle)`
	block h-full place-content-center text-center
`;

const Styled_sheetBody = styled.div`
	--layer-width: 90vw;
	--layer-fg-rgb: 0,127,225;
	--layer-bg-rgba: 255,245,225;
	font-size: calc(var(--layer-width) * .0125);
	--marking-slot-height: calc(var(--layer-width) * .0305);
	> .box {
		inset: 0;
		cursor: move;
		padding: calc(var(--layer-width)* .020) calc(var(--layer-width)* .040) calc(var(--layer-width)* .035) calc(var(--layer-width)* .030);
		user-select: none;
		width: var(--layer-width);
		transform: translate(-50%, -50%);
		background-color: rgb(var(--layer-bg-rgba));
		/* background: transparent url('omr.jpg') center center / cover; */
		color: rgb(var(--layer-fg-rgb));
		& > * {
			opacity: .9;
		}
	}
	table {
		tbody {
			th, td {
				margin: .5px;
				border: calc(var(--layer-width) * .002) solid rgb(var(--layer-fg-rgb));
			}
			th{
				background-color: rgba(var(--layer-fg-rgb), .15);
			}
		}
	}
	.marking-slot {
		height: var(--marking-slot-height);
		font-size: calc(var(--layer-width) * .01);
		display: flex;
		align-items: center;
    	justify-content: center;
		position: relative;
		transition: linear 150ms;
		&.cursor-pointer:not(.active):hover {
			filter: hue-rotate(180deg);
		}
		&.active::after {
			position: absolute;
			top: 50%; left: 50%;
			transform: translate(-50%, -50%) skewX(355deg);
			display: block;
			content: '';
			width: calc(var(--layer-width) * .01);
			height: calc(var(--layer-width) * .02);
			background-color: rgba(0,0,0,.7);
		}
	}
	.circled {
		&:not(.relative):not(.absolute):not(.fixed) {
			position: relative;
		}
		&::before {
			content: '';
			position: absolute;
			top: 50%; left: 50%;
			transform: translate(-50%, -50%);
			display: block;
			width: calc(var(--layer-width) * .012);
			height: calc(var(--layer-width) * .012);
			border: 1px solid rgb(var(--layer-fg-rgb));
			border-radius: 50%;
		}
	}
`;

function MarkingSlot(props: {
	value: number;
	isActive?: boolean;
	onClick?: React.MouseEventHandler<HTMLSpanElement>;
}) {
	return <span className={clsx([
		'marking-slot',
		'circled',
		props.onClick && 'cursor-pointer',
		props.isActive && 'active',
	])}
		style={{ width: '1.75em' }} onClick={props.onClick}>{props.value}</span>
}

const SubmitZoneDiv = forwardRef(function SubmitZoneDiv(props: {
	isSubmitOver: boolean | undefined;
	children: React.ReactNode;
}, ref: React.ForwardedRef<HTMLDivElement>) {
	return <Styled_submitZone
		ref={ref}
		className={clsx([
			`submit-zone fixed inset-0 h-20 place-content-center text-center`,
			props.isSubmitOver === true && 'active',
			props.isSubmitOver === undefined && 'hidden',
		])}
	>{props.children}</Styled_submitZone>
})