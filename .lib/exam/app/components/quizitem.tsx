import { DetailedHTMLProps, HTMLAttributes, LiHTMLAttributes, MouseEvent, ReactElement } from "react";
import styled from 'styled-components';

export default function QuizItem(props: Readonly<{
	sequenceNumber: number;
	question: string;
	children: ReactElement<any, string>[],
}>) {
	const references: Array<ReactElement> = [];
	const options: Array<ReactElement> = [];
	for (const child of props.children) {
		if (child.type === 'li') {
			options.push(<OptionItem {...child.props}></OptionItem>);
		} else {
			references.push(child);
		}
	}
	return (
		<article className="quizitem
			w-1/2
			max-md:w-full
			pt-4 px-4
		">
			<p className="mb-2">{props.sequenceNumber}. {props.question}</p>
			{0 < references.length &&
				<div className="reference flex items-center justify-center mb-2">
					{references}
				</div>
			}
			<ol className="mb-2">
				{options}
			</ol>
		</article>
	);
}

const OptionItem = (props: HTMLAttributes<HTMLLIElement>) => {

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
		&.selected::after {
			content: '';
			position: absolute;
			bottom: 0.4rem;
   			left: -0.1rem;
			width: 1.5rem;
			height: 1.5rem;
			background: transparent url('check.svg') center center / contain no-repeat;
		}
	`;
	const template = <Styled_li {...props} onClick={onClick} />

	function onClick(ev: MouseEvent) {
		const eOption = ev.currentTarget as HTMLLIElement;
		const eParent = eOption.parentNode as HTMLOListElement;
		eParent.querySelectorAll('li.selected').forEach(el => {
			if (el !== eOption) {
				el.classList.remove('selected');
			}
		});
		eOption.classList.add('selected');
	}

	return template;

}