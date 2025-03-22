import { HTMLAttributes, MouseEvent } from "react";
import styled from "styled-components";

export type QuizitemOptionProps = HTMLAttributes<HTMLLIElement> | string;

export default (props: QuizitemOptionProps) => {
	if (typeof props === 'string') {
		props = { children: props } as HTMLAttributes<HTMLLIElement>
	}

	const template = <Styled_li {...props} onClick={onClick} />

	function onClick(ev: MouseEvent) {
		const eOption = ev.currentTarget as HTMLLIElement;
		const eParent = eOption.parentNode as HTMLOListElement;
		if (eOption.classList.contains('selected')) {
			eOption.classList.remove('selected');
		} else {
			eParent.querySelectorAll('li.selected').forEach(el => {
				if (el !== eOption) {
					el.classList.remove('selected');
				}
			});
			eOption.classList.add('selected');
		}
	}

	return template;

}

const Styled_li = styled.li`
	position: relative;
	&::before {
		margin-right: 0.25rem;
	}
	&:nth-child(1)::before { content: "①"; }
	&:nth-child(2)::before { content: "②"; }
	&:nth-child(3)::before { content: "③"; }
	&:nth-child(4)::before { content: "④"; }
	&:nth-child(5)::before { content: "⑤"; }

	cursor: pointer;
	&:hover {
		-webkit-text-stroke: .5px blue;
	}

	&.selected{
		color: blue;
		-webkit-text-stroke: .5px black;
		&:hover {
			-webkit-text-stroke-color: darkblue;
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
`;