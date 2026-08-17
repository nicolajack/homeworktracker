"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { THEME_PALETTES, THEME_STORAGE_KEY, findPaletteById, applyPaletteVars } from "@/app/theme";

const AssignmentsContext = createContext();

export function AssignmentsProvider({ children }) {
    const [assignments, setAssignments] = useState([]);
    const [classes, setClasses] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState("twilight");
    const [name, setName] = useState("you");

    // Track authentication state
    useEffect(() => {
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getInitialSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            
            if (event === 'SIGNED_OUT') {
                setAssignments([]);
                setClasses([]);
                setName("you");
                setTheme("twilight");
                localStorage.removeItem("homework-assignments");
                localStorage.removeItem("homework-classes");
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Load data from Supabase or localStorage
    useEffect(() => {
        if (loading) return;

        const fetchData = async () => {
            if (user) {
                // 1. Fetch User Settings (name, theme, classes)
                try {
                    const { data: settingsData } = await supabase
                        .from("user_settings")
                        .select("theme, name, classes")
                        .eq("user_id", user.id)
                        .maybeSingle();

                    if (settingsData?.name) setName(settingsData.name);
                    if (settingsData?.classes) setClasses(settingsData.classes);

                    let currentTheme = settingsData?.theme;
                    const localTheme = localStorage.getItem(THEME_STORAGE_KEY);

                    if (localTheme && !currentTheme) {
                        currentTheme = localTheme;
                        await supabase.from("user_settings").upsert({
                            user_id: user.id,
                            theme: localTheme
                        });
                        localStorage.removeItem(THEME_STORAGE_KEY);
                    }

                    const activeTheme = currentTheme || "twilight";
                    setTheme(activeTheme);
                    applyPaletteVars(findPaletteById(activeTheme) || THEME_PALETTES[0]);
                } catch (e) {
                    console.error("Error loading user settings:", e);
                }

                // 2. Fetch Assignments
                const { data: assData, error: assError } = await supabase
                    .from("assignments")
                    .select("*")
                    .eq("user_id", user.id);

                if (!assError && assData) {
                    setAssignments(assData.map(row => ({
                        ...(row.data || row),
                        db_id: row.id
                    })));
                }

            } else {
                // Fallback for guest users
                const savedName = localStorage.getItem("homework-name");
                if (savedName) setName(savedName);

                const savedThemeId = localStorage.getItem(THEME_STORAGE_KEY);
                const activeTheme = savedThemeId || "twilight";
                setTheme(activeTheme);
                applyPaletteVars(findPaletteById(activeTheme) || THEME_PALETTES[0]);

                const savedAssignments = localStorage.getItem("homework-assignments");
                if (savedAssignments) {
                    try {
                        setAssignments(JSON.parse(savedAssignments).map(a => ({ ...a, archived: a.archived ?? false })));
                    } catch (e) {
                        console.error("Error reading assignments from localStorage:", e);
                    }
                }

                const savedClasses = localStorage.getItem("homework-classes");
                if (savedClasses) {
                    try {
                        const parsed = JSON.parse(savedClasses);
                        setClasses(parsed.map(cls => typeof cls === 'string' ? { name: cls, color: "#f77968" } : cls));
                    } catch (e) {
                        console.error("Error reading classes from localStorage:", e);
                    }
                }
            }
        };

        fetchData();
    }, [user, loading]);

    // Theme Switcher
    const changeTheme = async (newThemeId) => {
        const palette = findPaletteById(newThemeId);
        if (!palette) return;

        setTheme(newThemeId);
        applyPaletteVars(palette);

        if (user) {
            await supabase.from("user_settings").upsert({
                user_id: user.id,
                theme: newThemeId
            });
        } else {
            localStorage.setItem(THEME_STORAGE_KEY, newThemeId);
        }
    };

    // Assignments CRUD Operations
    const addAssignment = async (assignment) => {
        const newAssignment = {
            id: crypto.randomUUID(),
            ...assignment,
            progress: assignment.progress ?? 0,
            archived: assignment.archived ?? false
        };

        if (user) {
            const { data, error } = await supabase
                .from("assignments")
                .insert([{ user_id: user.id, data: newAssignment }])
                .select();

            if (!error && data?.length > 0) {
                setAssignments(prev => [...prev, { ...newAssignment, db_id: data[0].id }]);
            }
        } else {
            setAssignments(prev => [...prev, newAssignment]);
        }
    };

    const updateAssignment = async (id, updates) => {
        setAssignments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));

        if (user) {
            const item = assignments.find(a => a.id === id);
            if (item?.db_id) {
                const updatedItem = { ...item, ...updates };
                delete updatedItem.db_id;
                await supabase
                    .from("assignments")
                    .update({ data: updatedItem })
                    .eq("id", item.db_id);
            }
        }
    };

    const archiveAssignment = async (id) => {
        await updateAssignment(id, { archived: true });
    };

    const deleteAssignment = async (id) => {
        const itemToDelete = assignments.find(a => a.id === id);
        setAssignments(prev => prev.filter(a => a.id !== id));

        if (user && itemToDelete?.db_id) {
            await supabase
                .from("assignments")
                .delete()
                .eq("id", itemToDelete.db_id);
        }
    };

    return (
        <AssignmentsContext.Provider value={{
            assignments,
            classes,
            user,
            loading,
            theme,
            name,
            changeTheme,
            addAssignment,
            updateAssignment,
            archiveAssignment,
            deleteAssignment,
        }}>
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