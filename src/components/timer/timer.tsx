import  {useEffect} from "react";
import './timer.scss'

import usePracticeStore from "../../store/usePracticeStore.ts";


const Timer = () => {
    const gameState = usePracticeStore(state1 => state1.gameState)
    const timer = usePracticeStore(state1 => state1.timer)
    const incrementTimer = usePracticeStore(state1 => state1.incrementTimer)

    let interval: number;
    useEffect(() => {
        interval = setInterval(() => {
            if (gameState === "launch") {
                incrementTimer()
            }
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    }, [gameState, timer]);
    useEffect(() => {
        console.log(gameState)
    }, [gameState]);
    return (
        <div className={'timer'}>
            {timer}
        </div>
    );
};

export default Timer;