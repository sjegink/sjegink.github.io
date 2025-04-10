import { type Action, createSlice } from "@reduxjs/toolkit";
import { IndexNumber } from "./choiceSlice";

interface CorrectAnswerAction extends Action { payload: {
	sequenceNumber: number,
	answerIndex: IndexNumber,
} };

export const correctAnswerSlice = createSlice({
	name: 'correctAnswer',
	initialState: {
		value: new Array<IndexNumber>(),
	},
	reducers: {
		setCorrectAnswer: (state, action: CorrectAnswerAction) => {
			state.value[action.payload.sequenceNumber] = action.payload.answerIndex;
		},
	},
});
export const { setCorrectAnswer } = correctAnswerSlice.actions;