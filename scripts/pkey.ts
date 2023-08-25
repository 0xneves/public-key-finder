import { ethers } from "ethers";
import * as fs from "fs";

async function prepareFilters() {
	const filters: any[] = [
		"0x000000000000",
		"0x00000000000",
		"0x0000000000",
		"0x000000000",
		"0x00000000",

		"0x111111111111",
		"0x11111111111",
		"0x1111111111",
		"0x111111111",
		"0x11111111",

		"0x333333333333",
		"0x33333333333",
		"0x3333333333",
		"0x333333333",
		"0x33333333",

		"0x444444444444",
		"0x44444444444",
		"0x4444444444",
		"0x444444444",
		"0x44444444",

		"0x555555555555",
		"0x55555555555",
		"0x5555555555",
		"0x555555555",
		"0x55555555",

		"0x666666666666",
		"0x66666666666",
		"0x6666666666",
		"0x666666666",
		"0x66666666",

		"0x777777777777",
		"0x77777777777",
		"0x7777777777",
		"0x777777777",
		"0x77777777",

		"0x888888888888",
		"0x88888888888",
		"0x8888888888",
		"0x888888888",
		"0x88888888",

		"0x999999999999",
		"0x99999999999",
		"0x9999999999",
		"0x999999999",
		"0x99999999",

		"0xc0ffee",

		"0xdeadbeef",
		"0xd15ea5e",
		"0xf00dbabe",
		"0xfadedbad",
		"0xfaded420",
		"0x420faded",
		"0x420c0ffee",
		"0xc0ffee420",
		"0xcafe420",
		"0x420cafe",
	];

	const regexPatterns: any[] = [];

	for (let i = 0; i < filters.length; i++) {
		regexPatterns.push(
			new RegExp("(^" + filters[i] + "|" + filters[i] + "$)", "ig")
		);
		// regexPatterns.push(new RegExp(filters[i], "ig"));
	}

	return regexPatterns;
}

async function prepareLog() {
	const logEntry = {
		privateKey: "",
		publicKey: "",
		matches: [] as any[],
	};
	return logEntry;
}

async function generateKey() {
	const privateKey = ethers.randomBytes(32);
	const hexedPrivateKey = ethers.hexlify(privateKey);
	const wallet = new ethers.Wallet(hexedPrivateKey);
	return [wallet.privateKey, wallet.address];
}

async function writeFileAsync(filePath: string, content: any): Promise<void> {
	const jsonData = JSON.stringify(content, null, 2);
	return new Promise((resolve, reject) => {
		fs.appendFile(filePath, jsonData + ",", (error) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});
	});
}

async function snipePrivateKey(regexPatterns: any, log: any) {
	const [pvtKey, pubKey] = await generateKey();

	for (let i = 0; i < regexPatterns.length; i++) {
		const matches = pubKey.match(regexPatterns[i]);

		if (matches != null && matches.length > 0) {
			log.privateKey = pvtKey;
			log.publicKey = pubKey;
			log.matches = matches;
			console.log(`Private key: ${pvtKey}`);
			console.log(`Public key: ${pubKey}`);
			console.log(`Matches: ${matches}`);
			await writeFileAsync("log.json", log);
			break;
		}
	}
}

async function main() {
	const regexPatterns = await prepareFilters();
	const log = await prepareLog();

	while (true) {
		await snipePrivateKey(regexPatterns, log);
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
