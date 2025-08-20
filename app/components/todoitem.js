import React from 'react';

export default function ToDoItem({ task, deleteTask, toggleCompleted }){
    function handleChange(){
        toggleCompleted(task.id);
    }
    return (
        <div id="todoitem">
            <input type="checkbox" checked={task.completed} onChange={handleChange} />
            <p>{task.text}</p>
            <button onClick={() => deleteTask(task.id)}>x</button>
        </div>
    );
}