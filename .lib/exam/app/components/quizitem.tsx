import { ReactElement } from "react";
import QuizitemOption, { QuizitemOptionProps } from './quizitem-option';

export type QuizitemProps = {
	sequenceNumber: number;
	question: string;
	options: string[];
}

export default function Quizitem(props: Readonly<QuizitemProps & {
	children?: ReactElement<any, string>[],
}>) {
	const options: Array<ReactElement> = props.options.map((text, i) => <QuizitemOption key={`option_${i + 1}`}>{text}</QuizitemOption>);
	return (
		<article className="quizitem
			w-1/2
			max-md:w-full
			pt-4 px-4
		">
			<p className="mb-2">{props.sequenceNumber}. {props.question}</p>
			{!!props.children?.length &&
				<div className="reference flex items-center justify-center mb-2">
					{props.children}
				</div>
			}
			<ol className="mb-2">
				{options}
			</ol>
		</article>
	);
}