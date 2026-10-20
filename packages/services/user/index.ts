import * as jwt from "jsonwebtoken";
import {
    randomBytes,
    createHash,
    createHmac,
    scrypt,
    timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { logger } from "@repo/logger";

import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/models/user";

import {
    CreateUserWithEmailAndPasswordInputType,
    CreateUserWithEmailAndPasswordInputSchema,
    UserTokenPayloadType,
    UserTokenPayloadSchema,
    SignInUserWithEmailAndPasswordInputType,
    signInUserWithEmailAndPasswordInputSchema,
    RefreshUserTokenInputSchema,
    RefreshUserTokenOutputSchema,
    RefreshUserTokenInputType,
    RefreshUserTokenOutputType,
} from "./model";
import { env } from "../env";

class UserService {
    private readonly scryptAsync = promisify(scrypt);

    private async getUserByEmail(email: string) {
        const user = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

        if (!user || user.length === 0) return null;
        return user[0];
    }

    private async generateUserToken(payload: UserTokenPayloadType) {
        const { id, email } = await UserTokenPayloadSchema.parseAsync(payload);
        const token = jwt.sign({ id, email }, env.JWT_SECRET, {
            expiresIn: "1h",
        });
        const refreshToken = jwt.sign({ id, email }, env.JWT_REFRESH_SECRET, {
            expiresIn: "7d",
        });

        return {
            token,
            refreshToken,
        };
    }

    private async verifyUserToken(
        token: string,
    ): Promise<UserTokenPayloadType> {
        try {
            const verificationResult = jwt.verify(
                token,
                env.JWT_SECRET,
            ) as UserTokenPayloadType;
            return verificationResult;
        } catch (error) {
            logger.error(`Error verifying and decoding user token: ${error}`);
            throw new Error("Invalid token");
        }
    }

    private async verifyRefreshToken(
        token: string,
    ): Promise<UserTokenPayloadType> {
        try {
            const payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
            return await UserTokenPayloadSchema.parseAsync(payload);
        } catch (error) {
            logger.error(`Error verifying refresh token: ${error}`);
            throw new Error("Invalid refresh token");
        }
    }

    private async generateHashed(password: string, salt: string) {
        const hash = (await this.scryptAsync(password, salt, 64)) as Buffer;
        return hash.toString("hex");
    }

    private hashRefreshToken(token: string) {
        return createHash("sha256").update(token).digest("hex");
    }

    private async saveRefreshToken(userId: string, refreshToken: string) {
        await db
            .update(usersTable)
            .set({ refreshTokenHash: this.hashRefreshToken(refreshToken) })
            .where(eq(usersTable.id, userId));
    }

    public async getUserInfoById(id: string) {
        const user = await db
            .select({
                id: usersTable.id,
                firstName: usersTable.firstName,
                lastName: usersTable.lastName,
                email: usersTable.email,
                profileImageUrl: usersTable.profileImageUrl,
            })
            .from(usersTable)
            .where(eq(usersTable.id, id));

        const userInfo = user[0];
        if (!userInfo) throw new Error(`User with ID ${id} dose not exists`);

        return userInfo;
    }

    public async createUserWithEmailAndPassword(
        payload: CreateUserWithEmailAndPasswordInputType,
    ) {
        const { firstName, lastName, email, password, profileImageUrl } =
            await CreateUserWithEmailAndPasswordInputSchema.parseAsync(payload);

        // Check if user with email already exists
        const existingUserWithEmail = await this.getUserByEmail(email);
        if (existingUserWithEmail)
            throw new Error("User with email already exists");

        // Generate salt and hash password
        const salt = randomBytes(16).toString("hex");
        const hash = await this.generateHashed(password, salt);

        // Insert user into database
        const userInsertResult = await db
            .insert(usersTable)
            .values({
                firstName,
                lastName,
                email,
                passwordHash: hash,
                passwordSalt: salt,
                profileImageUrl,
            })
            .returning({
                id: usersTable.id,
            });

        if (
            !userInsertResult ||
            userInsertResult.length === 0 ||
            !userInsertResult[0]?.id
        )
            throw new Error("Failed to create user");

        const userId = userInsertResult[0].id;

        // Generate user token
        const { token, refreshToken } = await this.generateUserToken({
            id: userId,
            email,
        });
        await this.saveRefreshToken(userId, refreshToken);

        return {
            id: userId,
            token,
            refreshToken,
        };
    }

    public async signInUserWithEmailAndPassword(
        payload: SignInUserWithEmailAndPasswordInputType,
    ) {
        const { email, password } =
            await signInUserWithEmailAndPasswordInputSchema.parseAsync(payload);

        // Check if user with email already exists
        const existingUserWithEmail = await this.getUserByEmail(email);
        if (!existingUserWithEmail)
            throw new Error(`User with email ${email} does not exist`);

        // Check if user has a password hash and salt
        if (
            !existingUserWithEmail.passwordHash ||
            !existingUserWithEmail.passwordSalt
        )
            throw new Error(`Invalid authentication method`);

        // Check if password is correct
        const savedHash = existingUserWithEmail.passwordHash;
        const salt = existingUserWithEmail.passwordSalt;
        let hash: string;
        if (/^[a-f0-9]{64}$/i.test(savedHash) && /^[a-f0-9]{32}$/i.test(salt)) {
            // Upgrade passwords created by the previous SHA-256 HMAC scheme.
            hash = createHmac("sha256", salt).update(password).digest("hex");
            if (
                !timingSafeEqual(
                    Buffer.from(hash, "hex"),
                    Buffer.from(savedHash, "hex"),
                )
            )
                throw new Error("Invalid Email address or password");
            const newSalt = randomBytes(16).toString("hex");
            const newHash = await this.generateHashed(password, newSalt);
            await db
                .update(usersTable)
                .set({ passwordHash: newHash, passwordSalt: newSalt })
                .where(eq(usersTable.id, existingUserWithEmail.id));
        } else {
            hash = await this.generateHashed(password, salt);
            const expected = Buffer.from(savedHash, "hex");
            const actual = Buffer.from(hash, "hex");
            if (
                expected.length !== actual.length ||
                !timingSafeEqual(actual, expected)
            )
                throw new Error("Invalid Email address or password");
        }
        // Generate user token
        const { token, refreshToken } = await this.generateUserToken({
            id: existingUserWithEmail.id,
            email: existingUserWithEmail.email,
        });
        await this.saveRefreshToken(existingUserWithEmail.id, refreshToken);

        return {
            id: existingUserWithEmail.id,
            token,
            refreshToken,
        };
    }

    public async verifyAndDecodeUserToken(token: string) {
        const { id } = await this.verifyUserToken(token);
        return { id };
    }

    public async refreshUserToken(
        payload: RefreshUserTokenInputType,
    ): Promise<RefreshUserTokenOutputType> {
        const { refreshToken } =
            await RefreshUserTokenInputSchema.parseAsync(payload);
        const { id, email } = await this.verifyRefreshToken(refreshToken);
        const user = await this.getUserByEmail(email);

        if (
            !user ||
            user.id !== id ||
            !user.refreshTokenHash ||
            this.hashRefreshToken(refreshToken) !== user.refreshTokenHash
        ) {
            throw new Error("Invalid refresh token");
        }

        const tokens = await this.generateUserToken({ id, email });
        await this.saveRefreshToken(id, tokens.refreshToken);
        return await RefreshUserTokenOutputSchema.parseAsync({ id, ...tokens });
    }

    public async revokeRefreshToken(refreshToken?: string) {
        if (!refreshToken) return;
        try {
            const { id, email } = await this.verifyRefreshToken(refreshToken);
            const user = await this.getUserByEmail(email);
            if (
                user?.id === id &&
                user.refreshTokenHash === this.hashRefreshToken(refreshToken)
            ) {
                await db
                    .update(usersTable)
                    .set({ refreshTokenHash: null })
                    .where(eq(usersTable.id, id));
            }
        } catch {
            // Logout is idempotent, including for expired or invalid tokens.
        }
    }
}

export default UserService;
