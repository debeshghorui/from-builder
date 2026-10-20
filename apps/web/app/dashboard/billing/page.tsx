import {
    IconCreditCard,
    IconFileInvoice,
    IconReceipt,
} from "@tabler/icons-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";

export default function BillingPage() {
    return (
        <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
            <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Workspace</p>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Billing
                </h1>
                <p className="text-muted-foreground text-sm">
                    Manage your plan, payment details, and invoices.
                </p>
            </div>

            <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <IconCreditCard className="text-muted-foreground size-5" />
                            Current plan
                        </CardTitle>
                        <CardDescription>
                            Your workspace subscription and usage.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border border-dashed p-6 text-center">
                            <p className="text-sm font-medium">
                                No plan information yet
                            </p>
                            <p className="text-muted-foreground mt-1 text-sm">
                                Plan details will appear here when billing is
                                set up for your workspace.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <IconReceipt className="text-muted-foreground size-5" />
                            Payment method
                        </CardTitle>
                        <CardDescription>
                            Payment methods for future charges.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border border-dashed p-6 text-center">
                            <p className="text-sm font-medium">
                                No payment method on file
                            </p>
                            <p className="text-muted-foreground mt-1 text-sm">
                                There are no saved payment details for this
                                account.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <IconFileInvoice className="text-muted-foreground size-5" />
                            Billing history
                        </CardTitle>
                        <CardDescription>
                            Invoices and receipts for your workspace.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-12 text-center">
                            <IconFileInvoice className="text-muted-foreground mb-3 size-8" />
                            <p className="text-sm font-medium">
                                No invoices yet
                            </p>
                            <p className="text-muted-foreground mt-1 max-w-sm text-sm">
                                When an invoice is available, you’ll find it
                                here.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
