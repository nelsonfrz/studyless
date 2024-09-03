import NavBar from "@/components/dashboard/nav-bar";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (<>
        <NavBar />
        <main className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
            {children}
        </main>
    </>)
}