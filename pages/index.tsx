import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Box, Button, Container, Flex, Heading, Text } from "@chakra-ui/react";
import LoginButton from "../components/LoginButton";
import dynamic from "next/dynamic";
import { ISuccessResult, SignInButton, SignInWithWorldID } from "@worldcoin/idkit";
import { useCallback } from "react";
import IDKitLoginButton from "../components/IDKitLoginButton";
import FormView from "../components/CreateRecordForm";
import Particles from "../components/Particles";
import Tilt from "react-parallax-tilt";
import { useRouter } from "next/router";

import { Rock_Salt } from "next/font/google";

const cursive = Rock_Salt({
	weight: "400",
	subsets: ["latin"],
});

const Home: NextPage = () => {
	const router = useRouter();

	const particles = (
		<Particles
			className="absolute inset-0 -z-10 opacity-40 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
			quantity={500}
			color={["#34d399", "#fde047", "#f43f5e"][0]}
			vy={-0.2}
		/>
	);

	return (
		<>
			<Box
				pos="fixed"
				top={0}
				left={0}
				right={0}
				bottom={0}
				zIndex={0}
				overflow="hidden"
				height="100vh"
			>
				{particles}
			</Box>

			<Flex
				justify="center"
				flexDir="column"
				alignItems="center"
				pos="relative"
				zIndex={1}
				mt={100}
			>
				<Text
					as="h1"
					fontSize="8xl"
					color="white"
					className={cursive.className}
					mt={-20}
				>
					<br />
					Medici
				</Text>
				<Text as="h1" fontSize="3xl" color="white" fontFamily={"Comic-sans"}>
					<br />
					Privatized, Custodial, Decentralized Medical Records
				</Text>

				<Button
					mt={75}
					colorScheme="teal"
					size={"lg"}
					onClick={() => router.push("/app")}
				>
					Get Started
				</Button>
			</Flex>
		</>
	);
};

export default Home;
