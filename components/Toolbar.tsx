import {
	Box,
	Button,
	ButtonGroup,
	Container,
	Flex,
	Spacer,
	Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import IDKitLoginButton from "./IDKitLoginButton";
import Link from "next/link";
import { ConnectWallet, useContract, useContractRead } from "@thirdweb-dev/react";
import { useRouter } from "next/router";

export default function Toolbar() {
	const [userId, setUserId] = useState<null | string>();
	const [hasRecord, setHasRecord] = useState<boolean | null>(null);
	const { contract } = useContract("0xB4fDd313A8E59891BE02A34242A3d0Bb2Ef113B2");

	useEffect(() => {
		setUserId(localStorage.getItem("userId"));
	}, []);

	useEffect(() => {
		if (contract && userId) {
			const checkRecord = async () => {
				return await contract.call("hasRecord", [userId]);
			};
			checkRecord().then(setHasRecord);
		}
	}, [contract, userId]);

	const router = useRouter();
	return (
		<Flex h={69} align={"center"} bg="teal" px={25}>
			{hasRecord !== null && (
				<ButtonGroup>
					{!hasRecord ? (
						<Button onClick={() => router.push("/create")}>Create</Button>
					) : (
						<>
							<Button
								onClick={() =>
									router.push({
										pathname: "/update",
										query: { userId: userId },
									})
								}
							>
								Update
							</Button>
							<Button
								onClick={() =>
									router.push({
										pathname: "/contributors",
										query: { userId: userId },
									})
								}
							>
								Contributors
							</Button>

							<Button
								onClick={() =>
									router.push({
										pathname: "/files",
										query: { userId: userId },
									})
								}
							>
								Files
							</Button>
						</>
					)}
				</ButtonGroup>
			)}
			<Spacer />
			<ConnectWallet />
			<Box>
				<IDKitLoginButton />
			</Box>
		</Flex>
	);
}
