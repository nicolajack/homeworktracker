"use client";
import React, { useState, useEffect } from 'react';
import ToDoItem from '../components/todoitem';
import { useAssignments } from "@/app/context/AssignmentsContext";
import { supabase } from "@/app/lib/supabase";

export default function ToDo() {
    const [tasks, setTasks] = useState([]);
    const [text, setText] = useState("");
    const { user } = useAssignments();

    useEffect(() => {
        const loadTasks = async () => {
            if (user) {
                // Migrate guest tasks if they exist
                const savedTasks = localStorage.getItem("todo-tasks");
                if (savedTasks) {
                    try {
                        const parsed = JSON.parse(savedTasks);
                        if (parsed.length > 0) {
                            const toUpload = parsed.map(t => ({
                                user_id: user.id,
                                text: t.text,
                                completed: t.completed
                            }));
                            await supabase.from("todos").insert(toUpload);
                            localStorage.removeItem("todo-tasks");
                        }
                    } catch (e) {
                        console.error("Error migrating local tasks:", e);
                    }
                }

                // Load tasks from Supabase
                const { data, error } = await supabase.from("todos").select("*");
                if (!error && data) {
                    setTasks(data.map(t => ({ id: t.id, text: t.text, completed: t.completed })));
                }
            } else {
                // Fallback to localStorage for guest users
                const savedTasks = localStorage.getItem("todo-tasks");
                if (savedTasks) {
                    try {
                        setTasks(JSON.parse(savedTasks));
                    } catch (error) {
                        console.error("Error loading tasks:", error);
                    }
                } else {
                    setTasks([
                        { id: 1, text: "have a good day!", completed: false },
                        { id: 2, text: "smile", completed: false },
                    ]);
                }
            }
        };

        loadTasks();
    }, [user]);

    // Save to localStorage for guests
    useEffect(() => {
        if (!user && (tasks.length > 0 || localStorage.getItem("todo-tasks"))) {
            localStorage.setItem("todo-tasks", JSON.stringify(tasks));
        }
    }, [tasks, user]);

    async function addTask(text) {
        if (!text.trim()) return;

        if (user) {
            const { data, error } = await supabase
                .from("todos")
                .insert([{ user_id: user.id, text: text.trim(), completed: false }])
                .select();

            if (!error && data.length > 0) {
                setTasks(prev => [...prev, { id: data[0].id, text: data[0].text, completed: data[0].completed }]);
            }
        } else {
            const newTask = { id: Date.now(), text: text.trim(), completed: false };
            setTasks(prev => [...prev, newTask]);
        }
        setText("");
    }

    async function deleteTask(id) {
        setTasks(prev => prev.filter(task => task.id !== id));
        if (user) {
            await supabase.from("todos").delete().eq("id", id);
        }
    }

    async function toggleCompleted(id) {
        const target = tasks.find(t => t.id === id);
        if (!target) return;

        const newCompleted = !target.completed;
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: newCompleted } : t));

        if (user) {
            await supabase.from("todos").update({ completed: newCompleted }).eq("id", id);
        }
    }

    async function editTask(id, newText) {
        if (!newText || !newText.trim()) return;
        const trimmed = newText.trim();

        setTasks(prev => prev.map(t => t.id === id ? { ...t, text: trimmed } : t));

        if (user) {
            await supabase.from("todos").update({ text: trimmed }).eq("id", id);
        }
    }

    return (
        <div id="todopage">
            <h1 className="todoTitle">to-do list</h1>
            <div id="todolist">
                {tasks.map(task => (
                    <ToDoItem 
                        key={task.id} 
                        task={task} 
                        deleteTask={deleteTask} 
                        toggleCompleted={toggleCompleted} 
                        editTask={editTask}
                    />
                ))}
                <div id="addtask">
                    <input id="tasktext" type="text" placeholder="have a good day!" value={text} onChange={e => setText(e.target.value)} />
                    <button onClick={() => addTask(text)} id="addbutton">add task</button>
                </div>
            </div>
        </div>
    );
}