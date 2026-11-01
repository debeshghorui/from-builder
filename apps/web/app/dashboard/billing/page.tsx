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
import { DashboardPage, PageHeading, PageState } from "~/components/app-page";

export default function BillingPage() {
    return (
        <DashboardPage>
            <PageHeading
                title="Billing"
                description="Manage your plan, payment details, and invoices."
            />

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
                        <PageState
                            variant="empty"
                            surface={false}
                            title="No plan information yet"
                            description="Plan details will appear here when billing is set up for your workspace."
                            className="min-h-32 p-6"
                        />
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
                        <PageState
                            variant="empty"
                            surface={false}
                            title="No payment method on file"
                            description="There are no saved payment details for this account."
                            className="min-h-32 p-6"
                        />
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
                        <PageState
                            variant="empty"
                            surface={false}
                            icon={
                                <IconFileInvoice className="text-muted-foreground mb-1 size-8" />
                            }
                            title="No invoices yet"
                            description="When an invoice is available, you’ll find it here."
                            className="min-h-48 px-6 py-10"
                        />
                    </CardContent>
                </Card>
            </div>
        </DashboardPage>
    );
}
