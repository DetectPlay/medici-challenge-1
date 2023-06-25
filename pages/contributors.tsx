import React from "react";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Container, Spinner, Text } from "@chakra-ui/react";
import Toolbar from "../components/Toolbar";
import { useRouter } from "next/router";
import ContributorsForm from "../components/ContributorsForm";

const Contributors: NextPage = () => {
	const router = useRouter();

	const NoRecordHeading = () => (
		<Text fontSize="4xl" fontWeight="bold" textAlign="center" color="white">
			Manage Admins
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
				<ContributorsForm userId={router.query["userId"] as string} />
			</Container>
		</>
	);
};

export default Contributors;
