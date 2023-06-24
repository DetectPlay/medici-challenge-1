import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Button, Container } from "@chakra-ui/react";
import LoginButton from "../components/LoginButton";
import dynamic from "next/dynamic";
import { ISuccessResult, SignInButton, SignInWithWorldID } from "@worldcoin/idkit";
import { useCallback } from "react";
import IDKitLoginButton from "./IDKitLoginButton";

const IDKitWidget = dynamic(
	() => import("@worldcoin/idkit").then(mod => mod.IDKitWidget),
	{ ssr: false }
);

const Home: NextPage = () => {
	const handleProof = useCallback((result: ISuccessResult) => {
		return new Promise<void>(resolve => {
			setTimeout(() => resolve(), 3000);
			// NOTE: Example of how to decline the verification request and show an error message to the user
		});
	}, []);

	const onSuccess = (result: ISuccessResult) => {
		console.log(result);
	};

	return (
		<Container bg="yellow">
			<IDKitLoginButton />
		</Container>
	);
};

export default Home;
