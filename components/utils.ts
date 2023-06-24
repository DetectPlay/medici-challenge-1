import { ethers } from "ethers";

export function hexStringToUint256Array(hexString: string): ethers.BigNumber[] {
	const hexWithoutPrefix = hexString.startsWith("0x") ? hexString.slice(2) : hexString;
	const paddedHex = hexWithoutPrefix.padStart(64 * 8, "0");
	const chunks = paddedHex.match(/.{1,64}/g) || [];

	return chunks.map(chunk => {
		const uint256 = ethers.BigNumber.from(`0x${chunk}`);
		return uint256;
	});
}
