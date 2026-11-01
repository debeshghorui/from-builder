"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { ArrowDownRight, ArrowRight, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
    useGetFormFields,
    useGetFormFlow,
    useSaveFormFlow,
} from "~/hooks/api/form";

type FlowPage = {
    id: string;
    title: string;
    index: number;
    positionX: number;
    positionY: number;
    isStart: boolean;
};

type RouteCondition = {
    fieldId: string;
    operator: "equals";
    value: string;
};

type FlowConnection = {
    id: string;
    sourcePageId: string;
    targetPageId: string;
    condition: RouteCondition | null;
};

type PointerDrag = {
    pageId: string;
    pointerId: number;
    offsetX: number;
    offsetY: number;
};

const pageWidth = 236;
const pageHeight = 142;
const canvasWidth = 1280;
const canvasHeight = 700;

function newId() {
    return crypto.randomUUID();
}

function positionFor(index: number) {
    return {
        positionX: 72 + (index % 3) * 350,
        positionY: 64 + Math.floor(index / 3) * 210,
    };
}

function connectionPath(source: FlowPage, target: FlowPage) {
    const startX = source.positionX + pageWidth;
    const startY = source.positionY + 70;
    const endX = target.positionX;
    const endY = target.positionY + 70;
    const curve = Math.max(70, Math.abs(endX - startX) / 2);
    return `M ${startX} ${startY} C ${startX + curve} ${startY}, ${endX - curve} ${endY}, ${endX} ${endY}`;
}

export function FlowCanvas({ formId }: { formId: string }) {
    const flowQuery = useGetFormFlow(formId);
    const fieldsQuery = useGetFormFields(formId);
    const saveFlow = useSaveFormFlow();
    const [pages, setPages] = useState<FlowPage[]>([]);
    const [connections, setConnections] = useState<FlowConnection[]>([]);
    const [connectFrom, setConnectFrom] = useState<string | null>(null);
    const [connectionSourceId, setConnectionSourceId] = useState("");
    const [connectionTargetId, setConnectionTargetId] = useState("");
    const [drag, setDrag] = useState<PointerDrag | null>(null);
    const [dirty, setDirty] = useState(false);
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!flowQuery.flow || dirty) return;
        setPages(flowQuery.flow.pages);
        setConnections(
            flowQuery.flow.connections.map((connection) => ({
                ...connection,
                condition: connection.condition as RouteCondition | null,
            })),
        );
    }, [dirty, flowQuery.flow]);

    const pageById = useMemo(
        () => new Map(pages.map((page) => [page.id, page])),
        [pages],
    );

    const addPage = () => {
        const position = positionFor(pages.length);
        const id = newId();
        setPages((current) => [
            ...current,
            {
                id,
                title: `Page ${current.length + 1}`,
                index: current.length,
                ...position,
                isStart: current.length === 0,
            },
        ]);
        setDirty(true);
    };

    const updatePage = (id: string, update: Partial<FlowPage>) => {
        setPages((current) =>
            current.map((page) => ({
                ...page,
                ...(update.isStart ? { isStart: false } : {}),
                ...(page.id === id ? update : {}),
            })),
        );
        setDirty(true);
    };

    const removePage = (id: string) => {
        const hasFields = fieldsQuery.formFields?.some(
            (field) => (field as { pageId?: string | null }).pageId === id,
        );
        if (hasFields) {
            toast.error("Move this page's questions before removing it.");
            return;
        }
        const remaining = pages.filter((page) => page.id !== id);
        if (remaining.length === 0) {
            toast.error("A form needs at least one page.");
            return;
        }
        if (pages.find((page) => page.id === id)?.isStart)
            remaining[0] = { ...remaining[0]!, isStart: true };
        setPages(remaining.map((page, index) => ({ ...page, index })));
        setConnections((current) =>
            current.filter(
                (connection) =>
                    connection.sourcePageId !== id &&
                    connection.targetPageId !== id,
            ),
        );
        setDirty(true);
    };

    const addConnection = (sourcePageId: string, targetPageId: string) => {
        if (sourcePageId === targetPageId) {
            toast.error("A page cannot connect to itself.");
            return;
        }
        if (
            connections.some(
                (connection) =>
                    connection.sourcePageId === sourcePageId &&
                    connection.condition === null,
            )
        ) {
            toast.error("This page already has a default next connection.");
            return;
        }
        setConnections((current) => [
            ...current,
            {
                id: newId(),
                sourcePageId,
                targetPageId,
                condition: null,
            },
        ]);
        setDirty(true);
        setConnectFrom(null);
    };

    const addConnectionFromControls = () => {
        const sourcePageId = connectionSourceId || pages[0]?.id;
        const targetPageId = connectionTargetId || pages[1]?.id;
        if (sourcePageId && targetPageId)
            addConnection(sourcePageId, targetPageId);
    };

    const save = async () => {
        try {
            await saveFlow.saveFormFlowAsync({
                formId,
                pages,
                connections,
            });
            setDirty(false);
            toast.success("Form flow saved");
        } catch {
            // The mutation hook reports the actionable server error.
        }
    };

    const startPageDrag = (
        event: PointerEvent<HTMLButtonElement>,
        page: FlowPage,
    ) => {
        const bounds = canvasRef.current?.getBoundingClientRect();
        if (!bounds) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        setDrag({
            pageId: page.id,
            pointerId: event.pointerId,
            offsetX: event.clientX - bounds.left - page.positionX,
            offsetY: event.clientY - bounds.top - page.positionY,
        });
    };

    const movePage = (event: PointerEvent<HTMLDivElement>) => {
        if (!drag || drag.pointerId !== event.pointerId) return;
        const bounds = canvasRef.current?.getBoundingClientRect();
        if (!bounds) return;
        const x = Math.max(
            16,
            Math.min(
                canvasWidth - pageWidth - 16,
                Math.round(event.clientX - bounds.left - drag.offsetX),
            ),
        );
        const y = Math.max(
            16,
            Math.min(
                canvasHeight - pageHeight - 16,
                Math.round(event.clientY - bounds.top - drag.offsetY),
            ),
        );
        setPages((current) =>
            current.map((page) =>
                page.id === drag.pageId
                    ? { ...page, positionX: x, positionY: y }
                    : page,
            ),
        );
        setDirty(true);
    };

    const conditionalFields = fieldsQuery.formFields ?? [];

    if (flowQuery.isPending)
        return <div className="card-chai p-8 text-sm">Loading page flow…</div>;
    if (flowQuery.isError)
        return (
            <div className="card-chai p-6 text-sm">
                <p className="text-destructive">{flowQuery.error?.message}</p>
                <Button
                    className="mt-3"
                    variant="outline"
                    onClick={() => void flowQuery.refetch()}
                >
                    Try again
                </Button>
            </div>
        );

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold">Page flow</h2>
                    <p className="text-muted-foreground text-sm">
                        Connect page nodes to define the respondent journey.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={addPage}>
                        <Plus aria-hidden="true" /> Add page
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() =>
                            setConnectFrom((current) => (current ? null : ""))
                        }
                        disabled={pages.length < 2}
                    >
                        <ArrowRight aria-hidden="true" />
                        {connectFrom !== null
                            ? "Cancel connection"
                            : "Connect pages"}
                    </Button>
                    <Button
                        onClick={() => void save()}
                        disabled={!dirty || saveFlow.isPending}
                    >
                        <Save aria-hidden="true" />
                        {saveFlow.isPending ? "Saving…" : "Save flow"}
                    </Button>
                </div>
            </div>

            {pages.length > 1 && (
                <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-black/10 p-3">
                    <label className="sr-only" htmlFor="connection-source">
                        From page
                    </label>
                    <select
                        id="connection-source"
                        className="bg-background h-9 rounded-md border px-3 text-sm"
                        aria-label="Connection source page"
                        value={connectionSourceId || pages[0]?.id}
                        onChange={(event) =>
                            setConnectionSourceId(event.target.value)
                        }
                    >
                        {pages.map((page) => (
                            <option key={page.id} value={page.id}>
                                {page.title}
                            </option>
                        ))}
                    </select>
                    <ArrowRight
                        size={16}
                        className="text-brand"
                        aria-hidden="true"
                    />
                    <label className="sr-only" htmlFor="connection-target">
                        To page
                    </label>
                    <select
                        id="connection-target"
                        className="bg-background h-9 rounded-md border px-3 text-sm"
                        aria-label="Connection destination page"
                        value={connectionTargetId || pages[1]?.id}
                        onChange={(event) =>
                            setConnectionTargetId(event.target.value)
                        }
                    >
                        {pages.map((page) => (
                            <option key={page.id} value={page.id}>
                                {page.title}
                            </option>
                        ))}
                    </select>
                    <Button
                        variant="outline"
                        onClick={addConnectionFromControls}
                    >
                        <Plus aria-hidden="true" /> Add default connection
                    </Button>
                </div>
            )}

            {connectFrom !== null && (
                <div className="border-brand/25 bg-brand/5 text-muted-foreground rounded-xl border px-4 py-3 text-sm">
                    {connectFrom
                        ? "Choose a destination page to connect."
                        : "Choose the source page, then choose its destination."}
                </div>
            )}

            {pages.length === 0 ? (
                <div className="card-chai flex min-h-72 flex-col items-center justify-center gap-3 p-8 text-center">
                    <div className="bg-brand/10 text-brand flex size-12 items-center justify-center rounded-2xl">
                        <ArrowDownRight aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold">
                        Start with your first page
                    </h3>
                    <p className="text-muted-foreground max-w-sm text-sm">
                        Add pages for each stage, then connect them or branch to
                        a page based on an answer.
                    </p>
                    <Button onClick={addPage}>
                        <Plus aria-hidden="true" /> Add first page
                    </Button>
                </div>
            ) : (
                <div className="overflow-auto rounded-2xl border border-white/10 bg-[#10100f]">
                    <div
                        ref={canvasRef}
                        className="relative"
                        style={{ width: canvasWidth, height: canvasHeight }}
                        onPointerMove={movePage}
                        onPointerUp={() => setDrag(null)}
                        onPointerCancel={() => setDrag(null)}
                    >
                        <svg
                            className="pointer-events-none absolute inset-0"
                            width={canvasWidth}
                            height={canvasHeight}
                            aria-hidden="true"
                        >
                            <defs>
                                <marker
                                    id="flow-arrow"
                                    markerWidth="10"
                                    markerHeight="10"
                                    refX="8"
                                    refY="5"
                                    orient="auto"
                                >
                                    <path
                                        d="M 0 0 L 10 5 L 0 10 z"
                                        fill="#a78bfa"
                                    />
                                </marker>
                            </defs>
                            {connections.map((connection) => {
                                const source = pageById.get(
                                    connection.sourcePageId,
                                );
                                const target = pageById.get(
                                    connection.targetPageId,
                                );
                                if (!source || !target) return null;
                                return (
                                    <path
                                        key={connection.id}
                                        d={connectionPath(source, target)}
                                        fill="none"
                                        stroke="#a78bfa"
                                        strokeWidth="2"
                                        markerEnd="url(#flow-arrow)"
                                    />
                                );
                            })}
                        </svg>

                        {pages.map((page) => {
                            const choosingSource = connectFrom === "";
                            const choosingTarget =
                                connectFrom !== null && connectFrom !== "";
                            return (
                                <article
                                    key={page.id}
                                    className={`absolute w-[236px] overflow-hidden rounded-xl border bg-[#191918] shadow-xl transition-shadow ${page.isStart ? "border-brand/70 shadow-brand/10" : "border-white/10"} ${connectFrom !== null ? "cursor-crosshair" : ""}`}
                                    style={{
                                        left: page.positionX,
                                        top: page.positionY,
                                    }}
                                    onClick={() => {
                                        if (choosingSource)
                                            setConnectFrom(page.id);
                                        else if (
                                            choosingTarget &&
                                            connectFrom !== page.id
                                        )
                                            addConnection(connectFrom, page.id);
                                    }}
                                >
                                    <header className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
                                        <button
                                            type="button"
                                            aria-label={`Move ${page.title}`}
                                            className="text-muted-foreground hover:text-foreground cursor-grab touch-none rounded p-1 active:cursor-grabbing"
                                            onPointerDown={(event) =>
                                                startPageDrag(event, page)
                                            }
                                            onClick={(event) =>
                                                event.stopPropagation()
                                            }
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="block leading-none"
                                            >
                                                ⠿
                                            </span>
                                        </button>
                                        <input
                                            aria-label="Page name"
                                            className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none"
                                            value={page.title}
                                            onChange={(event) =>
                                                updatePage(page.id, {
                                                    title: event.target.value,
                                                })
                                            }
                                            onClick={(event) =>
                                                event.stopPropagation()
                                            }
                                        />
                                        <button
                                            type="button"
                                            className="text-muted-foreground hover:text-destructive rounded p-1"
                                            aria-label={`Remove ${page.title}`}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                removePage(page.id);
                                            }}
                                        >
                                            <Trash2
                                                size={15}
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </header>
                                    <div className="space-y-3 p-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground text-xs">
                                                {fieldsQuery.formFields?.filter(
                                                    (field) =>
                                                        (
                                                            field as {
                                                                pageId?:
                                                                    | string
                                                                    | null;
                                                            }
                                                        ).pageId === page.id,
                                                ).length ?? 0}{" "}
                                                questions
                                            </span>
                                            <button
                                                type="button"
                                                className={`rounded-full px-2 py-1 text-[11px] ${page.isStart ? "bg-brand/15 text-brand" : "text-muted-foreground hover:text-foreground bg-white/5"}`}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    updatePage(page.id, {
                                                        isStart: true,
                                                    });
                                                }}
                                            >
                                                {page.isStart
                                                    ? "Start page"
                                                    : "Set as start"}
                                            </button>
                                        </div>
                                        <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                            <span className="bg-brand size-2 rounded-full" />
                                            {connections.filter(
                                                (connection) =>
                                                    connection.sourcePageId ===
                                                    page.id,
                                            ).length
                                                ? `${connections.filter((connection) => connection.sourcePageId === page.id).length} outgoing route${connections.filter((connection) => connection.sourcePageId === page.id).length === 1 ? "" : "s"}`
                                                : "End of journey"}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            )}

            {connections.length > 0 && (
                <section className="card-chai space-y-3 p-4">
                    <div>
                        <h3 className="font-semibold">Connections</h3>
                        <p className="text-muted-foreground text-sm">
                            Add a question and matching answer to make a route
                            conditional.
                        </p>
                    </div>
                    <div className="space-y-2">
                        {connections.map((connection) => {
                            const source = pageById.get(
                                connection.sourcePageId,
                            );
                            return (
                                <div
                                    key={connection.id}
                                    className="grid gap-2 rounded-lg border border-white/10 p-3 md:grid-cols-[1fr_auto_1fr_1.2fr_1fr_auto] md:items-center"
                                >
                                    <select
                                        className="bg-background h-9 rounded-md border px-2 text-sm"
                                        aria-label="Connection source"
                                        value={connection.sourcePageId}
                                        onChange={(event) => {
                                            const sourcePageId =
                                                event.target.value;
                                            setConnections((current) =>
                                                current.map((item) =>
                                                    item.id === connection.id
                                                        ? {
                                                              ...item,
                                                              sourcePageId,
                                                              condition: null,
                                                          }
                                                        : item,
                                                ),
                                            );
                                            setDirty(true);
                                        }}
                                    >
                                        {pages.map((page) => (
                                            <option
                                                key={page.id}
                                                value={page.id}
                                            >
                                                {page.title}
                                            </option>
                                        ))}
                                    </select>
                                    <ArrowRight
                                        size={16}
                                        className="text-brand hidden md:block"
                                        aria-hidden="true"
                                    />
                                    <select
                                        className="bg-background h-9 rounded-md border px-2 text-sm"
                                        aria-label="Connection destination"
                                        value={connection.targetPageId}
                                        onChange={(event) => {
                                            setConnections((current) =>
                                                current.map((item) =>
                                                    item.id === connection.id
                                                        ? {
                                                              ...item,
                                                              targetPageId:
                                                                  event.target
                                                                      .value,
                                                          }
                                                        : item,
                                                ),
                                            );
                                            setDirty(true);
                                        }}
                                    >
                                        {pages.map((page) => (
                                            <option
                                                key={page.id}
                                                value={page.id}
                                            >
                                                {page.title}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        className="bg-background h-9 rounded-md border px-2 text-sm"
                                        aria-label="Route question"
                                        value={
                                            connection.condition?.fieldId ?? ""
                                        }
                                        onChange={(event) => {
                                            const fieldId = event.target.value;
                                            setConnections((current) =>
                                                current.map((item) =>
                                                    item.id === connection.id
                                                        ? {
                                                              ...item,
                                                              condition: fieldId
                                                                  ? {
                                                                        fieldId,
                                                                        operator:
                                                                            "equals",
                                                                        value: "",
                                                                    }
                                                                  : null,
                                                          }
                                                        : item,
                                                ),
                                            );
                                            setDirty(true);
                                        }}
                                    >
                                        <option value="">
                                            Default next page
                                        </option>
                                        {conditionalFields
                                            .filter(
                                                (field) =>
                                                    (
                                                        field as {
                                                            pageId?:
                                                                | string
                                                                | null;
                                                        }
                                                    ).pageId === source?.id,
                                            )
                                            .map((field) => (
                                                <option
                                                    key={field.id}
                                                    value={field.id}
                                                >
                                                    {field.label}
                                                </option>
                                            ))}
                                    </select>
                                    {connection.condition && (
                                        <input
                                            className="bg-background h-9 rounded-md border px-2 text-sm"
                                            aria-label="Matching answer"
                                            placeholder="Answer equals…"
                                            value={connection.condition.value}
                                            onChange={(event) => {
                                                const value =
                                                    event.target.value;
                                                setConnections((current) =>
                                                    current.map((item) =>
                                                        item.id ===
                                                            connection.id &&
                                                        item.condition
                                                            ? {
                                                                  ...item,
                                                                  condition: {
                                                                      ...item.condition,
                                                                      value,
                                                                  },
                                                              }
                                                            : item,
                                                    ),
                                                );
                                                setDirty(true);
                                            }}
                                        />
                                    )}
                                    <button
                                        type="button"
                                        className="text-muted-foreground hover:text-destructive rounded p-2"
                                        aria-label="Remove connection"
                                        onClick={() => {
                                            setConnections((current) =>
                                                current.filter(
                                                    (item) =>
                                                        item.id !==
                                                        connection.id,
                                                ),
                                            );
                                            setDirty(true);
                                        }}
                                    >
                                        <Trash2 size={16} aria-hidden="true" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
}
