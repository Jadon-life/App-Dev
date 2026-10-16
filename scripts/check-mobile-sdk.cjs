// Use the installed, integrity-checked Expo SDK's own compatibility matrix.
const fs = require("node:fs");
const path = require("node:path");
const { createRequire } = require("node:module");
const semver = require("semver");
const root = path.resolve(__dirname, "..");
const mobileRequire = createRequire(path.join(root, "mobile/package.json"));
function installedPackage(name) {
  for (const directory of mobileRequire.resolve.paths(name) || []) {
    const filename = path.join(directory, name, "package.json");
    if (fs.existsSync(filename))
      return { ...JSON.parse(fs.readFileSync(filename, "utf8")), filename };
  }
  throw new Error(`Missing mobile dependency: ${name}`);
}
const expo = installedPackage("expo");
const expected = JSON.parse(
  fs.readFileSync(path.join(path.dirname(expo.filename), "bundledNativeModules.json"), "utf8"),
);
const mobile = JSON.parse(fs.readFileSync(path.join(root, "mobile/package.json"), "utf8"));
let checked = 0;
let failures = 0;
for (const name of Object.keys({ ...mobile.dependencies, ...mobile.devDependencies })) {
  if (!expected[name]) continue;
  checked += 1;
  const actual = installedPackage(name).version;
  if (!semver.satisfies(actual, expected[name])) {
    console.error(`${name}: installed ${actual}; SDK expects ${expected[name]}`);
    failures += 1;
  }
}
if (failures) process.exitCode = 1;
else
  console.log(`PASS: ${checked} dependencies match the Expo ${expo.version} compatibility matrix.`);
