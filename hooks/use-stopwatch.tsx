import { useState, useEffect } from 'react';

export function useStopwatch(startTime = Date.now()) {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [running, setRunning] = useState(true)

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (running) {
                setElapsedSeconds(elapsedSeconds => elapsedSeconds + 1)
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [startTime]);

    function pauseTimer() {
        setRunning(false)
    }

    function startTimer() {
        setRunning(true)
    }


    return { elapsedSeconds, pauseTimer, startTimer };
}

