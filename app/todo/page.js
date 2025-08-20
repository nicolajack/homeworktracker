"use client";
import React, { useState, useEffect } from 'react';
import ToDoItem from '../components/todoitem';

export default function ToDo() {
    const [tasks, setTasks] = useState([]);
    const [text, setText] = useState("");

    // Load tasks from localStorage on component mount
    useEffect(() => {
        const savedTasks = localStorage.getItem("todo-tasks");
        if (savedTasks) {
            try {
                setTasks(JSON.parse(savedTasks));
            } catch (error) {
                console.error("Error loading tasks:", error);
                // If there's an error, set default tasks
                setTasks([
                    { id: 1, text: "i love you", completed: false },
                    { id: 2, text: "smile", completed: false },
                ]);
            }
        } else {
            // Set default tasks if nothing in localStorage
            setTasks([
                { id: 1, text: "i love you", completed: false },
                { id: 2, text: "smile", completed: false },
            ]);
        }
    }, []);

    // Save tasks to localStorage whenever tasks change
    useEffect(() => {
        localStorage.setItem("todo-tasks", JSON.stringify(tasks));
    }, [tasks]);
    function addTask(text) {
        const newTask = {
            id: Date.now(),
            text,
            completed: false};
            setTasks([...tasks, newTask]);
            setText("");
    }
    function deleteTask(id) {
        setTasks(tasks.filter(task => task.id !== id));
    }
    function toggleCompleted(id) {
        setTasks(tasks.map(task => {
            if (task.id === id) {
                return {...task, completed: !task.completed };
            } else {
                return task;
            }
        }));
    }
    return (
        <div id="todopage">
            <h1 id="title">to-do list</h1>
            <div id="todolist">
                {tasks.map(task => (
                    <ToDoItem key={task.id} task={task} deleteTask={deleteTask} toggleCompleted={toggleCompleted} />
                ))}
                <div id="addtask">
                    <input id="tasktext" type="text" placeholder="buy nico a present" value={text} onChange={e => setText(e.target.value)} />
                    <button onClick={() => addTask(text)}>add task</button>
                </div>
            </div>

        </div>
    )
}