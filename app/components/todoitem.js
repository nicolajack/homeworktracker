import React, { useState, useEffect } from 'react';

export default function ToDoItem({ task, deleteTask, toggleCompleted, editTask }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);

    useEffect(() => {
        setEditText(task.text);
    }, [task.text]);

    function handleChange() {
        toggleCompleted(task.id);
    }

    function handleSave() {
        if (editText.trim() === '') return;
        editTask(task.id, editText.trim());
        setIsEditing(false);
    }

    function handleCancel() {
        setEditText(task.text);
        setIsEditing(false);
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    }

    return (
        <div id="todoitem" style={styles.todoItem}>
            {isEditing ? (
                <>
                    <div style={styles.leftContent}>
                        <input 
                            type="text" 
                            value={editText} 
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            style={styles.editInput}
                            autoFocus
                        />
                    </div>
                    
                    <div style={styles.buttonGroup}>
                        {/* Save Button (Checkmark) */}
                        <button onClick={handleSave} style={styles.iconButton} title="Save Changes">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38a169" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </button>

                        {/* Cancel Button (X) */}
                        <button onClick={handleCancel} style={styles.iconButton} title="Cancel">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#718096" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div style={styles.leftContent}>
                        <input 
                            type="checkbox" 
                            checked={task.completed} 
                            onChange={handleChange} 
                        />
                        <p style={{ 
                            ...styles.text, 
                            textDecoration: task.completed ? 'line-through' : 'none',
                            color: task.completed ? '#888' : '#333'
                        }}>
                            {task.text}
                        </p>
                    </div>
                    
                    <div style={styles.buttonGroup}>
                        {/* Edit Icon Button */}
                        <button onClick={() => setIsEditing(true)} style={styles.iconButton} title="Edit Task">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>

                        {/* Delete Icon Button */}
                        <button onClick={() => deleteTask(task.id)} style={styles.iconButton} title="Delete Task">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

const styles = {
    todoItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px',
        borderBottom: '1px solid #eee',
        backgroundColor: '#fff',
        minHeight: '45px',
    },
    leftContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flex: 1,
    },
    text: {
        margin: 0,
        fontFamily: 'sans-serif',
    },
    editInput: {
        width: '100%',
        padding: '6px 8px',
        fontSize: '16px',
        fontFamily: 'sans-serif',
        border: '1px solid #cbd5e0',
        borderRadius: '4px',
        outline: 'none',
        color: '#333',
    },
    buttonGroup: {
        display: 'flex',
        gap: '8px',
    },
    iconButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
        color: '#4a5568',
    }
};