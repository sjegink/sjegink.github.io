'use client';

import { configureStore } from '@reduxjs/toolkit';
import { seedSlice } from './features/seedSlice';
import { choiceSlice } from './features/choiceSlice';
import { focusSlice } from './features/focusSlice';

const store = configureStore({
	reducer: {
		seed: seedSlice.reducer,
		choice: choiceSlice.reducer,
		focus: focusSlice.reducer,
	},
});
export type State = ReturnType<typeof store.getState>;
export default store;