"use client";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";
import * as z from "zod";

const formSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    public: z.boolean(),
    cards: z.array(z.object({
        front: z.string().min(1),
        back: z.string().min(1)
    }))
});

export default function CreateDeck() {
    const router = useRouter()
    const { mutateAsync: createDeck } = trpc.decks.createDeck.useMutation()
    const { mutateAsync: createCard } = trpc.cards.createCard.useMutation()

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const { deck } = await createDeck({
            name: values.name,
            description: values.description,
            public: values.public ? 1 : 0
        })
        await Promise.all(values.cards.map(card => createCard({
            front: card.front,
            back: card.back,
            deckId: deck.id
        })))
        router.push(`/dashboard/deck/${deck.id}`)
    }

    return <>
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Create a deck
        </h2>
        <AutoForm
            formSchema={formSchema}
            onSubmit={values => onSubmit(values)}
        >
            <AutoFormSubmit>Create deck</AutoFormSubmit>
        </AutoForm>
    </>
}