import type { CookieOptions, Response, Request } from "express";

import { TRPCContext } from "../context";

// time constants
const ONE_MINUTE = 60 * 1000; // milliseconds
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_WEEK = 7 * ONE_DAY;
const ONE_MONTH = 4 * ONE_WEEK;
const ONE_YEAR = 12 * ONE_MONTH;

// default cookie options
const defaultCookieOptions: CookieOptions = {
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: ONE_YEAR,
};

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
        return req.cookies?.[name];
    };
}

// get cookie factory type
export type GetCookieFactory = typeof getCookieFactory;

// clear cookie factory
export function clearCookieFactory(res: Response) {
    return function clearCookie(name: string) {
        res.clearCookie(name);
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
