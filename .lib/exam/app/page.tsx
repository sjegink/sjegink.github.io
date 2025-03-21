'use client';

import Header from "./components/header";
import Main from "./components/main";
import { useSearchParams } from "next/navigation";
import { setSeed } from "../lib/features/seedSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Home() {

	const searchParams = useSearchParams();
	const dispatch = useDispatch();

	// 시드 확인
	const nowSeed = Math.floor(Date.now() / 3600000);
	let seed = parseInt(searchParams.get('n') ?? '0');
	if (!seed || nowSeed < seed) {
		seed = nowSeed;
	};
	// 시드 주소 동기화
	useEffect(()=>{
		dispatch(setSeed(seed));
		const params = new URLSearchParams(searchParams.toString());
		params.set('n', seed.toString());
		history.replaceState(history.state, '', '?' + params.toString());
	},[])

	return (
		<div className="
			min-h-screen
			d-flex
			py-4 px-8
			max-md:p-4
		" style={{
			}}>
			<Header />
			<Main />
		</div>
	);
}
