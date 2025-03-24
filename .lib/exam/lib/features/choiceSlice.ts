import { type Action, createSlice } from "@reduxjs/toolkit";

interface ChoiceAction extends Action { payload: {
	sequenceNumber: number,
	answerIndex: BlurableIndexNumber,
} };
export type IndexNumber = 0 | 1 | 2 | 3;
export type BlurableIndexNumber = IndexNumber | -1;

export const choiceSlice = createSlice({
	name: 'choice',
	initialState: {
		value: new Array<BlurableIndexNumber>(),
	},
	reducers: {
		setChoice: (state, action: ChoiceAction) => {
			state.value[action.payload.sequenceNumber] = action.payload.answerIndex;
		},
	},
});
export const { setChoice } = choiceSlice.actions;