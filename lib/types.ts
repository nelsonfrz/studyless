import { CardId } from "./db/schema/cards"
import { ProgressionId } from "./db/schema/progressions"

export type CardWithProgression = {
    front: string,
    back: string,
    progress: CardProgress | null
    cardId: CardId,
    progressionId: ProgressionId | null
}

export enum CardProgress {
    Incorrect,
    Almost,
    Correct
}

export enum GameState {
    Typing,
    Checking,
    Finished
}