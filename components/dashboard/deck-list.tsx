"use client"

import { Deck } from "@/lib/db/schema/decks";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { useMediaQuery } from "@mantine/hooks";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function DeckList(props: { decks: Deck[] }) {
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return <ul className="flex flex-col gap-4">
            {props.decks.map((deck) => <li key={deck.id}>
                <Dialog>
                    <DialogTrigger asChild>
                        <Card>
                            <CardHeader>
                                <CardTitle>{deck.name}</CardTitle>
                                <CardDescription>{deck.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{deck.name}</DialogTitle>
                            <DialogDescription>
                                {deck.description}
                            </DialogDescription>
                            <Link href={`/train/${deck.id}`} className={buttonVariants()}>
                                Train
                            </Link>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </li>)}
        </ul>
    }

    return <ul className="flex flex-col gap-4">
        {props.decks.map((deck) => <li key={deck.id}>
            <Drawer>
                <DrawerTrigger className="w-full">
                    <Card>
                        <CardHeader>
                            <CardTitle>{deck.name}</CardTitle>
                            <CardDescription>{deck.description}</CardDescription>
                        </CardHeader>
                    </Card>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{deck.name}</DrawerTitle>
                        <DrawerDescription>{deck.description}</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter className="flex gap-2 flex-row justify-center">
                        <Link href={`/train/${deck.id}`} className={buttonVariants()}>
                            Train
                        </Link>
                        <DrawerClose>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </li>)}
    </ul>

}