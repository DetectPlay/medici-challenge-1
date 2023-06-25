import React from "react";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { Container, Spinner, Text } from "@chakra-ui/react";
import UpdateRecordForm from "../components/UpdateRecordForm";
import Toolbar from "../components/Toolbar";
import { useRouter } from "next/router";

const Update: NextPage = () => {
	const { contract } = useContract("0xb898D0e47831e6C502dDF000535284dE80688Be0");
	const [userHash, setUserHash] = useState<null | string>();
	// const { data, isLoading } = useContractRead(contract, "hasRecord", [userHash]);

	const router = useRouter();

	const NoRecordHeading = () => (
		<Text fontSize="4xl" fontWeight="bold" textAlign="center" color="white">
			Update Patient Record
		</Text>
	);

	// const [userId, setUserId] = useState<null | string>();

	// useEffect(() => {
	// 	setUserHash(localStorage.getItem("userHash"));
	// 	setUserId(localStorage.getItem("userId"));
	// }, []);

	useEffect(() => {
		console.log(router.query["userId"]);
	}, []);

	return (
		<>
			<Toolbar />
			<br />
			<Container>
				<NoRecordHeading />
				<UpdateRecordForm userId={router.query["userId"] as string} />
			</Container>
		</>
	);
};

export default Update;
