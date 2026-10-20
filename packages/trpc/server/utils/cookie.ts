import type { CookieOptions, Response, Request } from "express";

import type { TRPCContext } from "../context";

// time constants
const ONE_MINUTE = 60 * 1000; // milliseconds
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_WEEK = 7 * ONE_DAY;

// default cookie options
const defaultCookieOptions: CookieOptions = {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: ONE_HOUR,
};

// * Authentication Cookie Factory

// cookie factory
export function createCookieFactory(res: Response) {
    return function createCookie(
        name: string,
        value: string,
        options: CookieOptions = defaultCookieOptions,
    ) {
        res.cookie(name, value, options);
    };
}

// create cookie factory type
export type CreateCookieFactory = typeof createCookieFactory;

// get cookie factory
export function getCookieFactory(req: Request) {
    return function getCookie(name: string) {
        const parsedCookies = req.cookies as Record<string, string> | undefined;
        const parsedValue = parsedCookies?.[name];
        if (parsedValue !== undefined) return parsedValue;

        const cookieHeader = req.headers.cookie;
        if (!cookieHeader) return undefined;

        for (const cookie of cookieHeader.split(";")) {
            const separatorIndex = cookie.indexOf("=");
            if (separatorIndex < 0) continue;

            const cookieName = cookie.slice(0, separatorIndex).trim();
            if (cookieName !== name) continue;

            const value = cookie.slice(separatorIndex + 1).trim();
            try {
                return decodeURIComponent(value);
            } catch {
                return value;
            }
        }
        return undefined;
    };
}

// get cookie factory type
export type GetCookieFactory = typeof getCookieFactory;

// clear cookie factory
export function clearCookieFactory(res: Response) {
    return function clearCookie(name: string) {
        res.clearCookie(name, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
    };
}

// clear cookie factory type
export type ClearCookieFactory = typeof clearCookieFactory;

// * Authentication Cookies

const AUTHENTICATION_COOKIE_NAME = "authentication-token";

// set authentication cookie
export function setAuthenticationCookie(ctx: TRPCContext, accessToken: string) {
    ctx.createCookie(AUTHENTICATION_COOKIE_NAME, accessToken);
}

// set authentication cookie type
export type SetAuthenticationCookie = typeof setAuthenticationCookie;

// get authentication cookie
export function getAuthenticationCookie(ctx: TRPCContext) {
    return ctx.getCookie(AUTHENTICATION_COOKIE_NAME);
}

// get authentication cookie type
export type GetAuthenticationCookie = typeof getAuthenticationCookie;

// clear authentication cookie
export function clearAuthenticationCookie(ctx: TRPCContext) {
    ctx.clearCookie(AUTHENTICATION_COOKIE_NAME);
}

// clear authentication cookie type
export type ClearAuthenticationCookie = typeof clearAuthenticationCookie;

// * Refresh Token Cookies

const REFRESH_TOKEN_COOKIE_NAME = "refresh-token";

// create refresh token cookie factory
export function createRefreshTokenCookieFactory(res: Response) {
    const createCookie = createCookieFactory(res);

    return function setRefreshTokenCookieValue(refreshToken: string) {
        createCookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
            ...defaultCookieOptions,
            maxAge: ONE_WEEK,
        });
    };
}

// create refresh token cookie factory type
export type CreateRefreshTokenCookieFactory =
    typeof createRefreshTokenCookieFactory;

// get refresh token cookie factory
export function getRefreshTokenCookieFactory(req: Request) {
    const getCookie = getCookieFactory(req);

    return function readRefreshTokenCookie() {
        return getCookie(REFRESH_TOKEN_COOKIE_NAME);
    };
}

// get refresh token cookie factory type
export type GetRefreshTokenCookieFactory = typeof getRefreshTokenCookieFactory;

// clear refresh token cookie factory
export function clearRefreshTokenCookieFactory(res: Response) {
    const clearCookie = clearCookieFactory(res);

    return function removeRefreshTokenCookie() {
        clearCookie(REFRESH_TOKEN_COOKIE_NAME);
    };
}

// clear refresh token cookie factory type
export type ClearRefreshTokenCookieFactory =
    typeof clearRefreshTokenCookieFactory;

// set refresh token cookie
export function setRefreshTokenCookie(ctx: TRPCContext, refreshToken: string) {
    ctx.setRefreshTokenCookie(refreshToken);
}

// set refresh token cookie type
export type SetRefreshTokenCookie = typeof setRefreshTokenCookie;

// get refresh token cookie
export function getRefreshTokenCookie(ctx: TRPCContext) {
    return ctx.getRefreshTokenCookie();
}

// get refresh token cookie type
export type GetRefreshTokenCookie = typeof getRefreshTokenCookie;

// clear refresh token cookie
export function clearRefreshTokenCookie(ctx: TRPCContext) {
    ctx.clearRefreshTokenCookie();
}

// clear refresh token cookie type
export type ClearRefreshTokenCookie = typeof clearRefreshTokenCookie;
