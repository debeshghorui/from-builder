import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

import {
    createCookieFactory,
    type CreateCookieFactory,
    getCookieFactory,
    type GetCookieFactory,
    clearCookieFactory,
    type ClearCookieFactory,
} from "./utils/cookie";

export interface TRPCCtxUser {
    id: string;
}

// context interface
export interface TRPCContext {
    createCookie: ReturnType<CreateCookieFactory>;
    getCookie: ReturnType<GetCookieFactory>;
    clearCookie: ReturnType<ClearCookieFactory>;
    user?: TRPCCtxUser | null;
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
        user: undefined,
    };

    return ctx;
}

// export context type
export type Context = Awaited<ReturnType<typeof createContext>>;
