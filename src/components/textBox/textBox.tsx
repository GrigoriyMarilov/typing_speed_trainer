import "./textBox.scss"
import React, {useEffect, useRef} from "react";
import {Practice} from "../../models.ts";
import usePracticeStore from "../../store/usePracticeStore.ts";


interface TextBoxProps {
    practice: Practice;
    addElementInWordList: (word: HTMLDivElement) => void;

}

export const TextBox = React.memo(({practice, addElementInWordList}: TextBoxProps) => {
    const userInput = usePracticeStore(state => state.userText)
    const ref = useRef<HTMLDivElement>(null);


    useEffect(() => {
        ref.current && ref.current.childNodes.forEach(el => {
            addElementInWordList(el as HTMLDivElement)
        })
    }, [practice]);

    return (
        <p className="text-box" ref={ref}>
            {practice.text.split(" ").map((word, wIndex) => {
                const userInputWord = userInput[wIndex] || "";
                return (
                    <Word
                        word={word}
                        key={wIndex}
                        userInput={userInputWord}

                    />
                );
            })}
        </p>
    );
});

interface WordProps {
    word: string;
    userInput: string
}

export const Word = React.memo(({word, userInput}: WordProps) => {
    const compareLetter = (a: string, b: string) => {
        if (!b || !a) return "";
        else if (a === b) return "correct";
        else return "error";
    };

    return (
        <span className="word">
            {word.split("").map((letter, index) => (
                <Letter key={index} variant={compareLetter(letter, userInput[index]) || ""} letter={letter}/>
            ))}
            {
                userInput && userInput.split("").splice(word.length, userInput.length).map((letter, index) => {
                    return (
                        <Letter key={"extra" + index} variant={"extra"} letter={letter}/>
                    )
                })
            }
         </span>
    );


});

interface LetterProps {
    letter: string
    variant?: "error" | "correct" | "extra" | ""
}

export const Letter = React.memo(({letter, variant}: LetterProps) => {
    return (
        <span className={`letter ${variant}`}>
            {letter}
        </span>
    );
});

