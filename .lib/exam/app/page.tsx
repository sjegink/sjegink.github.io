'use client';

import Header from "../lib/components/header";
import Main from "./main";
import { useSearchParams } from "next/navigation";
import { setSeed } from "../lib/features/seedSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AnswerSheet from "../lib/components/answer-sheet";
import ScoreLayer from "lib/components/Score-layer";

export default function Home() {

	const searchParams = useSearchParams();
	const dispatch = useDispatch();
	const [isResult, setBeResult] = useState<boolean>(false);

	// 시드 확인
	const nowSeed = Math.floor(Date.now() / 3600000);
	let seed = parseInt(searchParams.get('n') ?? '0');
	if (!seed || nowSeed < seed) {
		seed = nowSeed;
	};
	// 시드 주소 동기화
	useEffect(() => {
		dispatch(setSeed(seed));
		const params = new URLSearchParams(searchParams.toString());
		params.set('n', seed.toString());
		history.replaceState(history.state, '', '?' + params.toString());
	}, [dispatch, searchParams, seed]);

	useEffect(() => {
		// 결과 여부
		onHashChange();
		window.addEventListener('hashchange', onHashChange);
		return () => {
			window.removeEventListener('hashchange', onHashChange)
		}
	}, [onHashChange]);

	function onHashChange() {
		setBeResult(location.hash === '#result');
	}

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
			<div className="overlays">
				{isResult
					? <ScoreLayer />
					: <AnswerSheet />
				}
			</div>
		</div>
	);
}
