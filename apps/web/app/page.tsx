import { api } from "~/trpc/server";

export default async function Home() {
    const { status } = await api.health.getHealth.query();
    return (
        <main className="flex min-h-screen min-w-screen items-center justify-center">
            <div>
                <h1 className="text-3xl">Streamyst - Stream in Style</h1>
                <h2>Server Status: {status}</h2>
            </div>
        </main>
    );
}
