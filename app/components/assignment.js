"use client";

import { useRouter } from "next/navigation";
import { useAssignments } from "../context/AssignmentsContext";
import { useEffect } from "react";

export default function Assignment ({ id, title, dueDate, subject, progress = 0, color = "#f77968", clickable = true }) {
    const router = useRouter();
    const { updateAssignment, archiveAssignment } = useAssignments();

    const assignmentColor = color || "#f77968"; 

    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

    useEffect(() => {
        if (dueDate) {
            const now = new Date();
            const dueDateObj = new Date(dueDate);
            const oneDayAfterDue = new Date(dueDateObj.getTime() + 24 * 60 * 60 * 1000); // add 1 day
            
            if (progress == 100 && now > oneDayAfterDue) {
                setTimeout(() => {
                    archiveAssignment(id);
                }, 100);
            }
        }
    }, [dueDate, id, archiveAssignment]);

    const formatDueDate = (dateString) => {
        if (!dateString) return "no due date";
        
        // Parse the date string as local date to avoid timezone issues
        const [year, month, day] = dateString.split('-');
        const date = new Date(year, month - 1, day);
        
        if (isNaN(date.getTime())) return dateString;
        
        const monthName = monthNames[date.getMonth()];
        const dayNumber = date.getDate();
        return `${monthName} ${dayNumber}`;
    };

    const handleProgressChange = (e) => {
        e.stopPropagation();
        const newProgress = parseInt(e.target.value);
        
        if (newProgress === 100) {
            updateAssignment(id, { progress: newProgress });
            
            const now = new Date();
            const dueDateObj = new Date(dueDate);
            const oneDayAfterDue = new Date(dueDateObj.getTime() + 24 * 60 * 60 * 1000);
            
            if (now > oneDayAfterDue) {
                setTimeout(() => {
                    archiveAssignment(id);
                }, 500);
            }
        } else {
            updateAssignment(id, { progress: newProgress });
        }
    };

    const handleCardClick = () => {
        if (clickable) {
            router.push(`/assignment/${id}`);
        }
    };

    return (
        <div 
            onClick={handleCardClick}
            className="assignmentCardRoot"
            style={{ 
                opacity: progress === 100 ? 0.7 : 1,
                cursor: clickable ? "pointer" : "default",
            }}
        >
            <div id="blockAndInfo">
                <div 
                    className="colorBlock"
                    style={{ backgroundColor: assignmentColor }}
                />
                <div className="assignmentCard">
                    {/* top row */}
                    <div className="assignmentTopRow">
                        {/* left side */}
                        <div className="assignmentLeft">
                            <h2
                                className={`assignmentTitle${progress === 100 ? " assignmentTitleCompleted" : ""}`}
                            >
                                {title}
                            </h2>
                            <p
                                className="assignmentSubjectChip"
                                style={{ background: assignmentColor }}
                            >
                                {subject}
                            </p>
                        </div>
                        {/* right side */}
                        <div className="assignmentRight">
                            <p className="assignmentDueDate">
                                {formatDueDate(dueDate)}
                            </p>
                            <p className={`assignmentProgressText${progress === 100 ? " assignmentProgressTextDone" : ""}`}>
                                {progress === 100 ? "completed!" : `${progress}%`}
                            </p>
                        </div>
                    </div>
                    {/* bottom row */}
                    <div className="assignmentBottomRow">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={handleProgressChange}
                            onClick={(e) => e.stopPropagation()}
                            className="assignmentProgressRange"
                            style={{
                                background: `linear-gradient(to right, ${assignmentColor} 0%, ${assignmentColor} ${progress}%, #e0e0e0 ${progress}%, #e0e0e0 100%)`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}