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
    const [name, setName] = useState("you");

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
                            color: "#f77968"
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

    // load saved name from localStorage
    useEffect(() => {
        const savedName = localStorage.getItem("homework-name");
        if (savedName) {
            setName(savedName);
        }
    }, []);

    // persist name to localStorage when it changes
    useEffect(() => {
        if (name !== undefined) {
            localStorage.setItem("homework-name", name);
        }
    }, [name]);

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
        <div className="settingsPage">
            <h1 className="settingsTitle">settings</h1>
            <div className="settingsCard">
                <h2 className="settingsSectionTitle">add your name</h2>

                <div className="settingsNameRow">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="ethel cain"
                        className="settingsTextInput"
                    />
                </div>

                <h2 className="settingsSectionTitle">manage classes</h2>
                <p className="settingsSubtitle">
                    add your classes here to use them for your assignments
                </p>

                {/* add new class */}
                <div className="settingsAddClassSection">
                    <div className="settingsAddClassRow">
                        <input
                            type="text"
                            value={newClass}
                            onChange={(e) => setNewClass(e.target.value)}
                            onKeyPress={(e) => handleKeyPress(e, handleAddClass)}
                            placeholder="biology, math, etc."
                            className="settingsTextInput"
                        />
                        <button
                            onClick={handleAddClass}
                            className="settingsPrimaryButton"
                        >
                            add class
                        </button>
                    </div>
                    <div className="settingsColorPickerWrapper">
                        <ColorPicker
                            currentColor={newClassColor}
                            onColorChange={setNewClassColor}
                            label="class color:"
                        />
                    </div>
                </div>

                {/* classes list */}
                {classes.length > 0 ? (
                    <div>
                        <h3 className="settingsClassesHeader">ur classes:</h3>
                        <ul className="settingsClassesList">
                            {classes.map((cls, index) => (
                                <li key={index} className="settingsClassItem">
                                    {isEditing === index ? (
                                        <div className="settingsEditWrapper">
                                            <div className="settingsEditRow">
                                                <input
                                                    type="text"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onKeyPress={(e) => handleKeyPress(e, handleSaveEdit, index)}
                                                    className="settingsEditInput"
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="settingsColorPickerWrapper">
                                                <ColorPicker
                                                    currentColor={editColor}
                                                    onColorChange={setEditColor}
                                                    label="class color:"
                                                />
                                            </div>
                                            <div className="settingsEditButtonsRow">
                                                <button
                                                    onClick={() => handleSaveEdit(index)}
                                                    className="settingsSaveButton"
                                                >
                                                    save
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="settingsCancelButton"
                                                >
                                                    cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="settingsClassInfo">
                                                <div
                                                    className="settingsClassColorSwatch"
                                                    style={{ backgroundColor: cls.color }}
                                                />
                                                <span className="settingsClassName">{cls.name}</span>
                                            </div>
                                            <div className="settingsClassActions">
                                                <button
                                                    onClick={() => handleEditClass(index, cls)}
                                                    className="settingsSecondaryButton"
                                                >
                                                    edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClass(cls)}
                                                    className="settingsDangerButton"
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
                    <p className="settingsEmptyState">
                        silly!! u need to add classes here to use them for ur assignments
                    </p>
                )}
            </div>
        </div>
    );
}