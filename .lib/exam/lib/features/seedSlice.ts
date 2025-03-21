import { type Action, createSlice } from "@reduxjs/toolkit";

interface SeedAction extends Action { payload: number };

export const seedSlice = createSlice({
	name: 'seed',
	initialState: {
		value: 0,
	},
	reducers: {
		setSeed: (state, action: SeedAction) => {
			console.log('_setSeed_', state.value);
			state.value = action.payload;
		},
	},
});
export const { setSeed } = seedSlice.actions;