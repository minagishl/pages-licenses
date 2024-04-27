'use strict';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

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

export async function List() {
	const response = await fetch('https://api.github.com/licenses');
	const data = (await response.json()) as LicenseList[];
	const table = await Promise.all(
		data.map(async (list) => {
			const licenseResponse = await fetch(list.url);
			const license = (await licenseResponse.json()) as License;
			const permissions = license.permissions.map((p) => `<li>${p}</li>`).join('');
			const limitations = license.limitations.map((l) => `<li>${l}</li>`).join('');
			const conditions = license.conditions.map((c) => `<li>${c}</li>`).join('');
			return `| ${license.name} | <ul>${permissions}</ul> | <ul>${limitations}</ul> | <ul>${conditions}</ul> |`;
		})
	);
	const tableString = table.join('\n').toString();
	console.log(tableString);

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
