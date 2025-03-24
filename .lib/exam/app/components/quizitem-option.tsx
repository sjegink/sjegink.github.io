import { HTMLAttributes, MouseEvent } from "react";
import styled from "styled-components";

export type QuizitemOptionProps = HTMLAttributes<HTMLAnchorElement> | string;

export default function QuizitemOption(props: QuizitemOptionProps) {
	if (typeof props === 'string') {
		props = { children: props } as HTMLAttributes<HTMLAnchorElement>
	}

	const template = (
		<Styled_li>
			<a {...props} onClick={onClick} />
		</Styled_li>
	)

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
	}
`;