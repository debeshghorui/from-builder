"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Copy, Download, LockKeyhole, QrCode } from "lucide-react";
import * as QRCode from "qrcode";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { FormStatus } from "~/components/app-page";

function isFinderPatternArea(row: number, column: number, size: number) {
    return (
        (row < 7 && column < 7) ||
        (row < 7 && column >= size - 7) ||
        (row >= size - 7 && column < 7)
    );
}

function drawFinderPattern(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    moduleSize: number,
) {
    const drawRoundedSquare = (inset: number, size: number, radius: number) => {
        context.beginPath();
        context.roundRect(x + inset, y + inset, size, size, radius);
        context.fill();
    };

    context.fillStyle = "#181713";
    drawRoundedSquare(0, moduleSize * 7, moduleSize * 1.1);
    context.fillStyle = "#f7f4ec";
    drawRoundedSquare(moduleSize, moduleSize * 5, moduleSize * 0.75);
    context.fillStyle = "#181713";
    drawRoundedSquare(moduleSize * 2, moduleSize * 3, moduleSize * 0.5);
}

export function FormSharingCard({
    formId,
    formTitle,
    published,
}: {
    formId: string;
    formTitle: string;
    published: boolean;
}) {
    const [publicUrl, setPublicUrl] = useState("");
    const [qrDataUrl, setQrDataUrl] = useState("");
    const [qrError, setQrError] = useState("");

    useEffect(() => {
        if (!published) {
            setPublicUrl("");
            setQrDataUrl("");
            return;
        }
        setPublicUrl(
            new URL(
                `/form/${encodeURIComponent(formId)}`,
                window.location.origin,
            ).toString(),
        );
    }, [formId, published]);

    useEffect(() => {
        if (!published || !publicUrl) return;

        let isCurrent = true;
        setQrError("");
        try {
            const code = QRCode.create(publicUrl, {
                errorCorrectionLevel: "M",
            });
            const canvas = document.createElement("canvas");
            const canvasSize = 384;
            const context = canvas.getContext("2d");
            if (!context) throw new Error("Canvas is unavailable");

            canvas.width = canvasSize;
            canvas.height = canvasSize;
            context.fillStyle = "#f7f4ec";
            context.fillRect(0, 0, canvasSize, canvasSize);

            const moduleSize = canvasSize / (code.modules.size + 8);
            const quietZone = moduleSize * 4;
            for (let row = 0; row < code.modules.size; row += 1) {
                for (let column = 0; column < code.modules.size; column += 1) {
                    const isFinderAnchor =
                        (row === 0 && column === 0) ||
                        (row === 0 && column === code.modules.size - 7) ||
                        (row === code.modules.size - 7 && column === 0);
                    if (isFinderAnchor) {
                        drawFinderPattern(
                            context,
                            quietZone + column * moduleSize,
                            quietZone + row * moduleSize,
                            moduleSize,
                        );
                        continue;
                    }
                    if (isFinderPatternArea(row, column, code.modules.size))
                        continue;
                    if (!code.modules.get(row, column)) continue;

                    const x = quietZone + column * moduleSize;
                    const y = quietZone + row * moduleSize;
                    context.fillStyle = "#181713";
                    context.beginPath();
                    context.arc(
                        x + moduleSize / 2,
                        y + moduleSize / 2,
                        moduleSize * 0.42,
                        0,
                        Math.PI * 2,
                    );
                    context.fill();
                }
            }

            if (isCurrent) setQrDataUrl(canvas.toDataURL("image/png"));
        } catch {
            if (isCurrent) {
                setQrDataUrl("");
                setQrError(
                    "Could not create the QR code. You can still copy the form link.",
                );
            }
        }

        return () => {
            isCurrent = false;
        };
    }, [publicUrl, published]);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(publicUrl);
            toast.success("Form link copied");
        } catch {
            toast.error(
                "Could not copy the link. Select and copy it from the field.",
            );
        }
    };

    return (
        <section className="card-chai min-w-0 space-y-4 p-3 sm:p-4">
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="font-semibold">Share form</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        {published
                            ? "Scan the code or share this public form link."
                            : "Publish this form to enable QR and link sharing."}
                    </p>
                </div>
                <FormStatus published={published} />
            </div>
            <div className="grid min-w-0 grid-cols-[5rem_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-4">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border border-stone-300 bg-[#f7f4ec] p-1.5 sm:size-24 sm:p-2">
                    {published && qrDataUrl ? (
                        <Image
                            src={qrDataUrl}
                            alt={`QR code for ${formTitle}`}
                            width={96}
                            height={96}
                            className="size-16 sm:size-20"
                            unoptimized
                        />
                    ) : published ? (
                        <div className="text-muted-foreground flex flex-col items-center gap-1 text-center text-[10px]">
                            <QrCode aria-hidden="true" className="size-5" />
                            {qrError || "Preparing QR…"}
                        </div>
                    ) : (
                        <div className="text-muted-foreground flex flex-col items-center gap-2 text-center text-xs">
                            <LockKeyhole
                                aria-hidden="true"
                                className="size-5"
                            />
                            <span>Locked</span>
                        </div>
                    )}
                </div>
                <div className="min-w-0 space-y-3">
                    {published ? (
                        <>
                            <div className="space-y-1.5">
                                <Label htmlFor={`public-form-url-${formId}`}>
                                    Public form link
                                </Label>
                                <Input
                                    id={`public-form-url-${formId}`}
                                    className="h-8 text-xs"
                                    value={publicUrl}
                                    readOnly
                                    onFocus={(event) =>
                                        event.currentTarget.select()
                                    }
                                    aria-describedby={
                                        qrError
                                            ? `qr-error-${formId}`
                                            : undefined
                                    }
                                />
                            </div>
                            {qrError ? (
                                <p
                                    id={`qr-error-${formId}`}
                                    className="text-destructive text-xs"
                                    role="alert"
                                >
                                    {qrError}
                                </p>
                            ) : null}
                            <div className="flex flex-wrap gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <a
                                        href={publicUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Open form
                                    </a>
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => void copyLink()}
                                    disabled={!publicUrl}
                                >
                                    <Copy aria-hidden="true" /> Copy
                                </Button>
                                {qrDataUrl ? (
                                    <Button asChild variant="outline" size="sm">
                                        <a
                                            href={qrDataUrl}
                                            download={`form-${formId}-qr.png`}
                                        >
                                            <Download aria-hidden="true" />
                                            Download
                                        </a>
                                    </Button>
                                ) : null}
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
