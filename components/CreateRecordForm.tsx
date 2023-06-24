import {
	Button,
	Container,
	Input,
	InputGroup,
	InputRightElement,
	Select,
	Stack,
} from "@chakra-ui/react";
import { useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";
import { useEffect, useState, useCallback } from "react";
import { IDKitWidget, ISuccessResult, useIDKit } from "@worldcoin/idkit";
import { useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";

export default function CreateRecordForm() {
	const { contract } = useContract("0x7F8AcC7dB0351b95437dB1CdA44d0Dc47D0Ae23a");
	const [gender, setGender] = useState("");
	const [birthday, setBirthday] = useState("");
	const [height, setHeight] = useState("");
	const [weight, setWeight] = useState("");
	const { open, setOpen } = useIDKit();

	const createRecordObject = useContractWrite(contract, "createRecord");

	const createRecord = async (
		_gender: any,
		_birthday: any,
		_heightCM: any,
		_weightKG: any,
		signal: any,
		root: any,
		nullifierHash: any,
		proof: any
	) => {
		try {
			const data = await createRecordObject.mutateAsync({
				args: [
					nullifierHash,
					_gender,
					_birthday,
					_heightCM,
					_weightKG,
					signal,
					root,
					proof,
				],
			});
			console.info("contract call successs", data);
		} catch (err) {
			console.error("contract call failure", err);
		}
	};

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
		createRecord(
			gender,
			birthday,
			height,
			weight,
			address,
			result.merkle_root,
			result.nullifier_hash,
			ethers.utils.defaultAbiCoder.decode(["uint256[8]"], result.proof)[0]
		);
	};

	const inputSize = "md";

	function formValid() {
		return gender != "" && birthday != "" && height != "" && weight != "";
	}

	return (
		<Container p={25}>
			<Stack spacing={4}>
				<Select
					placeholder="Gender"
					onChange={e => setGender(e.target.value)}
					bg="white"
				>
					<option value="M">Male</option>
					<option value="F">Female</option>
					<option value="O">Other</option>
				</Select>
				<Input
					size={inputSize}
					placeholder="Birthday"
					type="date"
					bg="white"
					_placeholder={{ opacity: 1, color: "blackAlpha.100" }}
					onChange={e => setBirthday(e.target.value)}
				/>
				<InputGroup size={inputSize}>
					<Input
						placeholder="Height"
						type="number"
						bg="white"
						onChange={e => setHeight(e.target.value)}
					/>
					<InputRightElement width="4.5rem">
						<p>cm</p>
					</InputRightElement>
				</InputGroup>

				<InputGroup size={inputSize}>
					<Input
						placeholder="Weight"
						type="number"
						bg="white"
						onChange={e => setWeight(e.target.value)}
					/>
					<InputRightElement width="4.5rem">
						<p>kg</p>
					</InputRightElement>
				</InputGroup>
				<Button
					onClick={() => setOpen(true)}
					colorScheme="teal"
					style={{ color: "white" }}
					isLoading={createRecordObject.isLoading}
					isDisabled={!formValid() || address == undefined}
				>
					{address ? "Create Record" : "Connect Wallet"}
				</Button>
				<IDKitWidget
					action="my_action"
					signal={address}
					onSuccess={onSuccess}
					handleVerify={handleProof}
					app_id={process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID!}
					theme="dark"
					// walletConnectProjectId="get_this_from_walletconnect_portal"
				/>
			</Stack>
		</Container>
	);
}
