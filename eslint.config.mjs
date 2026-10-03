import { config as baseConfig } from "@repo/eslint-config/base";
import { nextJsConfig } from "@repo/eslint-config/next-js";

const webFiles = ["apps/web/**/*.{js,jsx,mjs,cjs,ts,tsx}"];

export default [
    ...baseConfig,
    ...nextJsConfig.map((entry) => {
        if (entry.ignores && Object.keys(entry).every((key) => key === "ignores")) {
            return entry;
        }

        return {
            ...entry,
            files: webFiles,
        };
    }),
    {
        files: webFiles,
        settings: {
            next: {
                rootDir: "apps/web/",
            },
        },
    },
];
