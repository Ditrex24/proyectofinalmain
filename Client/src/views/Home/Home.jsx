import { React, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Footer from "../../components/Footer/Footer";
import Container from "@mui/material/Container";
import Paginado from "../../components/Paginado/paginado";
import Cards from "../../components/Cards/Cards";

export default function Home() {
	const properties = useSelector((state) => state.properties);
	console.log("Soy prop en el home", properties);

	useEffect(() => {
		setPage(1);
	}, [properties]);

	const [page, setPage] = useState(1);
	const [perPage, setPerPage] = useState(8);
	const maxPage = Math.ceil(properties.length / perPage);

	return (
		<div className="mt-5 mx-0">
			<h1 className="absolute sm:text-5xl text-xl font-black text-violet mt-10 top-40 left-7 leading-[1.2] font-onest">
				FIND A HOME THAT
				<br /> SUITS YOU
			</h1>
			<p className="absolute text-lg font-bold text-white top-[320px] left-7 font-onest">
				+200 PROPERTIES
			</p>
			<p className="absolute text-lg font-bold text-white mt-6 top-[320px] left-7 font-onest">
				+400 HAPPY CUSTOMERS
			</p>
			<Paginado
				page={page}
				setPage={setPage}
				maxPage={maxPage}
				products={properties}
			/>
			<div className="p-4">
				<Cards properties={properties} />
			</div>
			<Container className="flex justify-center bg-white rounded-full p-4 shadow-md">
				<Paginado
					page={page}
					setPage={setPage}
					maxPage={maxPage}
					products={properties}
				/>
			</Container>
			<div className="p-0">
				<Footer />
			</div>
		</div>
	);
}
