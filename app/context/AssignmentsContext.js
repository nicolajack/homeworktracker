"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AssignmentsContext = createContext();

export function AssignmentsProvider({ children }) {
    const [assignments, setAssignments] = useState([]);

    // load assignments from local storage
    useEffect(() => {
        const savedAssignments = localStorage.getItem("homework-assignments");
        if (savedAssignments) {
            try {
                const parsed = JSON.parse(savedAssignments);
                // ensure archived flag exists on older saved items
                const normalized = parsed.map(a => ({ ...a, archived: a.archived ?? false }));
                setAssignments(normalized);
            } catch (error) {
                console.error("Error loading assignments from localStorage:", error);
            }
        }
    }, []);

    // save assignments to local storage whenever they change
    useEffect(() => {
        localStorage.setItem("homework-assignments", JSON.stringify(assignments));
    }, [assignments]);

    const addAssignment = (assignment) => {
        const newAssignment = {
            id: Date.now(),
            ...assignment,
            progress: 0,
            archived: false
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

    const archiveAssignment = (id) => {
        // mark as archived instead of removing so calendar can still show completed items
        setAssignments(prev => prev.map(assignment =>
            assignment.id === id ? { ...assignment, archived: true } : assignment
        ));
    };

    const value = {
        assignments,
        addAssignment,
        updateAssignment,
        archiveAssignment
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
