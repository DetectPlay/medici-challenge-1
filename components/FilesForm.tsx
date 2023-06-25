import {
	Button,
	Container,
	Flex,
	IconButton,
	Image,
	Input,
	InputGroup,
	InputRightElement,
	Select,
	Spinner,
	Stack,
	Text,
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
import { Web3Storage } from "web3.storage";
import FilesView from "./FilesView";

export default function FilesForm({ userId }: { userId: string }) {
	const { contract } = useContract(CONTRACT_ADDRESS);
	const [files, setFiles] = useState<string[]>([]);
	const [file, setFile] = useState<any>(null);
	const [cID, setCID] = useState<string | null>(null);
	const [ipfsLoading, setIpfsLoading] = useState(false);

	const { mutateAsync: addImage, isLoading: addImageLoading } = useContractWrite(
		contract,
		"addImage"
	);

	const address = useAddress();

	const { data, isLoading } = useContractRead(contract, "getRecord", [userId]);

	// IPFS--------
	function makeStorageClient() {
		return new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN! });
	}

	async function storeFiles(file: any) {
		setIpfsLoading(true);
		const client = makeStorageClient();
		const _cid = await client.put([file]);
		console.log("stored files with cid:", _cid);
		setCID(_cid);
		setIpfsLoading(false);
	}

	function processCID(_cid: string, file: any) {
		return "https://ipfs.io/ipfs/" + _cid + "/" + file.name;
	}
	// IPFS ----------

	useEffect(() => {
		console.log(userId);
	}, []);

	useEffect(() => {
		if (!isLoading && data) {
			setFiles(data[8]);
			console.log(data);
		}
	}, [isLoading, data]);

	useEffect(() => {
		console.log(cID);
		if (cID) {
			uploadFile(userId, cID, file);
		}
	}, [cID]);

	const uploadFile = async (nullifierHash: string, _cid: string, _file: any) => {
		console.log("Writing file to blockchain ...");
		console.log(processCID(_cid, _file));
		console.log(userId);
		try {
			const data = await addImage({
				args: [nullifierHash, processCID(_cid, file)],
			});
			console.info("contract call successs", data);
		} catch (err) {
			console.error("contract call failure", err);
		} finally {
			setCID(null);
			setFile(null);
		}
	};

	const handleClick = () => {
		storeFiles(file);
	};

	const inputSize = "md";

	function formValid() {
		return file !== null;
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
					<Input
						py={1}
						size={inputSize}
						placeholder="Admin WorldID"
						bg="white"
						type="file"
						disabled={addImageLoading || ipfsLoading}
						onChange={e => {
							if (e.target.files) {
								setFile(e.target.files[0]);
							}
						}}
					/>
					{/* <Text color="white">{file && file.name}</Text> */}
					{/* <Image src="https://ipfs.io/ipfs/bafybeibgttj53wfb4m3ykuthwam57iftluiviqey7hl2vwxzbvawyyzbla/image (10).png" /> */}
					{/* <Button
						colorScheme="blue"
						style={{ color: "white" }}
						mx={250}
						onClick={() => setContributors([...contributors, ""])}
					>
						<AddIcon />
					</Button> */}
					<Button
						onClick={handleClick}
						colorScheme="teal"
						style={{ color: "white" }}
						isLoading={addImageLoading || ipfsLoading}
						isDisabled={!formValid() || address == undefined}
					>
						{address ? "Upload File" : "Connect Wallet"}
					</Button>

					<FilesView files={files} />
				</Stack>
			</Container>
		);
	}
}
