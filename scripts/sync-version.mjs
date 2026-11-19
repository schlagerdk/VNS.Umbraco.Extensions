// package.json holds the version. This writes it to the NuGet package (nuget/VNS.Umbraco.Extensions.csproj) and to the
// Umbraco package manifest, both its version and the ?v= on the bundle, so browsers fetch a new version's code.
//
//   node scripts/sync-version.mjs            writes the version in package.json to the others
//   node scripts/sync-version.mjs 17.0.1     sets 17.0.1 in package.json first
//
// Versions follow Umbraco's: 17.0.0, and a fourth number for a fix of the package for the same Umbraco (17.0.0.1).
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const packageJsonPath = path.join(root, 'package.json');
const csprojPath = path.join(root, 'nuget', 'VNS.Umbraco.Extensions.csproj');
const umbracoPackageJsonPath = path.join(
  root,
  'nuget',
  'wwwroot',
  'App_Plugins',
  'VNS.Umbraco.Extensions',
  'umbraco-package.json'
);
const versionPattern = /^\d+\.\d+\.\d+(\.\d+)?$/;

const packageJsonText = await readFile(packageJsonPath, 'utf8');
const packageJson = JSON.parse(packageJsonText);
const requested = process.argv[2];

if (requested !== undefined) {
  if (!versionPattern.test(requested)) {
    throw new Error(`"${requested}" is not a version such as 17.0.1 or 17.0.1.2`);
  }
  packageJson.version = requested;
  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, '\t') + '\n', 'utf8');
}

const { version } = packageJson;

if (!version || !versionPattern.test(version)) {
  throw new Error(`package.json has no valid version (found "${version}")`);
}

const umbracoPackageJson = JSON.parse(await readFile(umbracoPackageJsonPath, 'utf8'));
umbracoPackageJson.version = version;
for (const extension of umbracoPackageJson.extensions ?? []) {
  if (typeof extension.js === 'string') {
    extension.js = extension.js.replace(/\?v=[^&]*$/, '') + `?v=${version}`;
  }
}
await writeFile(umbracoPackageJsonPath, JSON.stringify(umbracoPackageJson, null, '\t') + '\n', 'utf8');

const csproj = await readFile(csprojPath, 'utf8');
if (!/<Version>[^<]*<\/Version>/.test(csproj)) {
  throw new Error('nuget/VNS.Umbraco.Extensions.csproj is missing a <Version>');
}
await writeFile(csprojPath, csproj.replace(/<Version>[^<]*<\/Version>/, `<Version>${version}</Version>`), 'utf8');

console.log(`Version ${version}: package.json, umbraco-package.json and the NuGet package`);
