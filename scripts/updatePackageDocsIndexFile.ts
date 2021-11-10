import * as fs from 'fs';
import * as path from 'path';
import compareVersions from 'compare-versions';

type PackageId = 'ds' | 'util';

function validatePackageId(packageId: string): asserts packageId is PackageId {
  if (packageId !== 'ds' && packageId !== 'util') {
    throw new Error(`Invalid package id: ${packageId}`);
  }
}

function main(): void {
  const [, , packageId] = process.argv;
  validatePackageId(packageId);

  const docsPath = path.join(__dirname, '../docs', packageId);
  const templateFilePath = path.join(__dirname, 'docsIndexTemplates', `${packageId}.md`);

  function getReverseSortedVersions(): string[] {
    const versionNumRegex = /\d+(?:\.\d+)+$/;
    return fs
      .readdirSync(docsPath)
      .filter((dirName) => versionNumRegex.test(dirName))
      .sort((v1, v2) => -compareVersions(v1, v2));
  }

  // Get dynamic content
  const versionList = getReverseSortedVersions()
    .map((version) => `- [${version}](./${version})\n`)
    .join('');
  const templateContent = fs.readFileSync(templateFilePath).toString();
  const content = `${templateContent}\n\n${versionList}`;

  // Write
  fs.writeFileSync(docsPath + '/index.md', content);
}

main();
