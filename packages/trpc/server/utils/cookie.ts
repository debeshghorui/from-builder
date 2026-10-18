import type { CookieOptions, Response, Request } from "express";

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

export function getCookieFactory(req: Request) {
    return function getCookie(name: string) {
        return req.cookies?.[name];
    };
}

export function clearCookieFactory(res: Response) {
    return function clearCookie(name: string) {
        res.clearCookie(name);
    };
}
