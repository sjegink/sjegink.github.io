import { MouseEvent, useRef } from "react";
import QuizitemOption from './quizitem-option';
import { type BlurableIndexNumber, type IndexNumber, setChoice } from "lib/features/choiceSlice";
import { useDispatch, useSelector } from "react-redux";
import { setFocus } from "lib/features/focusSlice";
import { type State } from "lib/store";

export type QuizitemProps = {
	sequenceNumber: number;
	question: string;
	reference?: _QuizitemReference;
	options: string[];
}
type _QuizitemReference = _QuizitemReferenceBase<'image' | 'image.blind', { url: string }>;
type _QuizitemReferenceBase<T extends string, P> = { type: T } & P;

export default function Quizitem(props: Readonly<QuizitemProps>) {

	const selfRef = useRef<HTMLElement>(null);
	const dispatch = useDispatch();
	const focusedIndex = useSelector((state: State) => (
		state.focus.sequenceNumber === props.sequenceNumber
			? state.focus.index
			: -1
	) as BlurableIndexNumber);
	const choosenIndex = useSelector((state: State) => (
		state.choice.value[props.sequenceNumber] ?? -1
	) as BlurableIndexNumber);

	const template = (
		<article ref={selfRef} className="quizitem
			w-1/2
			max-md:w-full
			pt-4 px-4
		"
			onKeyDown={onKey}
			onFocus={onFocus} onBlur={onBlur}
			onClick={onClick}
		>
			<p className="mb-2">{props.sequenceNumber}. {props.question}</p>
			{props.reference && (
				<div className="reference flex items-center justify-center mb-2">
					{['image', 'image.blind'].includes(props.reference.type) &&
						<div className="w-1/2">
							<img className="w-full" src={props.reference.url} alt={props.reference.url}
								style={{ filter: props.reference.type === 'image.blind' ? 'brightness(0)' : '' }}
								onDragStart={(ev: MouseEvent) => ev.preventDefault()}
							/>
						</div>
					}
				</div>
			)}
			<ol className="mb-2">
				{props.options.map((text, i) => (
					<QuizitemOption
						sequenceNumber={props.sequenceNumber}
						index={i as IndexNumber}
						key={`option_${i + 1}`}
					>{text}</QuizitemOption>
				))}
			</ol>
		</article>
	);

	function onFocus(ev: React.FocusEvent) {
		if (ev.target instanceof HTMLAnchorElement) {
			const i = getIndex(ev.target);
			dispatch(setFocus({
				sequenceNumber: props.sequenceNumber,
				answerIndex: i,
			}));
		}
	}

	function onKey(ev: React.KeyboardEvent) {
		let i = focusedIndex;
		switch (ev.key) {
			case 'ArrowUp':
				ev.preventDefault();
				moveFocus(i, -1);
				return;
			case 'ArrowDown':
				ev.preventDefault();
				moveFocus(i, +1);
				return;
			case 'Tab':
				break;
			case ' ':
			case 'Enter':
				ev.preventDefault();
				toggleChoice(i);
				return;
		}
	}

	function moveFocus(i: BlurableIndexNumber, delta: -1 | 1) {
		i = Math.max(0,
			Math.min(3,
				i + delta
			)) as BlurableIndexNumber;
		dispatch(setFocus({
			sequenceNumber: props.sequenceNumber,
			answerIndex: i,
		}));
		const eArticle = selfRef.current!;
		eArticle.querySelectorAll<HTMLElement>('li > a').forEach((el, _i) => {
			if (i == _i) {
				el.setAttribute('href', '#');
				el.setAttribute('tabindex', (1000 + props.sequenceNumber).toString());
				el.focus();
			} else {
				el.removeAttribute('href');
				el.removeAttribute('tabindex');
			}
		});
	}

	function onBlur(ev: React.FocusEvent) {
		if (ev.target instanceof HTMLAnchorElement) {
			const i = getIndex(ev.target);
			console.debug({ focusedIndex });
			if (i === focusedIndex) {
				dispatch(setFocus({
					sequenceNumber: props.sequenceNumber,
					answerIndex: -1,
				}));
			}
		}
	}

	function onClick(ev: React.MouseEvent) {
		if (ev.target instanceof HTMLAnchorElement) {
			toggleChoice(getIndex(ev.target));
		};
	}
	function toggleChoice(i: BlurableIndexNumber) {
		if (choosenIndex === i) {
			i = -1;
		}
		dispatch(setChoice({
			sequenceNumber: props.sequenceNumber,
			answerIndex: i,
		}));
	}

	function getIndex(eAnchor: HTMLAnchorElement) {
		const eLi = eAnchor.closest('li') as HTMLLIElement;
		const eOl = eLi.parentNode as HTMLOListElement;
		return Array.from(eOl.children).indexOf(eLi) as IndexNumber;
	}

	return template;
}