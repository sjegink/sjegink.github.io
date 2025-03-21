import { ReactElement } from "react";
import QuizitemOption from './quizitem-option';

export default function Quizitem(props: Readonly<{
	sequenceNumber: number;
	question: string;
	children: ReactElement<any, string>[],
}>) {
	const references: Array<ReactElement> = [];
	const options: Array<ReactElement> = [];
	for (const child of props.children) {
		if (child.type === 'li') {
			options.push(<QuizitemOption key={`option_${options.length+1}`} {...child.props}></QuizitemOption>);
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