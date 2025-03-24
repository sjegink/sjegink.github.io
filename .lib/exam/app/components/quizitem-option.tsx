import { IndexNumber } from "lib/features/choiceSlice";
import { HTMLAttributes } from "react";
import clsx from 'clsx';
import styled from "styled-components";
import { useSelector } from "react-redux";
import { State } from "lib/store";

export type QuizitemOptionProps = {
	sequenceNumber: number;
	index: IndexNumber;
	children: React.ReactNode;
};

export default function QuizitemOption(props: QuizitemOptionProps) {

	const className = useSelector((state: State) => {
		return clsx(
			props.sequenceNumber === state.focus.sequenceNumber && props.index === state.focus.index
			&& 'focused',
			state.choice.value[props.sequenceNumber] === props.index
			&& 'selected',
		)
	});

	const template = (
		<Styled_li>
			<a
				{...props.index === 0 && { href: "#", tabIndex: 1000 + props.sequenceNumber }}
				{...{ className }}
				onClick={onClick}
			>{props.children}</a>
		</Styled_li>
	);

	function onClick(ev: React.MouseEvent) {
		ev.preventDefault();
	}

	return template;

}

const Styled_li = styled.li`
	> a {
		position: relative;
		&::before {
			margin-right: 0.25rem;
		}
	}
	&:nth-child(1) > a::before { content: "①"; }
	&:nth-child(2) > a::before { content: "②"; }
	&:nth-child(3) > a::before { content: "③"; }
	&:nth-child(4) > a::before { content: "④"; }
	&:nth-child(5) > a::before { content: "⑤"; }

	> a {
		cursor: pointer;
		outline: none;
		&.focused {
			color: blue;
			-webkit-text-fill-color: rgb(var(--foreground-rgb));;
			-webkit-text-stroke: .5px blue;
		}

		&.selected{
			color: blue;
			-webkit-text-stroke: .5px black;
			&.focused {
				-webkit-text-stroke-color: red;
			}
			&::after {
				content: '';
				position: absolute;
				bottom: 0.4rem;
				left: -0.1rem;
				width: 1.5rem;
				height: 1.5rem;
				background: transparent url('check.svg') center center / contain no-repeat;
			}
		}
	}
`;