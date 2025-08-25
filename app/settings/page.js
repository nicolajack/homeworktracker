"use client";

import { useState, useEffect } from "react";
import ColorPicker from "../components/ColorPicker";

export default function Settings() {
    const [classes, setClasses] = useState([]);
    const [newClass, setNewClass] = useState("");
    const [newClassColor, setNewClassColor] = useState("#f77968");
    const [isEditing, setIsEditing] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [editColor, setEditColor] = useState("");
    const [hasLoaded, setHasLoaded] = useState(false);

    // load classes from localStorage
    useEffect(() => {
        const savedClasses = localStorage.getItem("homework-classes");
        if (savedClasses) {
            try {
                const parsedClasses = JSON.parse(savedClasses);
                const migratedClasses = parsedClasses.map(cls => {
                    if (typeof cls === 'string') {
                        return {
                            name: cls,
                            color: "#f77968" // default color for migrated classes
                        };
                    }
                    return cls;
                });
                
                setClasses(migratedClasses);
            } catch (error) {
                console.error("Error loading classes:", error);
            }
        }
        setHasLoaded(true);
    }, []);

    // save classes to localStorage whenever classes change (but only after initial load)
    useEffect(() => {
        if (hasLoaded) {
            localStorage.setItem("homework-classes", JSON.stringify(classes));
        }
    }, [classes, hasLoaded]);

    const handleAddClass = () => {
        if (newClass.trim() && !classes.some(cls => cls.name === newClass.trim())) {
            const newClassObj = {
                name: newClass.trim(),
                color: newClassColor
            };
            setClasses([...classes, newClassObj]);
            setNewClass("");
            setNewClassColor("#f77968");
        }
    };

    const handleDeleteClass = (classToDelete) => {
        setClasses(classes.filter(cls => cls.name !== classToDelete.name));
    };

    const handleEditClass = (index, classObj) => {
        setIsEditing(index);
        setEditValue(classObj.name);
        setEditColor(classObj.color);
    };

    const handleSaveEdit = (index) => {
        if (editValue.trim() && !classes.some((cls, i) => i !== index && cls.name === editValue.trim())) {
            const updatedClasses = [...classes];
            updatedClasses[index] = {
                name: editValue.trim(),
                color: editColor
            };
            setClasses(updatedClasses);
        }
        setIsEditing(null);
        setEditValue("");
        setEditColor("");
    };

    const handleCancelEdit = () => {
        setIsEditing(null);
        setEditValue("");
        setEditColor("");
    };

    const handleKeyPress = (e, action, ...params) => {
        if (e.key === 'Enter') {
            action(...params);
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
            <h1 style={{ color: "white", marginBottom: "1rem", fontFamily: "Lexend Exa, sans-serif" }}>settings</h1>
            <div style={{
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "2rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
                <h2 style={{ color: "#4b335e", marginBottom: "1rem", fontFamily: "Lexend Exa, sans-serif" }}>manage classes</h2>
                <p style={{ color: "#666", marginBottom: "2rem", fontFamily: "Lexend Exa, sans-serif" }}>
                    add ur classes here to use them for ur assignments
                </p>

                {/* add new class */}
                <div style={{ marginBottom: "2rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                        <input
                            type="text"
                            value={newClass}
                            onChange={(e) => setNewClass(e.target.value)}
                            onKeyPress={(e) => handleKeyPress(e, handleAddClass)}
                            placeholder="biology, math, etc."
                            style={{
                                flex: 1,
                                padding: "0.75rem",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                                fontSize: "1rem",
                                fontFamily: "Lexend Exa, sans-serif"
                            }}
                        />
                        <button
                            onClick={handleAddClass}
                            style={{
                                backgroundColor: "#4b335e",
                                color: "white",
                                border: "none",
                                padding: "0.75rem 1.5rem",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "1rem",
                                fontFamily: "Lexend Exa, sans-serif"
                            }}
                        >
                            add class
                        </button>
                    </div>
                    <div style={{ fontFamily: "Lexend Exa, sans-serif" }}>
                        <ColorPicker
                            currentColor={newClassColor}
                            onColorChange={setNewClassColor}
                            label="class color:"
                        />
                    </div>
                </div>

                {/* Classes list */}
                {classes.length > 0 ? (
                    <div>
                        <h3 style={{ color: "#4b335e", marginBottom: "1rem", fontFamily: "Lexend Exa, sans-serif" }}>ur classes:</h3>
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            {classes.map((cls, index) => (
                                <li key={index} style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "0.75rem",
                                    margin: "0.5rem 0",
                                    backgroundColor: "#f8f9fa",
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "4px",
                                    fontFamily: "Lexend Exa, sans-serif"
                                }}>
                                    {isEditing === index ? (
                                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
                                            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                                <input
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onKeyPress={(e) => handleKeyPress(e, handleSaveEdit, index)}
                                                    style={{
                                                        flex: 1,
                                                        padding: "0.5rem",
                                                        borderRadius: "4px",
                                                        border: "1px solid #ccc",
                                                        fontFamily: "Lexend Exa, sans-serif"
                                                    }}
                                                    autoFocus
                                                />
                                            </div>
                                            <div style={{ fontFamily: "Lexend Exa, sans-serif" }}>
                                                <ColorPicker
                                                    currentColor={editColor}
                                                    onColorChange={setEditColor}
                                                    label="class color:"
                                                />
                                            </div>
                                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                                <button
                                                    onClick={() => handleSaveEdit(index)}
                                                    style={{
                                                        backgroundColor: "#28a745",
                                                        color: "white",
                                                        border: "none",
                                                        padding: "0.5rem 1rem",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                        fontSize: "0.9rem",
                                                        fontFamily: "Lexend Exa, sans-serif"
                                                    }}
                                                >
                                                    save
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    style={{
                                                        backgroundColor: "#6c757d",
                                                        color: "white",
                                                        border: "none",
                                                        padding: "0.5rem 1rem",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                        fontSize: "0.9rem",
                                                        fontFamily: "Lexend Exa, sans-serif"
                                                    }}
                                                >
                                                    cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                                <div style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    backgroundColor: cls.color,
                                                    borderRadius: "4px",
                                                    border: "1px solid #ccc",
                                                    flexShrink: 0
                                                }}></div>
                                                <span style={{ fontSize: "1.1rem", color: "#333" }}>{cls.name}</span>
                                            </div>
                                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                                <button
                                                    onClick={() => handleEditClass(index, cls)}
                                                    style={{
                                                        backgroundColor: "#7b5d96",
                                                        color: "white",
                                                        border: "none",
                                                        padding: "0.25rem 0.75rem",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                        fontSize: "0.9rem",
                                                        fontFamily: "Lexend Exa, sans-serif"
                                                    }}
                                                >
                                                    edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClass(cls)}
                                                    style={{
                                                        backgroundColor: "#4b335e",
                                                        color: "white",
                                                        border: "none",
                                                        padding: "0.25rem 0.75rem",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                        fontSize: "0.9rem",
                                                        fontFamily: "Lexend Exa, sans-serif"
                                                    }}
                                                >
                                                    delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p style={{ color: "#999", textAlign: "center", padding: "2rem", fontFamily: "Lexend Exa, sans-serif" }}>
                        silly!! u need to add classes here to use them for ur assignments
                    </p>
                )}
            </div>
        </div>
    );
}