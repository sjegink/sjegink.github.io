import { ReactElement } from "react";
import QuizitemOption, { QuizitemOptionProps } from './quizitem-option';
import Image from "next/image";

export type QuizitemProps = {
	sequenceNumber: number;
	question: string;
	reference?: _QuizitemReference;
	options: string[];
}
type _QuizitemReference = _QuizitemReferenceBase<'image' | 'image.blind', { url: string }>;
type _QuizitemReferenceBase<T extends string, P> = { type: T } & P;

export default function Quizitem(props: Readonly<QuizitemProps>) {
	const options: Array<ReactElement> = props.options.map((text, i) => <QuizitemOption key={`option_${i + 1}`}>{text}</QuizitemOption>);
	return (
		<article className="quizitem
			w-1/2
			max-md:w-full
			pt-4 px-4
		">
			<p className="mb-2">{props.sequenceNumber}. {props.question}</p>
			{props.reference && (
				<div className="reference flex items-center justify-center mb-2">
					{['image', 'image.blind'].includes(props.reference.type) &&
						<div className="w-full aspect-2/1 pointer-events-none" style={{ userSelect: 'none' }}>
							<img src={props.reference.url} alt={props.reference.url} style={{ filter: props.reference.type === 'image.blind' ? 'brightness(0)' : '' }} />
						</div>
					}
				</div>
			)}
			<ol className="mb-2">
				{options}
			</ol>
		</article>
	);
}