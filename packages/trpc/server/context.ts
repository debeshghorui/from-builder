import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

import {
    createCookieFactory,
    type CreateCookieFactory,
    getCookieFactory,
    type GetCookieFactory,
    clearCookieFactory,
    type ClearCookieFactory,
} from "./utils/cookie";

// context interface
export interface TRPCContext {
    createCookie: ReturnType<CreateCookieFactory>;
    getCookie: ReturnType<GetCookieFactory>;
    clearCookie: ReturnType<ClearCookieFactory>;
}

// create context
export async function createContext({
    req,
    res,
}: CreateExpressContextOptions): Promise<TRPCContext> {
    const ctx: TRPCContext = {
        createCookie: createCookieFactory(res),
        getCookie: getCookieFactory(req),
        clearCookie: clearCookieFactory(res),
    };

    return ctx;
}

// export context type
export type Context = Awaited<ReturnType<typeof createContext>>;
