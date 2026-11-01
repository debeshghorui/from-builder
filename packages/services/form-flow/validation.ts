import { createHash } from "node:crypto";

type Page = {
    id: string;
    title: string;
    isStart: boolean;
};

type Connection = {
    id: string;
    sourcePageId: string;
    targetPageId: string;
    condition: unknown;
};

type Field = {
    id: string;
    pageId: string | null;
    label: string;
    description: string | null;
    placeholder: string | null;
    type: string;
    isRequired: boolean;
    options: unknown;
};

type AnswerMap = Record<string, unknown>;

function asCondition(value: unknown) {
    if (!value || typeof value !== "object") return null;
    const candidate = value as {
        fieldId?: unknown;
        operator?: unknown;
        value?: unknown;
    };
    if (
        typeof candidate.fieldId !== "string" ||
        candidate.operator !== "equals"
    ) {
        return null;
    }
    return {
        fieldId: candidate.fieldId,
        operator: "equals" as const,
        value: candidate.value,
    };
}

export function getFlowVersion(
    pages: Page[],
    connections: Connection[],
    fields: Field[],
) {
    const stableSnapshot = {
        pages: pages
            .map(({ id, title, isStart }) => ({ id, title, isStart }))
            .sort((a, b) => a.id.localeCompare(b.id)),
        connections: connections
            .map(({ id, sourcePageId, targetPageId, condition }) => ({
                id,
                sourcePageId,
                targetPageId,
                condition,
            }))
            .sort((a, b) => a.id.localeCompare(b.id)),
        fields: fields
            .map(
                ({
                    id,
                    pageId,
                    label,
                    description,
                    placeholder,
                    type,
                    isRequired,
                    options,
                }) => ({
                    id,
                    pageId,
                    label,
                    description,
                    placeholder,
                    type,
                    isRequired,
                    options,
                }),
            )
            .sort((a, b) => a.id.localeCompare(b.id)),
    };
    return createHash("sha256")
        .update(JSON.stringify(stableSnapshot))
        .digest("hex");
}

function resolveNextPage(
    pageId: string,
    connections: Connection[],
    answers: AnswerMap,
) {
    const outgoing = connections.filter(
        (connection) => connection.sourcePageId === pageId,
    );
    const matching = outgoing.filter((connection) => {
        const condition = asCondition(connection.condition);
        if (!condition || answers[condition.fieldId] === undefined)
            return false;
        return String(answers[condition.fieldId]) === String(condition.value);
    });
    const targets = new Set(matching.map(({ targetPageId }) => targetPageId));
    if (targets.size > 1)
        throw new Error("More than one route matches this page's answers");
    if (matching[0]) return matching[0].targetPageId;
    return (
        outgoing.find((connection) => connection.condition === null)
            ?.targetPageId ?? null
    );
}

function validateAnswerValue(field: Field, value: unknown) {
    if (
        typeof value !== "string" &&
        typeof value !== "number" &&
        typeof value !== "boolean"
    )
        throw new Error(`Answer for “${field.label}” must be a single value`);
    if (field.type === "NUMBER" && !Number.isFinite(Number(value)))
        throw new Error(`Answer for “${field.label}” must be a number`);
    if (
        field.type === "EMAIL" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))
    )
        throw new Error(`Answer for “${field.label}” must be a valid email`);
    if (
        field.type === "YES_NO" &&
        !["Yes", "No", "true", "false"].includes(String(value))
    )
        throw new Error(`Answer for “${field.label}” must be Yes or No`);
}

export function validateSubmissionPath(input: {
    pages: Page[];
    connections: Connection[];
    fields: Field[];
    visitedPageIds: string[];
    answers: AnswerMap;
}) {
    const { pages, connections, fields, visitedPageIds, answers } = input;
    const start = pages.find((page) => page.isStart);
    if (!start) throw new Error("This form has no starting page");
    if (visitedPageIds[0] !== start.id)
        throw new Error("The response must begin at the form's start page");

    const pagesById = new Map(pages.map((page) => [page.id, page]));
    const visited = new Set(visitedPageIds);
    if (visitedPageIds.some((id) => !pagesById.has(id)))
        throw new Error("The response path contains a page outside this form");

    const visitedFields = fields.filter(
        (field) => field.pageId && visited.has(field.pageId),
    );
    const fieldById = new Map(visitedFields.map((field) => [field.id, field]));
    for (const fieldId of Object.keys(answers)) {
        if (!fieldById.has(fieldId))
            throw new Error(
                "The response contains an answer from an unvisited page",
            );
    }

    for (const field of visitedFields) {
        const answer = answers[field.id];
        if (
            field.isRequired &&
            (answer === undefined || String(answer).trim() === "")
        )
            throw new Error(`Answer “${field.label}” is required`);
        if (answer !== undefined) validateAnswerValue(field, answer);
    }

    for (let index = 0; index < visitedPageIds.length - 1; index += 1) {
        const pageId = visitedPageIds[index];
        const nextPageId = visitedPageIds[index + 1];
        if (!pageId || !nextPageId) continue;
        const expected = resolveNextPage(pageId, connections, answers);
        if (expected !== nextPageId)
            throw new Error(
                "The response path does not match the configured page flow",
            );
    }

    const lastPageId = visitedPageIds[visitedPageIds.length - 1];
    if (
        lastPageId &&
        resolveNextPage(lastPageId, connections, answers) !== null
    )
        throw new Error("Continue through the next page before submitting");
}
