import { httpLink, httpBatchStreamLink } from "@repo/trpc/client";
import { env } from "~/env.js";

interface CreateTRPCHttpBatchClientClientOpts {
    enableStreaming?: boolean;
}

export const createTRPCHttpBatchClientClient = (
    opts?: CreateTRPCHttpBatchClientClientOpts,
) => {
    const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;
    const apiUrl = env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/trpc";
    let refreshPromise: Promise<boolean> | undefined;

    const refreshSession = async () => {
        refreshPromise ??= fetch(`${apiUrl}/auth.refreshUserToken`, {
            method: "POST",
            credentials: "include",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ json: {} }),
        })
            .then((response) => response.ok)
            .catch(() => false)
            .finally(() => {
                refreshPromise = undefined;
            });

        return refreshPromise;
    };

    return c({
        // This client is also used during Next.js server rendering, where fetch
        // cannot resolve a relative URL. The API runs on port 8000 in dev.
        url: apiUrl,
        async fetch(url, options) {
            const response = await fetch(url, {
                ...options,
                credentials: "include",
            });

            if (typeof window === "undefined" || response.status !== 401) {
                return response;
            }

            const refreshed = await refreshSession();
            if (refreshed) {
                return fetch(url, {
                    ...options,
                    credentials: "include",
                });
            }

            if (window.location.pathname !== "/signin") {
                window.location.assign("/signin");
            }

            return response;
        },
    });
};
