import * as jwt from "jsonwebtoken";
import { randomBytes, createHmac } from "node:crypto";

import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/models/user";

import {
    CreateUserWithEmailAndPasswordInputType,
    CreateUserWithEmailAndPasswordInputSchema,
    UserTokenPayloadType,
    UserTokenPayloadSchema,
} from "./model";
import { env } from "../env";

class UserService {
    private async getUserByEmail(email: string) {
        const user = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

        if (!user || user.length === 0) return null;
        return user[0];
    }

    private async generateUserToken(payload: UserTokenPayloadType) {
        const { id, email, profileImageUrl } =
            await UserTokenPayloadSchema.parseAsync(payload);
        const token = jwt.sign({ id, email, profileImageUrl }, env.JWT_SECRET, {
            expiresIn: "1h",
        });
        const refreshToken = jwt.sign(
            { id, email, profileImageUrl },
            env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" },
        );

        return {
            token,
            refreshToken,
        };
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
        const hash = createHmac("sha256", salt).update(password).digest("hex");

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
            profileImageUrl,
        });

        return {
            id: userId,
            token,
            refreshToken,
        };
    }
}

export default UserService;
