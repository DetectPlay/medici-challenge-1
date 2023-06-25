import {
	Button,
	Container,
	Flex,
	IconButton,
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
import { CONTRACT_ADDRESS } from "./consts";
import { error } from "console";
import { AddIcon, CloseIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { BigNumber } from "ethers";

export default function ContributorsForm({ userId }: { userId: string }) {
	const { contract } = useContract(CONTRACT_ADDRESS);
	const [contributors, setContributors] = useState<string[]>([]);

	const modifyContributorsObject = useContractWrite(contract, "setContributors");

	const address = useAddress();

	const { data, isLoading } = useContractRead(contract, "getRecord", [userId]);

	useEffect(() => {
		console.log(data);
	}, [data]);

	useEffect(() => {
		if (!isLoading && data) {
			setContributors(data[6]);
			console.log(data);
		}
	}, [isLoading, data]);

	const modifyContributors = async (nullifierHash: string, _contributors: string[]) => {
		try {
			const data = await modifyContributorsObject.mutateAsync({
				args: [nullifierHash, _contributors],
			});
			console.info("contract call successs", data);
		} catch (err) {
			console.error("contract call failure", err);
		}
	};

	const handleClick = () => {
		contributors && modifyContributors(userId, contributors);
	};

	const inputSize = "md";

	function formValid() {
		const isEmpty = contributors.some(x => x === "");
		return !isEmpty;
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
					{contributors?.map((c, i) => (
						<InputGroup key={i}>
							<Input
								size={inputSize}
								placeholder="Admin WorldID"
								bg="white"
								onChange={e => {
									const newArray = [...contributors];
									newArray[i] = e.target.value;
									setContributors(newArray);
								}}
								value={contributors[i]}
								disabled={modifyContributorsObject.isLoading}
							/>
							<InputRightElement>
								<IconButton
									bg="lightsalmon"
									aria-label="Remove Admin"
									icon={<CloseIcon color="red" />}
									onClick={() => {
										const newArray = [...contributors];
										newArray.splice(i);
										setContributors(newArray);
									}}
									disabled={modifyContributorsObject.isLoading}
								/>
							</InputRightElement>
						</InputGroup>
					))}
					<Button
						colorScheme="blue"
						style={{ color: "white" }}
						mx={250}
						onClick={() => setContributors([...contributors, ""])}
					>
						<AddIcon />
					</Button>
					<Button
						onClick={handleClick}
						colorScheme="teal"
						style={{ color: "white" }}
						isLoading={modifyContributorsObject.isLoading}
						isDisabled={!formValid() || address == undefined}
					>
						{address ? "Update Record" : "Connect Wallet"}
					</Button>
				</Stack>
			</Container>
		);
	}
}
