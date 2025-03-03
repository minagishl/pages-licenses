'use strict';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
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

export async function List() {
	const dataPath = path.join(process.cwd(), 'data', 'licenses.json');
	let licenses: License[];

	try {
		const fileContent = fs.readFileSync(dataPath, 'utf-8');
		licenses = JSON.parse(fileContent) as License[];
	} catch (error) {
		console.error('Failed to read licenses data. Run `npm run fetch-licenses` first.');
		return <div>Error: License data not found. Please run npm run fetch-licenses first.</div>;
	}

	const table = licenses.map((license) => {
		const permissions = license.permissions.map((p) => `<li>${p}</li>`).join('');
		const limitations = license.limitations.map((l) => `<li>${l}</li>`).join('');
		const conditions = license.conditions.map((c) => `<li>${c}</li>`).join('');
		return `| ${license.name} | <ul>${permissions}</ul> | <ul>${limitations}</ul> | <ul>${conditions}</ul> |`;
	});

	const tableString = table.join('\n').toString();

	const markdownTable =
		'| Name                                | Permissions          | Limitations          | Conditions           |\n' +
		'| ----------------------------------- | -------------------- | -------------------- | -------------------- |\n' +
		tableString;

	return (
		<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
			{markdownTable}
		</ReactMarkdown>
	);
}
