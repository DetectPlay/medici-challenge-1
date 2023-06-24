import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { useCallback, useEffect } from "react";

export default function IDKitLoginButton() {
	const handleProof = useCallback((result: ISuccessResult) => {
		return new Promise<void>(resolve => {
			setTimeout(() => resolve(), 3000);
			// NOTE: Example of how to decline the verification request and show an error message to the user
			console.error("Verification Declined");
		});
	}, []);

	const onSuccess = (result: ISuccessResult) => {
		console.log(result);
	};

	useEffect(() => {
		console.log(process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID);
	}, []);

	return (
		<IDKitWidget
			action="my_action"
			signal="my_signal"
			onSuccess={onSuccess}
			handleVerify={handleProof}
			app_id={process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID!}
			// walletConnectProjectId="get_this_from_walletconnect_portal"
		>
			{({ open }) => <button onClick={open}>Click me</button>}
		</IDKitWidget>
	);
}
