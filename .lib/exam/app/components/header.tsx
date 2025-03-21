'use client';

import styled from "styled-components";
import { useSeedTimeSelector } from 'lib/features/seedSelect';

export default function Header() {

	const headingText = useSeedTimeSelector((t: number) => {
		const today = new Date(t);
		return t && `${today.getFullYear()}학년도 ${today.getMonth() + 1}월 ${today.getDate()}일` || '';
	});

	return (
		<header className="
			my-4
			w-full
			flex flex-col items-center
			text-center
		">
			<div className="font-semibold">
				<span className="whitespace-nowrap">
					{headingText}
				</span>
				&nbsp;
				<span className="whitespace-nowrap">
					사설수학능력평가 문제지
				</span>
			</div>
			<div className="w-full flex flex-wrap justify-evenly">
				<PeriodChip className="mr-auto" />
				<h1 className="font-bold" style={{
					fontSize: '250%',
				}}>
					{'포켓몬'} 영역
				</h1>
				<PeriodChip className="ml-auto invisible" />
			</div>
			<Styled_hr className="w-full my-2" />
		</header>
	);
}


const PeriodChip = (props: {
	className?: string,
}) => {
	const text = useSeedTimeSelector((t: number) => {
		const today = new Date(t);
		return today.getHours() < 8
			? `심야 ${(today.getHours() + 1)} 교시`
			: `제 ${(today.getHours() - 8)} 교시`;
	});
	const classList: Array<string> = `${(props.className ?? '')}`.match(/\S+/g) ?? [];
	return <div className={classList.concat([
		'my-auto',
		'flex-grow-0 flex-shrink-0',
		'font-semibold',
	]).join(' ')} style={{
		borderRadius: '15px',
		border: '1px solid rgb(var(--foreground-rgb))',
		padding: '2px .5rem',
	}}>
		{text}
	</div>
}

const Styled_hr = styled.hr`
	height: 3px;
	background-color: rgb(var(--foreground-rgb));
`