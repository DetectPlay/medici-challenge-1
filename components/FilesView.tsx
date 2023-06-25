import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
	Card,
	CardBody,
	Container,
	Image,
	Link,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";

export default function FilesView({ files }: { files: string[] }) {
	function isImage(file: string) {
		const ending = file.substring(file.length - 4);
		return ending == ".jpg" || ending == ".png" || ending == "jpeg";
	}

	const title = (f: string) => {
		const parts = f.split("/");
		return parts[parts.length - 1];
	};

	const ImageView = (f: string) => {
		return (
			<Card bg="whiteAlpha.500">
				<CardBody>
					<VStack>
						<Image src={f} alt={f} maxH={250} m={3} />;
						<Text color={"white"}>{title(f)}</Text>
					</VStack>
				</CardBody>
			</Card>
		);
	};

	const UrlView = (f: string) => {
		return (
			<Card bg="whiteAlpha.500">
				<CardBody>
					<Link href={f} isExternal>
						<Text fontSize={20} color={"white"}>
							{title(f)} <ExternalLinkIcon mx="2px" />
						</Text>
					</Link>
				</CardBody>
			</Card>
		);
	};
	return (
		<Container my={50}>
			<VStack spacing={5}>
				{files.toReversed().map((file, i) => (
					<Container align="center">
						{isImage(file) ? ImageView(file) : UrlView(file)}
					</Container>
				))}
			</VStack>
		</Container>
	);
}
