import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const packageJsonPath = path.join(root, 'package.json');
const umbracoPackageJsonPath = path.join(
  root,
  'App_Plugins',
  'VNS.Umbraco.Extensions',
  'umbraco-package.json'
);

const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
const umbracoPackageJson = JSON.parse(await readFile(umbracoPackageJsonPath, 'utf8'));

if (!packageJson.version) {
  throw new Error('package.json is missing a version field');
}

umbracoPackageJson.version = packageJson.version;

await writeFile(umbracoPackageJsonPath, JSON.stringify(umbracoPackageJson, null, '\t') + '\n', 'utf8');

console.log(`Synced version ${packageJson.version} to App_Plugins/VNS.Umbraco.Extensions/umbraco-package.json`);
