import fs from 'fs';
import path from 'path';

type License = {
	key: string;
	name: string;
	spdx_id: string;
	url: string;
	node_id: string;
	html_url: string;
	description: string;
	implementation: string;
	permissions: string[];
	conditions: string[];
	limitations: string[];
	body: string;
};

type LicenseList = {
	key: string;
	name: string;
	spdx_id: string;
	url: string;
	node_id: string;
};

async function fetchLicenses() {
	const dataDir = path.join(process.cwd(), 'data');
	if (!fs.existsSync(dataDir)) {
		fs.mkdirSync(dataDir);
	}

	console.log('Fetching licenses list...');
	const response = await fetch('https://api.github.com/licenses');
	const data = (await response.json()) as LicenseList[];

	console.log('Fetching detailed license information...');
	const licenses = await Promise.all(
		data.map(async (list) => {
			const licenseResponse = await fetch(list.url);
			return (await licenseResponse.json()) as License;
		})
	);

	console.log('Saving licenses to data/licenses.json...');
	fs.writeFileSync(path.join(dataDir, 'licenses.json'), JSON.stringify(licenses, null, 2));
	console.log('Done!');
}

fetchLicenses().catch(console.error);
