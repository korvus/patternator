import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const svgRoot = path.join(rootDir, 'illustration', 'svg_icons');
const pngRoot = path.join(rootDir, 'illustration', 'png_x4', 'icos');
const outputPath = path.join(rootDir, 'data', 'patterns.manifest.json');

const titleMap = {
	flowers: 'Flowers',
	hearts: 'Hearts',
	misc: 'Miscellaneous',
	scrolls: 'Scrolls',
	signs: 'Signs',
	stars: 'Stars',
	trees: 'Trees'
};

function naturalCompare(a, b) {
	return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function toPosix(value) {
	return value.split(path.sep).join('/');
}

async function exists(targetPath) {
	try {
		await fs.access(targetPath);
		return true;
	} catch {
		return false;
	}
}

async function getDirectories(targetPath) {
	const entries = await fs.readdir(targetPath, { withFileTypes: true });
	return entries
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.sort(naturalCompare);
}

async function getSvgItems(categoryId) {
	const categorySvgDir = path.join(svgRoot, categoryId);
	const categoryPngDir = path.join(pngRoot, categoryId);
	const entries = await fs.readdir(categorySvgDir, { withFileTypes: true });
	const svgFiles = entries
		.filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === '.svg')
		.map((entry) => entry.name)
		.sort(naturalCompare);

	const items = [];
	for (const fileName of svgFiles) {
		const stem = path.basename(fileName, '.svg');
		const pngPath = path.join(categoryPngDir, `${stem}.png`);
		items.push({
			id: `${categoryId}-${stem}`,
			svg: toPosix(path.relative(rootDir, path.join(categorySvgDir, fileName))),
			png: (await exists(pngPath)) ? toPosix(path.relative(rootDir, pngPath)) : ''
		});
	}
	return items;
}

async function readPreviousDefault() {
	try {
		const raw = await fs.readFile(outputPath, 'utf8');
		const parsed = JSON.parse(raw);
		return parsed && parsed.defaultImage ? parsed.defaultImage : null;
	} catch {
		return null;
	}
}

async function buildManifest() {
	const categories = [];
	const categoryIds = await getDirectories(svgRoot);

	for (const categoryId of categoryIds) {
		const items = await getSvgItems(categoryId);
		if (!items.length) {
			continue;
		}
		categories.push({
			id: categoryId,
			title: titleMap[categoryId] || `${categoryId.charAt(0).toUpperCase()}${categoryId.slice(1)}`,
			items
		});
	}

	const previousDefault = await readPreviousDefault();
	const allItems = categories.flatMap((category) => category.items);
	const defaultImage = allItems.some((item) => item.id === previousDefault)
		? previousDefault
		: (allItems[0] ? allItems[0].id : '');

	return {
		generatedAt: new Date().toISOString(),
		defaultImage,
		categories
	};
}

async function main() {
	const manifest = await buildManifest();
	await fs.mkdir(path.dirname(outputPath), { recursive: true });
	await fs.writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
	console.log(`Wrote ${path.relative(rootDir, outputPath)} with ${manifest.categories.length} categories.`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
