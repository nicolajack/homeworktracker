"use client";

import { useState, useEffect } from "react";
import Assignment from "../components/assignment";
import { useAssignments } from "../context/AssignmentsContext";

export default function Assignments() {
    const { assignments, addAssignment } = useAssignments();
    
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
    
    const [showForm, setShowForm] = useState(false);
    const [newAssignment, setNewAssignment] = useState({
        title: "",
        dueDate: "",
        subject: ""
    });

    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

    const getSubjectColor = (subject) => {
        const classObj = savedClasses.find(cls => 
            (typeof cls === 'string' ? cls : cls.name) === subject
        );
        return classObj && typeof classObj === 'object' ? classObj.color : "#f77968";
    };

    const handleAddAssignment = () => {
        if (newAssignment.title && newAssignment.dueDate && newAssignment.subject) {
            const assignmentWithColor = {
                ...newAssignment,
                color: getSubjectColor(newAssignment.subject)
            };
            addAssignment(assignmentWithColor);
            setNewAssignment({ title: "", dueDate: "", subject: "" });
            setShowForm(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAssignment(prev => ({ ...prev, [name]: value }));
    };

    const formatDueDate = (dateString) => {
        if (!dateString) return "no due date";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        return `${month} ${day}`;
    };

    return (
        <div style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h1 id="assignmentsTitle">assignments</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        backgroundColor: "#4b335e",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "50px",
                        height: "50px",
                        fontSize: "24px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    +
                </button>
            </div>

            {showForm && (
                <div style={{
                    backgroundColor: "#f8f9fa",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    marginBottom: "2rem",
                    border: "1px solid #e0e0e0"
                }}>
                    <h3 id="title2" style={{ marginBottom: "1rem" }}>create new assignment</h3>
                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        <div style={{ minWidth: "150px", minHeight: "40px" }}>
                            <p style={{ marginBottom: "0.5rem", fontFamily: "Lexend Exa, sans-serif", fontWeight: "bold" }}>title:</p>
                            <input
                                type="text"
                                name="title"
                                placeholder="assignment title"
                                value={newAssignment.title}
                                onChange={handleInputChange}
                                style={{ borderRadius: "4px", border: "1px solid #ccc", flex: "1", minWidth: "200px", padding: "0.5rem", textAlign: "left", fontFamily: "Lexend Exa, sans-serif", height: "40px" }}
                            />
                        </div>
                        <div style={{ flex: "1", minWidth: "150px", minHeight: "40px" }}>
                            <p style={{ marginBottom: "0.5rem", fontFamily: "Lexend Exa, sans-serif", fontWeight: "bold" }}>due date:</p>
                            <input
                                type="date"
                                name="dueDate"
                                value={newAssignment.dueDate}
                                onChange={handleInputChange}
                                style={{ 
                                    width: "100%",
                                    padding: "0.5rem", 
                                    borderRadius: "4px", 
                                    border: "1px solid #ccc",
                                    backgroundColor: "white",
                                    fontFamily: "Lexend Exa, sans-serif",
                                    height: "40px"
                                }}
                            />
                        </div>
                        <div style={{ flex: "1", minWidth: "120px" }}>
                            <p style={{ marginBottom: "0.5rem", fontFamily: "Lexend Exa, sans-serif", fontWeight: "bold" }}>subject:</p>
                            <select
                                name="subject"
                                value={newAssignment.subject}
                                onChange={handleInputChange}
                                style={{ 
                                    width: "100%",
                                    padding: "0.5rem", 
                                    borderRadius: "4px", 
                                    border: "1px solid #ccc",
                                    backgroundColor: "white",
                                    fontFamily: "Lexend Exa, sans-serif",
                                    height: "40px"
                                }}
                            >
                                
                                <option value="">select subject</option>
                                {allSubjects.length > 0 ? (
                                    allSubjects.map((subject) => (
                                        <option key={subject} value={subject}>{subject}</option>
                                    ))
                                ) : (
                                    <option disabled>no classes found! add some in settings</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                        <button
                            onClick={handleAddAssignment}
                            style={{
                                backgroundColor: "#4b335e",
                                color: "white",
                                border: "none",
                                padding: "0.5rem 1rem",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontFamily: "Lexend Exa, sans-serif"
                            }}
                        >
                            add assignment
                        </button>
                        <button
                            onClick={() => {
                                setShowForm(false);
                                setNewAssignment({ title: "", dueDate: "", subject: "" });
                            }}
                            style={{
                                backgroundColor: "#8e639a",
                                color: "white",
                                border: "none",
                                padding: "0.5rem 1rem",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontFamily: "Lexend Exa, sans-serif"
                            }}
                        >
                            cancel
                        </button>
                    </div>
                </div>
            )}

            <ul style={{ listStyle: "none", padding: 0 }}>
                {assignments
                    .sort((a, b) => {
                        if (!a.dueDate && !b.dueDate) return 0;
                        if (!b.dueDate) return -1;
                        
                        // closest due date first
                        return new Date(a.dueDate) - new Date(b.dueDate);
                    })
                    .map((assignment) => (
                    <li id="assignmentList" key={assignment.id} style={{
                        marginBottom: "1rem",
                        backgroundColor: "#fff",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        padding: "1rem",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}>
                        <Assignment 
                            id={assignment.id}
                            title={assignment.title} 
                            dueDate={assignment.dueDate} 
                            subject={assignment.subject}
                            progress={assignment.progress || 0}
                            color={assignment.color || getSubjectColor(assignment.subject)}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}