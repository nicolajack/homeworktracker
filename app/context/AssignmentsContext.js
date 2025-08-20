"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AssignmentsContext = createContext();

export function AssignmentsProvider({ children }) {
    const [assignments, setAssignments] = useState([]);

    // Load assignments from localStorage on mount
    useEffect(() => {
        const savedAssignments = localStorage.getItem("homework-assignments");
        if (savedAssignments) {
            try {
                setAssignments(JSON.parse(savedAssignments));
            } catch (error) {
                console.error("Error loading assignments from localStorage:", error);
            }
        }
    }, []);

    // Save assignments to localStorage whenever assignments change
    useEffect(() => {
        localStorage.setItem("homework-assignments", JSON.stringify(assignments));
    }, [assignments]);

    const addAssignment = (assignment) => {
        const newAssignment = {
            id: Date.now(), // Use timestamp for unique ID
            ...assignment,
            progress: 0 // Default progress
        };
        setAssignments(prev => [...prev, newAssignment]);
    };

    const updateAssignment = (id, updates) => {
        setAssignments(prev => 
            prev.map(assignment => 
                assignment.id === id 
                    ? { ...assignment, ...updates }
                    : assignment
            )
        );
    };

    const deleteAssignment = (id) => {
        setAssignments(prev => prev.filter(assignment => assignment.id !== id));
    };

    const value = {
        assignments,
        addAssignment,
        updateAssignment,
        deleteAssignment
    };

    return (
        <AssignmentsContext.Provider value={value}>
            {children}
        </AssignmentsContext.Provider>
    );
}

export function useAssignments() {
    const context = useContext(AssignmentsContext);
    if (!context) {
        throw new Error("useAssignments must be used within an AssignmentsProvider");
    }
    return context;
}
