import Header from "./components/header";
import Main from "./components/main";

export default function Home() {
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
