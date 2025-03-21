'use client';

import Header from "./components/header";
import Main from "./components/main";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {

	const searchParams = useSearchParams();
	const router = useRouter();

	// 시드 확인
	const nowSeed = Math.floor(Date.now()/3600000);
	let seed = parseInt(searchParams.get('n') ?? '');
	if (!seed || nowSeed < seed) {
		const params = new URLSearchParams(searchParams.toString());
		params.set('n', nowSeed.toString());
		router.replace('?' + params.toString());
	};

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
