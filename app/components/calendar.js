"use client";
import React, { useState } from "react";
import "./calendar.css"
import { useAssignments } from "../context/AssignmentsContext";
import { useRouter } from "next/navigation";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag, useDrop } from 'react-dnd';

export default function Calendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const { assignments, updateAssignment } = useAssignments();
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

    // drag-and-drop item type
    const ItemTypes = {
        ASSIGNMENT: 'assignment'
    }

    // draggable assignment component
    const DraggableAssignment = ({ assignment }) => {
        const [{ isDragging }, drag] = useDrag(() => ({
            type: ItemTypes.ASSIGNMENT,
            item: { id: assignment.id },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging()
            })
        }));

        return (
            <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
                <div 
                    className="calAssignment"
                    onClick={() => router.push(`/assignment/${assignment.id}`)}
                    style={{
                        backgroundColor: assignment.color || "#4b335e",
                        textDecoration: assignment.progress === 100 ? "line-through" : "none",
                        opacity: assignment.progress === 100 ? 0.6 : 1
                    }}
                >
                    {assignment.title}
                </div>
            </div>
        );
    };

    // define day cell to drop in
    const DayCell = ({ day, dateString, dayAssignments }) => {
        const [{ isOver }, drop] = useDrop(() => ({
            accept: ItemTypes.ASSIGNMENT,
            drop: (item) => {
                if (item && item.id) {
                    updateAssignment(item.id, { dueDate: dateString });
                }
            },
            collect: (monitor) => ({ isOver: !!monitor.isOver() })
        }), [dateString]);

        return (
            <div ref={drop} className={`calendar-day${isToday(day) ? ' today' : ''}${dayAssignments.length > 0 ? ' has-assignments' : ''}${isOver ? ' drop-over' : ''}`} key={day}>
                <span className="day-number">{day}</span>
                <div className="day-assignments">
                    {dayAssignments.map(a => (
                        <DraggableAssignment key={a.id} assignment={a} />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="calendar">
            <DndProvider backend={HTML5Backend}>
                <div className="calendar-header">
                    <button className="calendar-nav-btn" onClick={handlePreviousMonth}>‹</button>
                    <h1 className="calendar-title">
                        {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
                    </h1>
                    <button className="calendar-nav-btn" onClick={handleNextMonth}>›</button>
                </div>
                <div className="calendar-grid">
                    {['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map(dayName => (
                        <div className="calendar-weekday" key={dayName}>{dayName}</div>
                    ))}
                    {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                        <div className="calendar-day empty" key={`empty-${index}`}></div>
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1;
                        const dateString = convertDateFormat(day);
                        const dayAssignments = assignments.filter(a => a.dueDate === dateString);
                        return (
                            <DayCell key={day} day={day} dateString={dateString} dayAssignments={dayAssignments} />
                        );
                    })}
                </div>
            </DndProvider>
        </div>
    );
}