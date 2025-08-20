"use client";
import { useState, useEffect, useRef } from 'react';

export default function Pomodoro() {
    // reusing pomodoro timer from other project

    // initializing the state variables
    const [timeLeft, setTimeLeft] = useState(1500);
    const intervalRef = useRef(null);
    const [displayOne, setDisplayOne] = useState('flex');
    const [displayTwo, setDisplayTwo] = useState('none');
    const [displayThree, setDisplayThree] = useState('none');
    const [timesCompleted, setTimesCompleted] = useState(0);
    // need to upload audio to this project lol
    // const completeAudio = new Audio('/complete.mp3');

    // the pomodoro timer will start with 25 minutes
    function startMainTimer(){
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setTimeLeft((prevTimeLeft) => {
                if (prevTimeLeft <= 0) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;

                    setTimesCompleted((prevCount) => {
                        completeAudio.play();
                        const newCount = prevCount + 1;
                        if (newCount % 8 === 0){
                            setDisplayOne('none');
                            setDisplayTwo('none');
                            setDisplayThree('flex');
                            setTimeLeft(900);
                            startLongBreakTimer();
                        } else {
                            startBreakTimer();
                            setDisplayOne('none');
                            setDisplayTwo('flex');
                            setDisplayThree('none');
                            setTimeLeft(300);
                            startBreakTimer();
                        }
                        return newCount;;
                    });
                    return 0;
                }
                return prevTimeLeft - 1;
            });
        }, 1000);
    }

    // the break timer will start with 5 minutes
    function startBreakTimer(){
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setTimeLeft((prevTimeLeft) => {
                if (prevTimeLeft <= 0){
                    completeAudio.play();
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    setDisplayOne('flex');
                    setDisplayTwo('none');
                    setDisplayThree('none');
                    setTimeLeft(1500);
                    startMainTimer();
                    return 0;
                }
                return prevTimeLeft - 1});
        }, 1000);
    }

    // the long break timer will start with 15 minutes
    function startLongBreakTimer(){
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setTimeLeft((prevTimeLeft) => {
                if (prevTimeLeft <= 0){
                    completeAudio.play();
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    setDisplayOne('flex');
                    setDisplayTwo('none');
                    setDisplayThree('none');
                    setTimeLeft(1500);
                    return 0;
                }
                return prevTimeLeft - 1});
        }, 1000);
    }

    // to stop the timer
    function stopTimer(){
        clearInterval(intervalRef.current);
    }

    // to reset the timer
    function resetMainTimer(){
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setTimeLeft(1500);
    }

    function resetBreakTimer(){
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setTimeLeft(300);
    }

    function resetLongBreakTimer(){
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setTimeLeft(900);
    }
    return (
        <div className="wrapper">
        <h1 id="pomotitle">pomodoro timer</h1>
        <div className="mainTimerContainer" style={{display: displayOne}}>
            <h2 id="timerTitle">time to study!</h2>
            <div className="timerDisplay">
                <span className="timerMinutes">{String(Math.floor(timeLeft / 60)).padStart(2, '0')}</span>
                <span className="timerColon">:</span>
                <span className="timerSeconds">{String(timeLeft % 60).padStart(2, '0')}</span>
            </div>
            <div className="timerButtons">
                <button className="startButton" onClick={startMainTimer}>start</button>
                <button className="stopButton" onClick={stopTimer}>stop</button>
                <button className="resetButton" onClick={resetMainTimer}>reset</button>
            </div>
        </div>
        
        <div className="breakTimerContainer" style={{display: displayTwo}}>
            <h2 id="timerTitle">time for a short break!</h2>
            <div className="timerDisplay">
                <span className="timerMinutes">{String(Math.floor(timeLeft / 60)).padStart(2, '0')}</span>
                <span className="timerColon">:</span>
                <span className="timerSeconds">{String(timeLeft % 60).padStart(2, '0')}</span>
            </div>
            <div className="timerButtons">
                <button className="startButton" onClick={startBreakTimer}>start</button>
                <button className="stopButton" onClick={stopTimer}>stop</button>
                <button className="resetButton" onClick={resetBreakTimer}>reset</button>
            </div>
        </div>

        <div className="longBreakTimerContainer" style={{display: displayThree}}>
            <h2 id="timerTitle">you deserve a long break</h2>
            <div className="timerDisplay">
                <span className="timerMinutes">{String(Math.floor(timeLeft / 60)).padStart(2, '0')}</span>
                <span className="timerColon">:</span>
                <span className="timerSeconds">{String(timeLeft % 60).padStart(2, '0')}</span>
            </div>
            <div className="timerButtons">
                <button className="startButton" onClick={startLongBreakTimer}>start</button>
                <button className="stopButton" onClick={stopTimer}>stop</button>
                <button className="resetButton" onClick={resetLongBreakTimer}>reset</button>
            </div>
        </div>
            <h2 id="stats">wow! youve studied for {Math.floor((timesCompleted * 12.5) / 60)} hours and {Math.floor((timesCompleted * 12.5) % 60)} minutes today!</h2>
            <button className="resetAllButton" onClick={() => {
                resetMainTimer();
                resetBreakTimer();
                resetLongBreakTimer();
                setTimesCompleted(0);
                setDisplayOne('flex');
                setDisplayTwo('none');
                setDisplayThree('none');
                setTimeLeft(1500);
            }
            }>start fresh!</button>
        </div>
    )
}