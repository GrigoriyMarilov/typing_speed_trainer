import {TextBox} from "../../components/textBox/textBox.tsx";
import useOptionsStore from "../../store/useOptionsStore.ts";
import {getTextByLang} from "../../utils/textBook.ts";
import "./typingSpeedTrainer.scss"
import React, {ChangeEvent, KeyboardEvent, useCallback, useEffect, useRef, useState} from "react";
import {Practice} from "../../models.ts";
import Caret from "../../components/caret/caret.tsx";
import Timer from "../../components/timer/timer.tsx";
import usePracticeStore from "../../store/usePracticeStore.ts";
import RestartIcon from "../../components/restartIcon/restartIcon.tsx";


export const TypingSpeedTrainer = () => {
    const lang = useOptionsStore(state => state.lang)
    const inputRef = useRef<null | HTMLInputElement>(null)
    const boxRef = useRef<null | HTMLDivElement>(null)
    const userText = usePracticeStore(state => state.userText)
    const replaceUserText = usePracticeStore(state => state.replaceText)
    const initialPractice = usePracticeStore(state => state.initialPractice)
    const deleteLastLetter = usePracticeStore(state => state.deleteLastLetter)
    const setGameState = usePracticeStore(state => state.setGameState)
    const practice = usePracticeStore(state => state.practice)
    const gameState = usePracticeStore(state => state.gameState)
    const [wordIndex, setWordIndex] = useState(0)
    const [currentPractice, setCurrentPractice] = useState<Practice | null>(null)
    const [caretPosition, setCaretPosition] = useState({top: 0, left: 0.25})
    const [wordList, setWordList] = useState<HTMLDivElement[]>([])
    const [restart, setRestart] = useState({mode: "newPractice"})
    const [lastPracticeIndex, setLastPracticeIndex] = useState<number | null>(null);
    const [fontSize, setFontSize] = useState(32)
    useEffect(() => {
        let practiceToStart: Practice;
        const practiceList = getTextByLang(lang);

        if (currentPractice && restart.mode === "samePractice") {
            practiceToStart = currentPractice;
        } else {
            let randomIndex: number;
            do {
                randomIndex = Math.floor(Math.random() * practiceList.length);
            } while (randomIndex === lastPracticeIndex && practiceList.length > 1);

            practiceToStart = practiceList[randomIndex];
            setLastPracticeIndex(randomIndex);
            setWordList([]);
        }

        initialPractice(practiceToStart);
        setCurrentPractice(practiceToStart);

        setWordIndex(0);

        if (boxRef.current) {
            boxRef.current.scrollTop = 0;
            const computedFontSize = parseInt(window.getComputedStyle(boxRef.current).fontSize)
            setFontSize(computedFontSize)
            setCaretPosition(prevState => ({...prevState ,top: 0, left: computedFontSize / 4}))
        }

    }, [restart]);

    const moveCaret = useCallback((isSpace = false) => {
        if (isSpace) {
            wordList[wordIndex + 1] && wordList[wordIndex + 1].scrollIntoView({behavior: "smooth"})
            wordList[wordIndex + 1] && setCaretPosition(prevState => ({
                ...prevState,
                top: wordList[wordIndex + 1].offsetTop,
                left: wordList[wordIndex + 1].offsetLeft
            }))


        } else {
            setCaretPosition(prevState => ({
                ...prevState,
                top: prevState.top,
                left: prevState.left + fontSize * 0.6
            }))

        }
    }, [wordIndex, wordList, fontSize])
    const moveCaretBack = useCallback((letterCount = 0, spaceCount = 0) => {
        if (letterCount > 0 && wordIndex >= 0) {
            setCaretPosition(prevState => ({...prevState, left: prevState.left - letterCount * fontSize * 0.6}))
        } else if (spaceCount > 0 && wordIndex > 0) {
            wordList[wordIndex - 1] && wordList[wordIndex - 1].scrollIntoView({behavior: "smooth"})
            setCaretPosition(prevState => ({
                ...prevState,
                top: wordList[wordIndex - 1].offsetTop,
                left: wordList[wordIndex - 1].offsetLeft + (userText[wordIndex - 1].length) * fontSize * 0.6
            }))
        }

    }, [wordIndex, wordList, fontSize])

    const addElementInWordList = (word: HTMLDivElement) => {
        setWordList(prevState => ([...prevState, word]))
    }

    const handleBlur = () => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0); //без таймаута фокус не будет работать
    }

    const inputHandler = (event: ChangeEvent<HTMLInputElement>) => {

        if (event.target.value[event.target.value.length - 1] === " ") {
            setWordIndex(prevState => prevState + 1)
            moveCaret(true)
            setGameState("launch")
        } else if (userText[wordIndex] < event.target.value) {
            replaceUserText(event.target.value, wordIndex)
            moveCaret()
            setGameState("launch")
            if (practice?.text.split(" ")[practice?.wordCount - 1] === event.target.value) {
                setGameState("end")
            }
        }

    }

    const inputKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {

        if (event.key === "Backspace") {

            if (userText[wordIndex] === "") {
                if (wordIndex > 0) {
                    moveCaretBack(0, 1)
                    setWordIndex(prevState => prevState - 1)
                }

            } else {
                deleteLastLetter(wordIndex)
                moveCaretBack(1);

            }
        }
    }

    const restartSame = () => {
        setRestart({mode: "samePractice"})
    }
    const runNew = () => {

        setRestart({mode: "newPractice"})
    }
    return (
        <>

            <div className="typingSpeedTrainer" onClick={handleBlur}>


                <div className={gameState === "end"? "display-game hidden":"display-game"}>
                    <PracticeInfo practice={currentPractice} runNew={runNew}/>
                    <input onKeyDown={inputKeyDownHandler} value={userText[wordIndex]} onChange={inputHandler}
                           ref={inputRef}
                           id={"typing-trainer-input"}
                           onPaste={(e) => e.preventDefault()}
                           autoCapitalize={"off"}
                           className={"user-input"} type="text" onBlur={handleBlur} autoFocus/>
                    <div ref={boxRef} className={"box"}>
                        <Caret caretPosition={caretPosition} visibility={true}/>
                        {currentPractice &&
                            <TextBox practice={currentPractice}
                                     addElementInWordList={addElementInWordList}/>}

                    </div>
                    <button className={"restart-button"}
                            onClick={restartSame}>restart
                    </button>
                </div>


                <ResultBlock visible={gameState === "end"} restart={restartSame} runNew={runNew}/>


            </div>
        </>
    );
};

interface PracticeInfoProps {
    practice: Practice | null,
    runNew: () => void
}

const PracticeInfo = React.memo(({practice, runNew}: PracticeInfoProps) => {
    if (practice) {
        return (
            <div className={'practice-info'}>
                <div className={"practice-creation"}>
                    <div>
                        <div onClick={runNew}>
                            <RestartIcon/>
                        </div>
                        <h1><span>{practice.title}</span></h1>
                    </div>
                    <span>{practice.author}</span>
                </div>
                <Timer/>
            </div>
        )
    }
})

interface resultBlockProps {
    visible: boolean,
    restart: () => void,
    runNew: () => void
}

const ResultBlock = React.memo(({visible, restart, runNew}: resultBlockProps) => {
    const {correctLettersCount, errorLettersCount, extraLettersCount, correctWordsCount, timer} = usePracticeStore(
        ({
             correctLettersCount,
             errorLettersCount,
             extraLettersCount,
             correctWordsCount,
             timer
         }) => ({correctLettersCount, errorLettersCount, extraLettersCount, correctWordsCount, timer}),
    )
    if (visible) {
        return (
            <div className={"result"}>
                <div className={"main_stats"}>
                    <div>
                        <div className={"alt-color"}>WPM</div>
                        {parseInt(String((correctWordsCount / (timer / 60))))}
                    </div>


                    <div>
                        <div className={"alt-color"}>Accuracy</div>
                        {correctWordsCount ? (
                            Number.isInteger(
                                (correctLettersCount / (correctLettersCount + extraLettersCount + errorLettersCount)) * 100
                            )
                                ? (correctLettersCount / (correctLettersCount + extraLettersCount + errorLettersCount)) * 100
                                : ((correctLettersCount / (correctLettersCount + extraLettersCount + errorLettersCount)) * 100).toFixed(2)
                        ) : 0}%
                    </div>


                    <div>
                        <div className={"alt-color"}>Time</div>
                        {timer}
                    </div>
                </div>
                <div className={"secondary_stats"}>
                    <div>
                        <div>Correct</div>
                        {correctLettersCount}
                    </div>
                    <div>
                        <div>Errors</div>
                        {errorLettersCount}
                    </div>
                    <div>
                        <div>Extra</div>
                        {extraLettersCount}
                    </div>
                </div>
                <div className={'result-buttons'}>
                    <button className={'restart-button'} onClick={restart}>restart</button>
                    <button className={'restart-button'} onClick={runNew}>new test</button>
                </div>
            </div>
        )
    }

})
