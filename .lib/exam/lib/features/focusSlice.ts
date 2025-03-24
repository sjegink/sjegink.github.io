import { type Action, createSlice } from "@reduxjs/toolkit";
import { BlurableIndexNumber } from "./choiceSlice";

interface FocusAction extends Action { payload: {
	sequenceNumber: number,
	answerIndex: BlurableIndexNumber,
} };

export const focusSlice = createSlice({
	name: 'focus',
	initialState: {
		sequenceNumber: 0,
		index: -1,
	},
	reducers: {
		setFocus: (state, action: FocusAction) => {
			state.sequenceNumber = action.payload.sequenceNumber;
			state.index = action.payload.answerIndex;
		},
	},
});
export const { setFocus } = focusSlice.actions;