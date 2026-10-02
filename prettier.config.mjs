import config from "ultracite/prettier";

export default {
    ...config,
    plugins: ["prettier-plugin-tailwindcss"],
    tabWidth: 4,
    trailingComma: "all",
};
