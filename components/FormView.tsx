import {
	Input,
	InputGroup,
	InputRightElement,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Stack,
} from "@chakra-ui/react";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { randomUUID } from "crypto";
import { useEffect, useState } from "react";
import { Web3Button } from "@thirdweb-dev/react";

export default function CreateRecordForm() {
	const { contract } = useContract("0xeCE3fC09144cDD2C556fA98103120F2bc67b6F83");
	const { data, isLoading } = useContractRead(contract, "getRecord");
	const [age, setAge] = useState("");
	const [birthday, setBirthday] = useState("");
	const [height, setHeight] = useState("");
	const [weight, setWeight] = useState("");
	const [userID, setuserID] = useState<null | string>(null);

	const inputSize = "md";

	function formValid() {
		return age != "" && birthday != "" && height != "" && weight != "" && userID;
	}

	useEffect(() => {
		const userID = localStorage.getItem("userID");
		setuserID(userID);
		console.log(userID);
	}, []);

	return (
		<Stack spacing={4}>
			<Input
				size={inputSize}
				placeholder="Age"
				type=""
				bg="white"
				onChange={e => setAge(e.target.value)}
			/>
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
			<Web3Button
				contractAddress="0xeCE3fC09144cDD2C556fA98103120F2bc67b6F83"
				action={contract => {
					contract.call("createRecord", [
						userID,
						age,
						birthday,
						height,
						weight,
					]);
				}}
				isDisabled={!formValid()}
				theme="light"
			>
				Create Medical Record
			</Web3Button>
		</Stack>
	);
}
