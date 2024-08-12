import {create} from 'zustand'
import {Practice} from "../models.ts";


interface IPracticeStore {
    lang: "ru" | "en" | "de";
    timer: number;
    userText: string[]
    correctLettersCount: number;
    errorLettersCount: number;
    extraLettersCount: number;
    correctWordsCount: number;
    gameState: "pause" | "launch" | "end";
    practice: Practice | null;
    refreshTimer: () => void;
    incrementTimer: () => void;
    incrementCorrectLetters: () => void;
    incrementErrorLetters: () => void;
    incrementExtraLetters: () => void;
    incrementCorrectWords: () => void;
    addText: (value: string) => void;
    replaceText: (value: string, index: number) => void;
    initialPractice: (value: Practice) => void;
    deleteLastLetter: (index: number) => void;
    setGameState: (value: "pause" | "launch" | "end") => void;
}

const usePracticeStore = create<IPracticeStore>((set, get) => ({
    userText: [],
    lang: "ru",
    timer: 0,
    correctLettersCount: 0,
    errorLettersCount: 0,
    extraLettersCount: 0,
    correctWordsCount: 0,
    gameState: "pause",
    practice: null,
    refreshTimer: () => set({timer: 0}),
    incrementTimer: () => set({timer: get().timer + 1}),
    incrementCorrectWords: () => set({correctWordsCount: get().correctWordsCount + 1}),
    incrementErrorLetters: () => set({errorLettersCount: get().errorLettersCount + 1}),
    incrementCorrectLetters: () => set({correctLettersCount: get().correctLettersCount + 1}),
    incrementExtraLetters: () => set({extraLettersCount: get().extraLettersCount + 1}),
    addText: (value) => set({userText: [...get().userText, value]}),
    replaceText: (value, index) => set((state) => {
        const updatedText = [...state.userText];
        if (index >= 0 && index < updatedText.length) {
            updatedText[index] = value;
        }
        return {userText: updatedText};
    }),
    initialPractice: (value) => set(() => {
        let initialText = Array(value.wordCount).fill("")
        return {practice: value, userText: initialText, timer: 0, gameState: "pause"}
    }),
    deleteLastLetter: (index) => set((state) => {
        const updatedText = [...state.userText];

        if (index >= 0 && index < updatedText.length && updatedText[index].length > 0) {
            updatedText[index] = updatedText[index].slice(0, -1);
        }

        return {userText: updatedText};
    }),
    setGameState: (value) => set((state) => {
        if (value === "end" && state.practice) {
            let correctWordsCount = 0;
            let correctLettersCount = 0;
            let errorLettersCount = 0;
            let extraLettersCount = 0;

            const practiceWords = state.practice.text.split(" ");
            const userWords = state.userText;

            practiceWords.forEach((practiceWord, index) => {
                const userWord = userWords[index] || "";

                if (practiceWord === userWord) {
                    correctWordsCount++;
                }

                for (let i = 0; i < practiceWord.length; i++) {
                    const practiceLetter = practiceWord[i];
                    const userLetter = userWord[i];

                    if (userLetter === undefined) {
                        // User missed letters; break loop if user word is shorter
                        break;
                    } else if (practiceLetter === userLetter) {
                        correctLettersCount++;
                    } else {
                        errorLettersCount++;
                    }
                }

                // Count extra letters beyond the correct word's length (only once)
                if (userWord.length > practiceWord.length) {
                    extraLettersCount += userWord.length - practiceWord.length;
                }
            });

            return {
                gameState: value,
                correctWordsCount,
                correctLettersCount,
                errorLettersCount,
                extraLettersCount
            };
        }

        return {gameState: value};
    }),



}))


export default usePracticeStore