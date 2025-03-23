'use client';

import store from "../../lib/store";
import { Provider } from "react-redux";

export default function StoreProvider(props: {
	children: React.ReactNode;
}) {
	return <Provider store={store}>{props.children}</Provider>;
}