// ESLint 10, used by Ultracite, loads this nearest config for apps/web.
// ESLint 9, used by the web lint script, keeps the shared Next.js config.
import { createRequire } from "node:module";

const require = createRequire(process.argv[1] ?? import.meta.url);

let eslintMajor = 9;

try {
    eslintMajor = Number.parseInt(
        require("eslint/package.json").version.split(".")[0] ?? "",
        10,
    );
} catch {
    eslintMajor = 9;
}

const config =
    eslintMajor >= 10
        ? (await import("../../eslint.config.mjs")).default
        : (await import("@repo/eslint-config/next-js")).nextJsConfig;

export default eslintMajor >= 10
    ? [{ ignores: ["eslint.config.js"] }, ...config]
    : config;
