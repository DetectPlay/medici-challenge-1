import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Toolbar from "../components/Toolbar";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { Container, Spinner, Text } from "@chakra-ui/react";
import CreateRecordForm from "../components/CreateRecordForm";

const App: NextPage = () => {
	const { contract } = useContract("0xb898D0e47831e6C502dDF000535284dE80688Be0");
	const [userHash, setUserHash] = useState<null | string>();
	// const { data, isLoading } = useContractRead(contract, "hasRecord", [userHash]);

	const NoRecordHeading = () => (
		<Text fontSize="4xl" fontWeight="bold" textAlign="center" color="white">
			Welcome, Let&apos;s Make You a Medical Record
		</Text>
	);

	useEffect(() => {
		setUserHash(localStorage.getItem("userHash"));
	}, []);

	return (
		<>
			<Toolbar />
			<br />
			<Container>
				{/* {isLoading ? (
					<Spinner colorScheme="whiteAlpha" />
				) : data == false || !userHash ? (
					<>
						<NoRecordHeading />
						<CreateRecordForm />
					</>
				) : (
					<p>{data}</p>
				)} */}
				<NoRecordHeading />
				<CreateRecordForm />
			</Container>
		</>
	);
};

export default App;
