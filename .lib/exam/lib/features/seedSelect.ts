import { State } from "lib/store";
import { useSelector } from "react-redux";

export const useSeedTimeSelector = (f: (t: number) => any) => useSelector((state: State) => {
	const t = state.seed.value * 3600000;
	return f(t) ?? t;
} );