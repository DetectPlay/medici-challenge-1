import {
	IDKitWidget,
	ISuccessResult,
	SignInButton,
	SignInWithWorldID,
	useIDKit,
} from "@worldcoin/idkit";
import { useCallback, useEffect } from "react";
import { useAddress } from "@thirdweb-dev/react";

const proofKey = "worldCoin";

export default function IDKitLoginButton() {
	const { open, setOpen } = useIDKit();

	const address = useAddress();

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
		localStorage.setItem("userID", result.nullifier_hash);
		localStorage.setItem("proof", result.proof);
	};

	const handleClick = (open: () => void) => {
		const proof = localStorage.getItem(proofKey);
		if (!proof) {
			open();
		}
	};

	return (
		<IDKitWidget
			action="my_action"
			signal={address || ""}
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
