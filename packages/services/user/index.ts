import { randomBytes, createHmac } from "node:crypto";

import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/models/user";

import {
    CreateUserWithEmailAndPasswordInputType,
    CreateUserWithEmailAndPasswordInputSchema,
} from "./model";

class UserService {
    private async getUserByEmail(email: string) {
        const user = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

        if (!user || user.length === 0) return null;
        return user[0];
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

        if (!userInsertResult || userInsertResult.length === 0)
            throw new Error("Failed to create user");

        return {
            id: userInsertResult[0]?.id,
        };
    }
}

export default UserService;
