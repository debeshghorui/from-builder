import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

import {
    createCookieFactory,
    type CreateCookieFactory,
    getCookieFactory,
    type GetCookieFactory,
    clearCookieFactory,
    type ClearCookieFactory,
    createRefreshTokenCookieFactory,
    type CreateRefreshTokenCookieFactory,
    getRefreshTokenCookieFactory,
    type GetRefreshTokenCookieFactory,
    clearRefreshTokenCookieFactory,
    type ClearRefreshTokenCookieFactory,
} from "./utils/cookie";

export interface TRPCCtxUser {
    id: string;
}

// context interface
export interface TRPCContext {
    createCookie: ReturnType<CreateCookieFactory>;
    getCookie: ReturnType<GetCookieFactory>;
    clearCookie: ReturnType<ClearCookieFactory>;
    setRefreshTokenCookie: ReturnType<CreateRefreshTokenCookieFactory>;
    getRefreshTokenCookie: ReturnType<GetRefreshTokenCookieFactory>;
    clearRefreshTokenCookie: ReturnType<ClearRefreshTokenCookieFactory>;
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
        setRefreshTokenCookie: createRefreshTokenCookieFactory(res),
        getRefreshTokenCookie: getRefreshTokenCookieFactory(req),
        clearRefreshTokenCookie: clearRefreshTokenCookieFactory(res),
        user: undefined,
    };

    return ctx;
}

// export context type
export type Context = Awaited<ReturnType<typeof createContext>>;
