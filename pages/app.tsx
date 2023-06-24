import { NextPage } from "next";
import React from "react";
import Toolbar from "../components/Toolbar";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { Container, Spinner, Text } from "@chakra-ui/react";
import CreateRecordForm from "../components/CreateRecordForm";

const App: NextPage = () => {
	const { contract } = useContract("0xeCE3fC09144cDD2C556fA98103120F2bc67b6F83");
	const { data, isLoading } = useContractRead(contract, "hasRecord");

	const NoRecordHeading = () => (
		<Text fontSize="4xl" fontWeight="bold" textAlign="center">
			Welcome, Let&apos;s Make You a Medical Record
		</Text>
	);

	return (
		<>
			<Toolbar />
			<br />
			<Container>
				{isLoading ? (
					<Spinner colorScheme="whiteAlpha" />
				) : data == false ? (
					<>
						<NoRecordHeading />
						<CreateRecordForm />
					</>
				) : (
					<p>{data}</p>
				)}
			</Container>
		</>
	);
};

export default App;
