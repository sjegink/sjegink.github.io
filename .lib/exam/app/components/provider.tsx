'use client';

import store from "../../lib/store";
import { Provider } from "react-redux";

export default (props: {
	children: React.ReactNode;
}) => <Provider store={store}>{props.children}</Provider>