import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Toolbar from "../components/Toolbar";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { Container, Spinner, Text } from "@chakra-ui/react";
import FilesForm from "../components/FilesForm";
import { useRouter } from "next/router";

const Files: NextPage = () => {
	const router = useRouter();

	const NoRecordHeading = () => (
		<Text fontSize="4xl" fontWeight="bold" textAlign="center" color="white">
			Patient Medical Files
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
				<NoRecordHeading />
				<FilesForm userId={router.query["userId"] as string} />
			</Container>
		</>
	);
};

export default Files;
