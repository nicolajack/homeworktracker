"use client";
import React, { useState } from "react";
import "./calendar.css"
import { useAssignments } from "../context/AssignmentsContext";
import { useRouter } from "next/navigation";

export default function Calendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const { assignments } = useAssignments();
    const router = useRouter();

    const daysInMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
    ).getDate();

    const firstDayOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
    ).getDay();

    const handlePreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    function convertDateFormat(day){
        const year = currentMonth.getFullYear()
        let month = String(currentMonth.getMonth() + 1).padStart(2, '0')
        let dayStr = String(day).padStart(2, '0')
        return `${year}-${month}-${dayStr}`
    }

    const today = new Date();
    const isToday = (day) => {
        return today.getFullYear() === currentMonth.getFullYear() 
            && today.getMonth() === currentMonth.getMonth() 
            && today.getDate() === day;
    };

    return (
        <div className="calendar">
            <div className="calendar-header">
                <button className="calendar-nav-btn" onClick={handlePreviousMonth}>‹</button>
                <h1 className="calendar-title">
                    {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
                </h1>
                <button className="calendar-nav-btn" onClick={handleNextMonth}>›</button>
            </div>
            <div className="calendar-grid">
                {['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map(day => (
                    <div className="calendar-weekday" key={day}>{day}</div>
                ))}
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div className="calendar-day empty" key={`empty-${index}`}></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1;
                    const dateString = convertDateFormat(day)
                    const dayAssignments = assignments.filter(a => a.dueDate === dateString)
                    return (
                        <div className={`calendar-day${isToday(day) ? ' today' : ''}${dayAssignments.length > 0 ? ' has-assignments' : ''}`} key={day}>
                            <span className="day-number">{day}</span>
                            <div className="day-assignments">
                                {dayAssignments.map(a => (
                                    <div 
                                        className="calAssignment" 
                                        key={a.id} 
                                        onClick={() => router.push(`/assignment/${a.id}`)} 
                                        style={{ backgroundColor: a.color || "#4b335e" }}
                                    >
                                        {a.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}