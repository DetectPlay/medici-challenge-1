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
import { ConnectWallet } from "@thirdweb-dev/react";
import { useRouter } from "next/router";

export default function Toolbar() {
	const [userId, setUserId] = useState<null | string>();

	useEffect(() => {
		setUserId(localStorage.getItem("userId"));
	}, []);

	const router = useRouter();
	return (
		<Flex h={69} align={"center"} bg="teal" px={25}>
			<ButtonGroup>
				<Button onClick={() => router.push("/create")}>Create</Button>
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

				<Button onClick={() => router.push("/contributors")}>Contributors</Button>
				<Button onClick={() => router.push("/scans")}>Scans</Button>
			</ButtonGroup>
			<Spacer />
			<ConnectWallet />
			<Box>
				<IDKitLoginButton />
			</Box>
		</Flex>
	);
}
