"use client";

import { useState, useEffect } from "react";
import ColorPicker from "../components/ColorPicker";
import { useAssignments } from "@/app/context/AssignmentsContext";
import { supabase } from "@/app/lib/supabase";

export default function Settings() {
    const [classes, setClasses] = useState([]);
    const [newClass, setNewClass] = useState("");
    const [newClassColor, setNewClassColor] = useState("#f77968");
    const [isEditing, setIsEditing] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [editColor, setEditColor] = useState("");
    const [name, setName] = useState("you");
    const [hasLoaded, setHasLoaded] = useState(false);

    const { user } = useAssignments();

    // Sync state with DB or LocalStorage
    useEffect(() => {
        const loadSettings = async () => {
            if (user) {
                // Check local storage to migrate initial data
                const localClasses = localStorage.getItem("homework-classes");
                const localName = localStorage.getItem("homework-name");

                const { data } = await supabase.from("user_settings").select("*").eq("user_id", user.id).single();

                let initialClasses = data?.classes ?? [];
                let initialName = data?.name ?? "you";

                if (localClasses || localName) {
                    if (localClasses && initialClasses.length === 0) {
                        try { initialClasses = JSON.parse(localClasses); } catch (e) {}
                    }
                    if (localName && initialName === "you") {
                        initialName = localName;
                    }
                    // Upsert into Supabase & clear localStorage
                    await supabase.from("user_settings").upsert({
                        user_id: user.id,
                        name: initialName,
                        classes: initialClasses
                    });
                    localStorage.removeItem("homework-classes");
                    localStorage.removeItem("homework-name");
                }

                setClasses(initialClasses);
                setName(initialName);
            } else {
                const savedClasses = localStorage.getItem("homework-classes");
                if (savedClasses) {
                    try {
                        const parsedClasses = JSON.parse(savedClasses);
                        setClasses(parsedClasses.map(cls => typeof cls === 'string' ? { name: cls, color: "#f77968" } : cls));
                    } catch (error) {
                        console.error("Error loading classes:", error);
                    }
                }
                const savedName = localStorage.getItem("homework-name");
                if (savedName) setName(savedName);
            }
            setHasLoaded(true);
        };

        loadSettings();
    }, [user]);

    // Save helpers
    const saveSettingsToDB = async (updatedName, updatedClasses) => {
        if (user) {
            await supabase.from("user_settings").upsert({
                user_id: user.id,
                name: updatedName,
                classes: updatedClasses
            });
        }
    };

    const handleNameChange = (newName) => {
        setName(newName);
        if (!user) localStorage.setItem("homework-name", newName);
        else saveSettingsToDB(newName, classes);
    };

    const updateClasses = (newClasses) => {
        setClasses(newClasses);
        if (!user && hasLoaded) {
            localStorage.setItem("homework-classes", JSON.stringify(newClasses));
        } else if (user) {
            saveSettingsToDB(name, newClasses);
        }
    };

    const handleAddClass = () => {
        if (newClass.trim() && !classes.some(cls => cls.name === newClass.trim())) {
            const updated = [...classes, { name: newClass.trim(), color: newClassColor }];
            updateClasses(updated);
            setNewClass("");
            setNewClassColor("#f77968");
        }
    };

    const handleDeleteClass = (classToDelete) => {
        const updated = classes.filter(cls => cls.name !== classToDelete.name);
        updateClasses(updated);
    };

    const handleEditClass = (index, classObj) => {
        setIsEditing(index);
        setEditValue(classObj.name);
        setEditColor(classObj.color);
    };

    const handleSaveEdit = (index) => {
        if (editValue.trim() && !classes.some((cls, i) => i !== index && cls.name === editValue.trim())) {
            const updated = [...classes];
            updated[index] = { name: editValue.trim(), color: editColor };
            updateClasses(updated);
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
        if (e.key === 'Enter') action(...params);
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
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="ethel cain"
                        className="settingsTextInput"
                    />
                </div>

                <h2 className="settingsSectionTitle">manage classes</h2>
                <p className="settingsSubtitle">
                    add your classes here to use them for your assignments
                </p>

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
                        <button onClick={handleAddClass} className="settingsPrimaryButton">
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
                                                <button onClick={() => handleSaveEdit(index)} className="settingsSaveButton">
                                                    save
                                                </button>
                                                <button onClick={handleCancelEdit} className="settingsCancelButton">
                                                    cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="settingsClassInfo">
                                                <div className="settingsClassColorSwatch" style={{ backgroundColor: cls.color }} />
                                                <span className="settingsClassName">{cls.name}</span>
                                            </div>
                                            <div className="settingsClassActions">
                                                <button onClick={() => handleEditClass(index, cls)} className="settingsSecondaryButton">
                                                    edit
                                                </button>
                                                <button onClick={() => handleDeleteClass(cls)} className="settingsDangerButton">
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