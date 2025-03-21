'use client';

import { configureStore } from '@reduxjs/toolkit';
import { seedSlice } from './features/seedSlice';

const store = configureStore({
	reducer: {
		seed: seedSlice.reducer,
	},
});
export type State = ReturnType<typeof store.getState>;
export default store;