"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAssignments } from "../../context/AssignmentsContext";

export default function AssignmentDetail() {
    const params = useParams();
    const router = useRouter();
    const { assignments, updateAssignment, deleteAssignment } = useAssignments();
    
    const assignmentId = parseInt(params.id);
    const assignment = assignments.find(a => a.id === assignmentId);
    
    // get classes from local storage
    const [savedClasses, setSavedClasses] = useState([]);
    
    useEffect(() => {
        const classes = localStorage.getItem("homework-classes");
        if (classes) {
            try {
                setSavedClasses(JSON.parse(classes));
            } catch (error) {
                console.error("Error loading classes:", error);
            }
        }
    }, []);

    const existingSubjects = [...new Set(assignments.map(a => a.subject).filter(Boolean))];
    const allSubjects = [...new Set([
        ...savedClasses.map(cls => typeof cls === 'string' ? cls : cls.name), 
        ...existingSubjects
    ])];

    const getSubjectColor = (subject) => {
        const classObj = savedClasses.find(cls => 
            (typeof cls === 'string' ? cls : cls.name) === subject
        );
        return classObj && typeof classObj === 'object' ? classObj.color : "#f77968";
    };
    
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: "",
        dueDate: "",
        subject: "",
        description: "",
        color: "#f77968"
    });

    useEffect(() => {
        if (assignment) {
            setEditData({
                title: assignment.title || "",
                dueDate: assignment.dueDate || "",
                subject: assignment.subject || "",
                description: assignment.description || "",
                color: assignment.color || "#f77968"
            });
        }
    }, [assignment]);

    if (!assignment) {
        return (
            <div style={{ padding: "2rem", textAlign: "center" }}>
                <h1>assignment not found</h1>
                <button 
                    onClick={() => router.push("/assignments")}
                    style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontFamily: "Lexend Exa, sans-serif",
                    }}
                >
                    back to assignments
                </button>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => {
            const newData = { ...prev, [name]: value };
            if (name === "subject") {
                newData.color = getSubjectColor(value);
            }
            return newData;
        });
    };

    const formatDueDate = (dateString) => {
        if (!dateString) return "no due date";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        return `${month} ${day}`;
    };

    const handleSave = () => {
        updateAssignment(assignmentId, editData);
        setIsEditing(false);
    };

    const handleProgressChange = (e) => {
        const newProgress = parseInt(e.target.value);
        
        if (newProgress === 100) {
            updateAssignment(assignmentId, { progress: newProgress });
            
            const now = new Date();
            const dueDateObj = new Date(assignment.dueDate);
            const oneDayAfterDue = new Date(dueDateObj.getTime() + 24 * 60 * 60 * 1000);
            
            if (now > oneDayAfterDue) {
                setTimeout(() => {
                    deleteAssignment(assignmentId);
                    router.push("/assignments");
                }, 500);
            }
            
        } else {
            updateAssignment(assignmentId, { progress: newProgress });
        }
    };

    const handleDelete = () => {
        if (confirm("are you sure you want to delete this assignment?")) {
            deleteAssignment(assignmentId);
            router.push("/assignments");
        }
    };

    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

    return (
        <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <button 
                    onClick={() => router.push("/assignments")}
                    style={{
                        backgroundColor: "#4b335e",
                        color: "white",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontFamily: "Lexend Exa, sans-serif",
                    }}
                >
                    ← back
                </button>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        style={{
                            backgroundColor: isEditing ? "#8e639a" : "#4b335e",
                            color: "white",
                            border: "none",
                            padding: "0.5rem 1rem",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontFamily: "Lexend Exa, sans-serif",
                        }}
                    >
                        {isEditing ? "cancel" : "edit"}
                    </button>
                    <button
                        onClick={handleDelete}
                        style={{
                            backgroundColor: "#f77968",
                            color: "white",
                            border: "none",
                            padding: "0.5rem 1rem",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontFamily: "Lexend Exa, sans-serif",
                        }}
                    >
                        delete
                    </button>
                </div>
            </div>

            <div style={{
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "2rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
                {isEditing ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "1.1rem", fontFamily: "Lexend Exa, sans-serif" }}>title</label>
                            <input
                                type="text"
                                name="title"
                                value={editData.title}
                                onChange={handleInputChange}
                                style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", fontFamily: "Lexend Exa, sans-serif" }}
                            />
                        </div>
                        
                        <div style={{ display: "flex", gap: "1rem" }}>
                            
                            <div style={{ flex: 1 }}>
                                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "1.1rem", fontFamily: "Lexend Exa, sans-serif" }}>subject</label>
                                <select
                                    name="subject"
                                    value={editData.subject}
                                    onChange={handleInputChange}
                                    style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", fontFamily: "Lexend Exa, sans-serif" }}
                                >
                                    <option value="">select a subject</option>
                                    {savedClasses.map(cls => {
                                        const className = typeof cls === 'string' ? cls : cls.name;
                                        return (
                                            <option key={className} value={className}>
                                                {className}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div style={{ flex: 1 }}>
                                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "1.1rem", fontFamily: "Lexend Exa, sans-serif" }}>due date</label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={editData.dueDate}
                                    onChange={handleInputChange}
                                    style={{ 
                                        width: "100%",
                                        padding: "0.5rem", 
                                        borderRadius: "4px", 
                                        border: "1px solid #ccc",
                                        backgroundColor: "white",
                                        fontFamily: "Lexend Exa, sans-serif"
                                    }}
                                />
                            </div>
                            
                        </div>

                        

                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "1.1rem", fontFamily: "Lexend Exa, sans-serif" }}>description</label>
                            <textarea
                                name="description"
                                value={editData.description}
                                onChange={handleInputChange}
                                rows={5}
                                style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", resize: "vertical", fontFamily: "Lexend Exa, sans-serif" }}
                                placeholder="add notes, requirements, or additional details about this assignment..."
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            style={{
                                backgroundColor: "#8e639a",
                                color: "white",
                                border: "none",
                                padding: "0.75rem 1.5rem",
                                borderRadius: "4px",
                                cursor: "pointer",
                                alignSelf: "flex-start",
                                fontFamily: "Lexend Exa, sans-serif",
                            }}
                        >
                            save changes
                        </button>
                    </div>
                ) : (
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <div style={{
                                    width: "24px",
                                    height: "24px",
                                    backgroundColor: getSubjectColor(assignment.subject) || "#4b335e",
                                    borderRadius: "4px",
                                    border: "1px solid #4b335e",
                                    flexShrink: 0
                                }}></div>
                                <h1 style={{ margin: 0, color: "#333", fontSize: "1.5rem", fontFamily: "Lexend Exa, sans-serif" }}>{assignment.title}</h1>
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem", fontFamily: "Lexend Exa, sans-serif" }}>
                            <div>
                                <strong>due date:</strong> {formatDueDate(assignment.dueDate)}
                            </div>
                            <div>
                                <strong>subject:</strong> {assignment.subject}
                            </div>
                        </div>

                        {assignment.description && (
                            <div style={{ marginBottom: "1.5rem", fontFamily: "Lexend Exa, sans-serif" }}>
                                <strong>description:</strong>
                                <p style={{ marginTop: "0.5rem", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "4px", lineHeight: "1.5", fontFamily: "Lexend Exa, sans-serif" }}>
                                    {assignment.description}
                                </p>
                            </div>
                        )}

                        <div>
                            <strong style={{ fontFamily: "Lexend Exa, sans-serif" }}>progress:</strong>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "0.5rem", fontFamily: "Lexend Exa, sans-serif" }}>
                                <span>{assignment.progress || 0}%</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={assignment.progress}
                                    onChange={handleProgressChange}
                                    onClick={(e) => e.stopPropagation()} // prevent card click when clicking slider
                                    style={{
                                        width: "100%",
                                        height: "8px",
                                        borderRadius: "4px",
                                        background: `linear-gradient(to right, ${assignment.color} 0%, ${assignment.color} ${assignment.progress}%, #e0e0e0 ${assignment.progress}%, #e0e0e0 100%)`,
                                        outline: "none",
                                        cursor: "pointer",
                                        WebkitAppearance: "none",
                                        appearance: "none"
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
