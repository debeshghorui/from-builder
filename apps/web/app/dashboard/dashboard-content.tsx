import { ChartAreaInteractive } from "~/components/chart-area-interactive";
import { DataTable } from "~/components/data-table";
import { SectionCards } from "~/components/section-cards";
import { DashboardPage, PageHeading } from "~/components/app-page";

import data from "./data.json";

export function DashboardContent() {
    return (
        <DashboardPage>
            <PageHeading
                title="Dashboard"
                description="A snapshot of activity across your workspace."
            />
            <div className="@container/main flex w-full flex-col gap-6">
                <SectionCards />
                <ChartAreaInteractive />
                <DataTable data={data} />
            </div>
        </DashboardPage>
    );
}
