import { Box, Container, Flex, Spacer, Text } from "@chakra-ui/react";
import React from "react";
import IDKitLoginButton from "./IDKitLoginButton";
import Link from "next/link";
import { ConnectWallet } from "@thirdweb-dev/react";

export default function Toolbar() {
	return (
		<Flex h={69} align={"center"} bg="teal" px={25}>
			<Text></Text>
			<Spacer />
			<ConnectWallet />
			<Box>
				<IDKitLoginButton />
			</Box>
		</Flex>
	);
}
