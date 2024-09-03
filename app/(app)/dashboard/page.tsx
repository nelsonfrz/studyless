import { getDecks } from "@/lib/api/decks/queries";
import NavBar from "@/components/dashboard/nav-bar";
import DeckList from "@/components/dashboard/deck-list";
import { Card, CardHeader } from "@/components/ui/card";
import Link from "next/link";

export default async function DashboardPage() {
    const { decks } = await getDecks();

    return <>
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Decks
        </h2>
        <CreateDeck />
        <DeckList decks={decks} />
    </>
}




function CreateDeck() {
    return <Link href="/dashboard/deck/create"><Card className="border-dashed">
        <CardHeader>
            <p className="text-center text-lg">Create new deck</p>
        </CardHeader>
    </Card></Link>
}