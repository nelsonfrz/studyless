import { getCardsWithProgressionByDeckId } from "@/lib/api/cards/queries"
import { getDeckById } from "@/lib/api/decks/queries"
import { notFound } from "next/navigation"

export default async function TrainingPage(props: { params: { deckId: string } }) {
    const { deck } = await getDeckById(props.params.deckId)
    if (!deck) {
        return notFound()
    }
    const cardsWithProgression = await getCardsWithProgressionByDeckId(deck.id)

    return <>
    </>
}