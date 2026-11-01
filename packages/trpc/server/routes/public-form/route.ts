import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { formAccessService } from "../../services";
import { formResponsesService } from "../../services";
import { publicProcedure, router } from "../../trpc";
import {
    getPublishedFlowInputSchema,
    publicFormInputSchema,
    verifyFormPasswordInputSchema,
} from "@repo/services/form-access/model";
import { submitFormResponseSchema } from "@repo/services/form-responses/model";

export const publicFormRouter = router({
    getPublishedForm: publicProcedure
        .input(publicFormInputSchema)
        .output(
            z.object({
                id: z.string().uuid(),
                title: z.string(),
                description: z.string().nullable(),
                isProtected: z.boolean(),
                collectEmail: z.boolean(),
                allowAnonymous: z.boolean(),
                responseLimit: z.number().nullable(),
                passwordRequired: z.boolean(),
            }),
        )
        .query(({ input }) => formAccessService.getPublishedForm(input)),

    verifyPassword: publicProcedure
        .input(verifyFormPasswordInputSchema)
        .output(z.object({ accessToken: z.string() }))
        .mutation(async ({ input }) => {
            try {
                return await formAccessService.verifyPassword(input);
            } catch (error) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message:
                        error instanceof Error
                            ? error.message
                            : "Could not verify form password",
                });
            }
        }),

    getPublishedFlow: publicProcedure
        .input(getPublishedFlowInputSchema)
        .output(
            z.object({
                startPageId: z.string().uuid().nullable(),
                flowVersion: z.string(),
                pages: z.array(
                    z.object({
                        id: z.string().uuid(),
                        title: z.string(),
                        fields: z.array(
                            z.object({
                                id: z.string().uuid(),
                                label: z.string(),
                                description: z.string().nullable(),
                                placeholder: z.string().nullable(),
                                isRequired: z.boolean(),
                                type: z.enum([
                                    "TEXT",
                                    "NUMBER",
                                    "EMAIL",
                                    "PHONE",
                                    "YES_NO",
                                    "PASSWORD",
                                ]),
                                options: z.unknown().nullable(),
                            }),
                        ),
                    }),
                ),
                connections: z.array(
                    z.object({
                        id: z.string().uuid(),
                        sourcePageId: z.string().uuid(),
                        targetPageId: z.string().uuid(),
                        condition: z.unknown().nullable(),
                    }),
                ),
            }),
        )
        .query(async ({ input }) => {
            try {
                return await formAccessService.getPublishedFlow(input);
            } catch (error) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message:
                        error instanceof Error
                            ? error.message
                            : "Form access is not available",
                });
            }
        }),

    submitResponse: publicProcedure
        .input(
            submitFormResponseSchema.extend({
                accessToken: z.string().optional(),
            }),
        )
        .output(z.object({ id: z.string().uuid() }))
        .mutation(async ({ input }) => {
            try {
                const form = await formAccessService.getPublishedForm({
                    formId: input.formId,
                });
                if (form.isProtected) {
                    if (!input.accessToken)
                        throw new Error(
                            "Enter the form password before submitting",
                        );
                    formAccessService.verifyAccessToken(
                        input.formId,
                        input.accessToken,
                    );
                }
                return await formResponsesService.submit({
                    formId: input.formId,
                    email: input.email,
                    answers: input.answers,
                    flowVersion: input.flowVersion,
                    visitedPageIds: input.visitedPageIds,
                });
            } catch (error) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message:
                        error instanceof Error
                            ? error.message
                            : "Could not submit form response",
                });
            }
        }),
});
