import {
	Button,
	Card,
	CardBody,
	Container,
	Flex,
	HStack,
	Input,
	InputGroup,
	InputRightElement,
	Link,
	Select,
	Spacer,
	Spinner,
	Stack,
	Text,
	Textarea,
	VStack,
} from "@chakra-ui/react";
import { useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";
import { useEffect, useState, useCallback } from "react";
import { useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "./consts";
import { ArrowRightIcon } from "@chakra-ui/icons";
import { Configuration, OpenAIApi } from "openai";

export default function DataPage({ userId }: { userId: string }) {
	const { contract } = useContract(CONTRACT_ADDRESS);
	const [gender, setGender] = useState("");
	const [birthday, setBirthday] = useState("");
	const [height, setHeight] = useState("");
	const [weight, setWeight] = useState("");
	const [note, setNote] = useState("");

	const [prompt, setPrompt] = useState("");
	const [answer, setAnswer] = useState("");
	const [loadingAnswer, setLoadingAnswer] = useState(false);

	const address = useAddress();

	const { data, isLoading } = useContractRead(contract, "getRecord", [userId]);

	const configuration = new Configuration({
		apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
	});

	const openai = new OpenAIApi(configuration);

	// useEffect(() => {
	// 	console.log(process.env.NEXT_PUBLIC_OPENAI_KEY);
	// });

	// useEffect(() => {
	// 	console.log(data);
	// }, [data]);

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

	const inputSize = "md";

	function generatePrompt(_prompt: string) {
		return `
		You are looking at the medical records of a ${
			gender == "M" ? "male" : "female"
		} patient. They are ${
			2023 - parseInt(birthday.substring(0, 4))
		} years old, ${height} cm tall, and weigh ${weight} kg.

		Here is their medical file:
		${note}

		Based on this information answer the following prompt: ${_prompt}
		`;
	}

	async function onSubmit() {
		setLoadingAnswer(true);
		const completion = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: generatePrompt(prompt),
		});
		setAnswer(completion.data.choices[0].text || "");
		setLoadingAnswer(false);
	}

	const FieldView = (f: string) => {
		return (
			<Card bg="whiteAlpha.500">
				<CardBody>
					<Link href={f} isExternal>
						<Text fontSize={20} color={"white"}>
							{FieldView(f)}
						</Text>
					</Link>
				</CardBody>
			</Card>
		);
	};

	if (isLoading) {
		return (
			<Flex align="center" flexDir="column" my={50}>
				<Spinner size="xl" color="white" />;
			</Flex>
		);
	} else {
		return (
			<HStack mt={5} align="stretch" justify={"center"}>
				<VStack>
					<Stack spacing={4}>
						<Select placeholder="Gender" bg="white" value={gender} disabled>
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
							value={birthday}
							disabled
						/>
						<InputGroup size={inputSize}>
							<Input
								placeholder="Height"
								type="number"
								bg="white"
								value={height}
								disabled
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
								value={weight}
								disabled
							/>
							<InputRightElement width="4.5rem">
								<p>kg</p>
							</InputRightElement>
						</InputGroup>

						<Textarea
							placeholder="Patient Notes"
							bg="white"
							resize="vertical"
							value={note}
							disabled
						/>
					</Stack>
				</VStack>
				<Spacer />
				<VStack>
					<Textarea
						placeholder="Enter a prompt ..."
						onChange={e => setPrompt(e.target.value)}
						resize="vertical"
						value={prompt}
						size="md"
						width="200"
						color="white"
						bg="#1f1f1f"
					/>
					<Button
						disabled={prompt === ""}
						isLoading={loadingAnswer}
						onClick={onSubmit}
					>
						<ArrowRightIcon />
					</Button>
					<Card width="100%" minHeight={200} bg="black" color={"white"}>
						<CardBody>{answer}</CardBody>
					</Card>
				</VStack>
			</HStack>
		);
	}
}
