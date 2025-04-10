import { State } from "lib/store";
import { useSelector } from "react-redux";
import styled from "styled-components";
import tw from "tailwind-styled-components";

export default function ScoreLayer(props: {}) {

	const score = useSelector((state: State) => {
		let score = 0;
		let count = 0;
		console.debug({corrAns: state.correctAnswer.value});
		state.correctAnswer.value.slice(1).forEach((correctAnswer, i) => {
			const sequenceNumber = i + 1;
			count++;
			if(state.choice.value[sequenceNumber] === correctAnswer) {
				score++;
			}
		});
		console.debug({score, count});
		return Math.floor(100 * score / count).toFixed(0);
	});

	return (
		<Styled_div>
			<Styled_p>{score}</Styled_p>
		</Styled_div>
	);
}

const Styled_div = tw.div`
	fixed inset-0
	flex items-center justify-center text-center
`;

const Styled_p = styled.p`
	--fg-color: red;
	font-size: 10vw;
	color: var(--fg-color);
	position: relative;
	&::after {
		content: '';
		position: absolute;
		top: 80%;
		left: -0.5vw;
		right: -1.5vw;
		height: 1.5vw;
		border: 0 solid var(--fg-color);
		border-width: .7vw 0;
		transform: rotate(352.5deg);
	}
`;