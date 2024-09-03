"use client"

import { Deck } from "@/lib/db/schema/decks"
import { trpc } from "@/lib/trpc/client"
import { CardProgress, CardWithProgression, GameState } from "@/lib/types"
import { MutableRefObject, useEffect, useRef, useState } from "react"
import { Button, buttonVariants } from "../ui/button"
import { Check, CheckCheck, X } from "lucide-react"
import { useStopwatch } from "@/hooks/use-stopwatch"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useHotkeys } from "@mantine/hooks";

export default function Training(props: { deck: Deck, cardsWithProgression: CardWithProgression[] }) {
    const router = useRouter()
    const { mutateAsync: createProgression } = trpc.progressions.createProgression.useMutation({
        onSuccess: () => {
            cardsQuery.refetch()
        }
    })
    const { mutateAsync: updateProgression } = trpc.progressions.updateProgression.useMutation({
        onSuccess: () => {
            cardsQuery.refetch()
        }
    })
    const cardsQuery = trpc.cards.getCardsWithProgressionById.useQuery({ id: props.deck.id }, {
        initialData: props.cardsWithProgression
    })
    const [currentCardIndex, setCurrentCardIndex] = useState(0)
    const currentCard = cardsQuery.data[currentCardIndex]
    const [gameState, setGameState] = useState(GameState.Typing)
    const { elapsedSeconds, pauseTimer } = useStopwatch()
    const [input, setInput] = useState("");
    const inputElementRef = useRef<HTMLInputElement | null>(null);

    const finishCard = async (progress: CardProgress) => {
        if (gameState === GameState.Finished) {
            return
        }

        if (currentCardIndex < cardsQuery.data.length - 1) {
            setGameState(GameState.Typing)
            setCurrentCardIndex(i => i + 1)
        } else {
            setGameState(GameState.Finished)
            pauseTimer()
        }

        if (currentCard.progressionId == null) {
            await createProgression({
                cardId: currentCard.cardId,
                progress
            })
        } else {
            await updateProgression({
                cardId: currentCard.cardId,
                id: currentCard.progressionId,
                progress
            })
        }
    }

    useHotkeys([
        [
            "1",
            () => {
                if (gameState === GameState.Checking) {
                    finishCard(CardProgress.Incorrect);
                }
            },
        ],
        [
            "2",
            () => {
                if (gameState === GameState.Checking) {
                    finishCard(CardProgress.Almost);
                }
            },
        ],
        [
            "3",
            () => {
                if (gameState === GameState.Checking) {
                    finishCard(CardProgress.Correct);
                }
            },
        ],
    ]);

    return <>
        { }
        <TopBar
            elapsedSeconds={elapsedSeconds}
            incorrectCards={cardsQuery.data.filter(c => c.progress === CardProgress.Incorrect || c.progressionId === null).length}
            almostCards={cardsQuery.data.filter(c => c.progress === CardProgress.Almost).length}
            correctCards={cardsQuery.data.filter(c => c.progress === CardProgress.Correct).length}
            currentCardIndex={currentCardIndex}
            lastCardIndex={cardsQuery.data.length - 1} />

        {gameState !== GameState.Finished &&
            <>
                <Center currentCard={currentCard} gameState={gameState} onSubmit={() => setGameState(GameState.Checking)} input={input} setInput={setInput} inputElementRef={inputElementRef} />

                <BottomBar gameState={gameState} onSubmit={finishCard} />

            </>}
        {gameState === GameState.Finished &&
            <div className="container grid items-center gap-3 pb-8 pt-6 md:py-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    Hooray! Finished!
                </h1>
                <Link className={buttonVariants()} href="/dashboard">Go to Dashboard</Link>
            </div>}

    </>
}

function Center(props: { currentCard: CardWithProgression, gameState: GameState, onSubmit: () => void, input: string, setInput: (input: string) => void, inputElementRef: MutableRefObject<HTMLInputElement | null> }) {
    useEffect(() => {
        if (props.gameState === GameState.Typing) {
            props.inputElementRef.current?.focus()
            props.setInput("")
        }
    }, [props.gameState])

    return <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-8">
        <p className="text-xl">{props.currentCard.front}</p>

        {props.gameState === GameState.Typing &&
            <input
                ref={props.inputElementRef}
                value={props.input}
                onChange={(e) => props.setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key == "Enter") {
                        props.onSubmit()
                    }
                }}
                placeholder="Enter solution"
                className="border-none outline-none text-center sm:w-[400px] xs:w-[300px] text-lg"
            />
        }
        {props.gameState === GameState.Checking &&
            <p className="text-xl">{props.input} {"->"} <span className="font-bold">{props.currentCard.back}</span></p>
        }
    </div>
}

function TopBar(props: { incorrectCards: number, almostCards: number, correctCards: number, currentCardIndex: number, lastCardIndex: number, elapsedSeconds: number }) {
    return <div className="w-full border-b py-2 select-none grid grid-cols-3 items-center text-center">
        <div className="flex gap-1 flex-row justify-center">
            <div className="bg-red-500 hover:bg-red-600 text-white h-8 w-8 flex justify-center items-center rounded-full">{props.incorrectCards}</div>
            <div className="bg-yellow-500 hover:bg-yellow-600  text-white h-8 w-8 flex justify-center items-center rounded-full">{props.almostCards}</div>
            <div className="bg-green-500 hover:bg-green-600 text-white h-8 w-8 flex justify-center items-center rounded-full">{props.correctCards}</div>
        </div>
        <p className="text-xl">{props.currentCardIndex} <span className="font-thin">/</span> {props.lastCardIndex}</p>
        <p>{Math.floor(props.elapsedSeconds / 60).toString().padStart(2, "0")}:{(props.elapsedSeconds % 60).toString().padStart(2, "0")}</p>
    </div>
}

function BottomBar(props: { gameState: GameState, onSubmit: (progress: CardProgress) => void }) {
    return <div className="w-full border-t px-4 py-6 absolute bottom-0 flex justify-center items-center gap-2">
        {props.gameState === GameState.Checking &&
            <>
                <Button onClick={() => props.onSubmit(CardProgress.Incorrect)} className="rounded-xl bg-red-500 hover:bg-red-600 flex gap-1"><X className="w-4 h-4" /> Incorrect</Button>
                <Button onClick={() => props.onSubmit(CardProgress.Almost)} className="rounded-xl bg-yellow-500 hover:bg-yellow-600 flex gap-1"><Check className="w-4 h-4" />Almost</Button>
                <Button onClick={() => props.onSubmit(CardProgress.Correct)} className="rounded-xl bg-green-500 hover:bg-green-600 flex gap-1"><CheckCheck className="w-4 h-4" />Correct</Button>
            </>}
    </div>
}
