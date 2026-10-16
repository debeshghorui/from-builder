import { httpLink, httpBatchStreamLink } from "@repo/trpc/client";
import { env } from "~/env.js";

interface CreateTRPCHttpBatchClientClientOpts {
    enableStreaming?: boolean;
}

export const createTRPCHttpBatchClientClient = (
    opts?: CreateTRPCHttpBatchClientClientOpts,
) => {
    const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;
    return c({
        // This client is also used during Next.js server rendering, where fetch
        // cannot resolve a relative URL. The API runs on port 8000 in dev.
        url: env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/trpc",
        fetch(url, options) {
            return fetch(url, {
                ...options,
                credentials: "include",
            });
        },
    });
};
