import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { Mumbai } from "@thirdweb-dev/chains";
import { ThirdwebProvider, useContract } from "@thirdweb-dev/react";
import Toolbar from "../components/Toolbar";

const theme = extendTheme({
	styles: {
		global: () => ({
			body: {
				bg: "#1F1F1F",
				// color: "white",
			},
		}),
	},
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<ThirdwebProvider activeChain={Mumbai}>
			<ChakraProvider theme={theme}>
				<SessionProvider session={session}>
					<Component {...pageProps} />
				</SessionProvider>
			</ChakraProvider>
		</ThirdwebProvider>
	);
}

export default MyApp;
