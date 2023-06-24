import {
	IDKitWidget,
	ISuccessResult,
	SignInButton,
	SignInWithWorldID,
	useIDKit,
} from "@worldcoin/idkit";
import { useCallback, useEffect } from "react";

const proofKey = "worldCoinProof";

export default function IDKitLoginButton() {
	const { open, setOpen } = useIDKit();

	const handleProof = useCallback((result: ISuccessResult) => {
		return new Promise<void>(resolve => {
			setTimeout(() => resolve(), 3000);
			// NOTE: Example of how to decline the verification request and show an error message to the user
			console.error("Verification Declined");
		});
	}, []);

	const onSuccess = (result: ISuccessResult) => {
		console.log(result);
		localStorage.setItem(proofKey, JSON.stringify(result));
		localStorage.setItem("userID", result.merkle_root);
		localStorage.setItem("proof", result.proof);
	};

	// chain: "polygon";
	// credential_type: "phone";
	// merkle_root: "0x2a3b524f7c6d3154f5a31c78a7dfc4ad1b3b9362359879e47db4d94b81e62fa7";
	// nullifier_hash: "0x12dc72222c191dc063b3895ab9086c1e075e5e31f5a971ec69d245502ce0f92d";
	// proof: "0x0f36dd65ceb49630903e80456cbc607b0abffc9ead08373136589148f3c4d8dd2f6c2599ac20b646af7611c27655c66a5e11c1285fadaa6363207eeb3d05174d1b0b875622d79f8105dd1c98d5902bf0be30e5e089a4f7c612af4178fcd07e9a0908135383c1165db43fc8cbf9b3a26b86925d0e8cbc08d668ea786ae78c24b3131749ce3b51dc0691e13a4581ebb580265507d6667cddfee5ef77b1ddccd3c61853c63880cf5417dcb164e1cdc60b37476ac15cb21222a5de3c18364adf48b807ea664dc1fef9a3d183f65dcc2e2aff61bbb962247d31141ca1cace48a15ba91bb74ecb40eb47e113874ae606c994ca3d71e1c9bfa5c7981d2beaf97e28c13f";

	// chain: "polygon";
	// credential_type: "phone";
	// merkle_root: "0x2a3b524f7c6d3154f5a31c78a7dfc4ad1b3b9362359879e47db4d94b81e62fa7";
	// nullifier_hash: "0x12dc72222c191dc063b3895ab9086c1e075e5e31f5a971ec69d245502ce0f92d";
	// proof: "0x25fd9f985c2acbb6ebb874f7ef68563d89e279440b219e1fd22d7fc617405ec40acc35af12aa75d11c950d8fbe386210084332ac8b32de6769406edf813254af248d3bb11321540a79284080aeb0b5a5220be56b412c6537949246f528144e98144ee300383f26d52add25906debd5bc1cd98c335c605dde72efa623bb64e02508031d00232a6b9419c819355f1782da83b90d535b15588b5e5bf56ecb739dc1054b14a0a22f31e6f52251e6a2f72f914b7f0c3c0896d9fd31f42215add6280f060fd65c07e7801a57489a4147cf22cb7cb5336ccc9b81c882b0504318c0e67d030467f80e061d3952c98824f9af7105aefb92ab96953ff6e5f9db4fed0f7534";

	const handleClick = (open: () => void) => {
		const proof = localStorage.getItem(proofKey);
		if (!proof) {
			open();
		}
	};

	return (
		<IDKitWidget
			action="my_action"
			signal="my_signal"
			onSuccess={onSuccess}
			handleVerify={handleProof}
			app_id={process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID!}
			theme="dark"
			// walletConnectProjectId="get_this_from_walletconnect_portal"
		>
			{({ open }) => (
				<SignInButton
					onClick={() => handleClick(open)}
					theme="dark"
					style={{ color: "white" }}
				/>
			)}
		</IDKitWidget>
	);
}
