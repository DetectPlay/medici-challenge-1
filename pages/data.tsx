import React from "react";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { Container, Spinner, Text } from "@chakra-ui/react";
import UpdateRecordForm from "../components/UpdateRecordForm";
import Toolbar from "../components/Toolbar";
import { useRouter } from "next/router";
import DataPage from "../components/DataPage";

const Data: NextPage = () => {
	const router = useRouter();

	const Heading = () => (
		<Text fontSize="4xl" fontWeight="bold" textAlign="center" color="white">
			Patient Data Portal
		</Text>
	);

	useEffect(() => {
		console.log(router.query["userId"]);
	}, []);

	return (
		<>
			<Toolbar />
			<br />
			<Container>
				<Heading />
				<DataPage userId={router.query["userId"] as string} />
			</Container>
		</>
	);
};

export default Data;
