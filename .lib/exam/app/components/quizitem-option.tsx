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
			>{String.fromCharCode('①'.charCodeAt(0) + props.index)} {props.children}</a>
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
	}

	> a {
		cursor: pointer;
		outline: none;
		&.focused::before {
			--hightlight-rgb: 191,255,0;
			content: '';
			position: absolute;
			top: .1rem;
			left: .5rem;
			right: .25rem;
			width: 100%;
			height: .9rem;
			border-radius: 30% 60% 60% 30%;
			background: linear-gradient(90deg
				, rgba(var(--hightlight-rgb), .0) 0%
				, rgba(var(--hightlight-rgb), .5) 5%
				, rgba(var(--hightlight-rgb), .4) 80%
				, rgba(var(--hightlight-rgb), .0) 100%);
			opacity: .75;
			filter: blur(.5px);
		}

		&.selected{
			&.focused {
			}
			&::after {
				content: '';
				position: absolute;
				bottom: 0.4rem;
				left: -0.1rem;
				width: 1.5rem;
				height: 1.5rem;
				background: transparent url('check.svg') center center / contain no-repeat;
				opacity: .75;
				filter: blur(.5px);
			}
		}
	}
`;