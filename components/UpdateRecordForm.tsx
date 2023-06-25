import {
	Button,
	Container,
	Flex,
	Input,
	InputGroup,
	InputRightElement,
	Select,
	Spinner,
	Stack,
	Textarea,
} from "@chakra-ui/react";
import { useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";
import { useEffect, useState, useCallback } from "react";
import { IDKitWidget, ISuccessResult, useIDKit } from "@worldcoin/idkit";
import { useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "./consts";

export default function UpdateRecordForm({ userId }: { userId: string }) {
	const { contract } = useContract(CONTRACT_ADDRESS);
	const [gender, setGender] = useState("");
	const [birthday, setBirthday] = useState("");
	const [height, setHeight] = useState("");
	const [weight, setWeight] = useState("");
	const [note, setNote] = useState("");
	// const [userId, setUserId] = useState<null | string>();

	const updateRecordObject = useContractWrite(contract, "modifyRecord");

	const address = useAddress();

	console.log(userId);

	const { data, isLoading } = useContractRead(contract, "getRecord", [userId]);

	useEffect(() => {
		console.log(data);
	}, [data]);

	useEffect(() => {
		if (!isLoading && data) {
			setGender(data[2]);
			setBirthday(data[3]);
			setHeight(parseInt(data[4]).toString());
			setWeight(parseInt(data[5]).toString());
			setNote(data[7]);
			console.log(data);
		}
	}, [isLoading, data]);

	const modifyRecord = async (
		_gender: any,
		_birthday: any,
		_heightCM: any,
		_weightKG: any,
		_note: any,
		nullifierHash: any
	) => {
		try {
			const data = await updateRecordObject.mutateAsync({
				args: [nullifierHash, _gender, _heightCM, _weightKG, _note],
			});
			console.info("contract call successs", data);
		} catch (err) {
			console.error("contract call failure", err);
		}
	};

	const handleClick = () => {
		modifyRecord(gender, birthday, height, weight, note, userId);
	};

	const inputSize = "md";

	function formValid() {
		return gender != "" && birthday != "" && height != "" && weight != "";
	}

	if (isLoading) {
		return (
			<Flex align="center" flexDir="column" my={50}>
				<Spinner size="xl" color="white" />;
			</Flex>
		);
	} else {
		return (
			<Container p={25}>
				<Stack spacing={4}>
					<Select
						placeholder="Gender"
						onChange={e => setGender(e.target.value)}
						bg="white"
						value={gender}
						disabled={updateRecordObject.isLoading}
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
						value={birthday}
						disabled={updateRecordObject.isLoading}
					/>
					<InputGroup size={inputSize}>
						<Input
							placeholder="Height"
							type="number"
							bg="white"
							onChange={e => setHeight(e.target.value)}
							value={height}
							disabled={updateRecordObject.isLoading}
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
							value={weight}
							disabled={updateRecordObject.isLoading}
						/>
						<InputRightElement width="4.5rem">
							<p>kg</p>
						</InputRightElement>
					</InputGroup>

					<Textarea
						placeholder="Patient Notes"
						bg="white"
						onChange={e => setNote(e.target.value)}
						resize="vertical"
						value={note}
						disabled={updateRecordObject.isLoading}
					/>
					<Button
						onClick={handleClick}
						colorScheme="teal"
						style={{ color: "white" }}
						isLoading={updateRecordObject.isLoading}
						isDisabled={!formValid() || address == undefined}
					>
						{address ? "Update Record" : "Connect Wallet"}
					</Button>
				</Stack>
			</Container>
		);
	}
}
