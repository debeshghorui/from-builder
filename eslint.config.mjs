import core from "ultracite/eslint/core";
import next from "ultracite/eslint/next";
import react from "ultracite/eslint/react";

export default [
    ...core,
    ...react,
    ...next,
    {
        settings: {
            next: {
                rootDir: "apps/web/",
            },
        },
    },
    {
        files: ["stylelint.config.mjs"],
        rules: {
            "unicorn/no-barrel-files": "off",
        },
    },
];
