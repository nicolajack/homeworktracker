"use client";

import { useRouter } from "next/navigation";
import { useAssignments } from "../context/AssignmentsContext";

export default function Assignment ({ id, title, dueDate, subject, progress = 0, color = "#f77968", clickable = true }) {
    const router = useRouter();
    const { updateAssignment, deleteAssignment } = useAssignments();

    const assignmentColor = color || "#f77968"; // Default to red if no color is provided

    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

    const formatDueDate = (dateString) => {
        if (!dateString) return "no due date";
        
        // Parse the date string as local date to avoid timezone issues
        const [year, month, day] = dateString.split('-');
        const date = new Date(year, month - 1, day); // month is 0-indexed
        
        if (isNaN(date.getTime())) return dateString;
        
        const monthName = monthNames[date.getMonth()];
        const dayNumber = date.getDate();
        return `${monthName} ${dayNumber}`;
    };

    const handleProgressChange = (e) => {
        e.stopPropagation();
        const newProgress = parseInt(e.target.value);
        
        if (newProgress === 100) {
            setTimeout(() => {
                deleteAssignment(id);
            }, 500);
        }
        
        updateAssignment(id, { progress: newProgress });
    };

    const handleCardClick = () => {
        if (clickable) {
            router.push(`/assignment/${id}`);
        }
    };

    return (
        <div 
            onClick={handleCardClick}
            style={{ 
                opacity: progress === 100 ? 0.7 : 1,
                cursor: clickable ? "pointer" : "default",
                position: "relative",
            }}
            id="assignmentCard"
        >
            <div id="blockAndInfo">
                <div 
                    className="colorBlock"
                    style={{ backgroundColor: color }}
                >
                </div>
                <div className="assignmentCard">
                    {/* Top row: Title/Subject on left, Due date/Progress on right */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                        {/* Left side: Title and Subject */}
                        <div style={{ flex: 1, marginRight: "1rem" }}>
                            <h2 style={{ 
                                fontSize: "1.7rem", 
                                color: progress === 100 ? "#28a745" : "#4b335e",
                                textDecoration: progress === 100 ? "line-through" : "none",
                                transition: "color 1s ease",
                                margin: "0 0 0.5rem 0",
                                fontFamily: "Lexend Exa, sans-serif",
                                fontWeight: "bold",
                            }}>
                                {title} {progress === 100 && "✅"}
                            </h2>
                            <p style={{ color: "#fff", margin: "0", background: color, borderRadius: "6px", display: "inline-block", padding: "3px 10px", fontSize: "1.1rem", fontFamily: "Lexend Exa, sans-serif" }}>
                                {subject}
                            </p>
                        </div>
                        
                        {/* Right side: Due date and Progress percentage */}
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <p style={{ color: "#4b335e", margin: "0 0 0.5rem 0", fontSize: "1.3rem", fontWeight: "bold", fontFamily: "Lexend Exa, sans-serif" }}>
                                {formatDueDate(dueDate)}
                            </p>
                            <p style={{ 
                                color: progress === 100 ? "#28a745" : "#666",
                                fontWeight: progress === 100 ? "bold" : "normal",
                                margin: "0",
                                fontSize: "1.1rem",
                                fontFamily: "Lexend Exa, sans-serif",
                            }}>
                                {progress === 100 ? "completed!" : `${progress}%`}
                            </p>
                        </div>
                    </div>
                    
                    {/* Bottom row: Progress slider spanning full width */}
                    <div style={{ width: "100%" }}>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={handleProgressChange}
                            onClick={(e) => e.stopPropagation()} // Prevent card click when clicking slider
                            style={{
                                width: "100%",
                                height: "8px",
                                borderRadius: "4px",
                                background: `linear-gradient(to right, ${color} 0%, ${color} ${progress}%, #e0e0e0 ${progress}%, #e0e0e0 100%)`,
                                outline: "none",
                                cursor: "pointer",
                                WebkitAppearance: "none",
                                appearance: "none"
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}