"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAssignments } from "../../context/AssignmentsContext";
import ColorPicker from "../../components/ColorPicker";

export default function AssignmentDetail() {
    const params = useParams();
    const router = useRouter();
    const { assignments, updateAssignment, deleteAssignment } = useAssignments();
    
    const assignmentId = parseInt(params.id);
    const assignment = assignments.find(a => a.id === assignmentId);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: "",
        dueDate: "",
        subject: "",
        description: "",
        priority: "medium",
        status: "not-started",
        color: "#f77968"
    });

    useEffect(() => {
        if (assignment) {
            setEditData({
                title: assignment.title || "",
                dueDate: assignment.dueDate || "",
                subject: assignment.subject || "",
                description: assignment.description || "",
                priority: assignment.priority || "medium",
                status: assignment.status || "not-started",
                color: assignment.color || "#f77968"
            });
        }
    }, [assignment]);

    if (!assignment) {
        return (
            <div style={{ padding: "2rem", textAlign: "center" }}>
                <h1>assignment not found</h1>
                <button 
                    onClick={() => router.push("/assignments")}
                    style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    back to Assignments
                </button>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleColorChange = (color) => {
        setEditData(prev => ({ ...prev, color }));
    };

    const formatDueDate = (dateString) => {
        if (!dateString) return "no due date";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        return `${month} ${day}`;
    };

    const handleSave = () => {
        updateAssignment(assignmentId, editData);
        setIsEditing(false);
    };

    const handleProgressChange = (e) => {
        const newProgress = parseInt(e.target.value);
        
        if (newProgress === 100) {
            setTimeout(() => {
                deleteAssignment(assignmentId);
                router.push("/assignments");
            }, 500);
        }
        
        updateAssignment(assignmentId, { progress: newProgress });
    };

    const handleDelete = () => {
        if (confirm("are you sure you want to delete this assignment?")) {
            deleteAssignment(assignmentId);
            router.push("/assignments");
        }
    };

    const priorityColors = {
        low: "#28a745",
        medium: "#ffc107",
        high: "#dc3545"
    };

    const statusOptions = [
        { value: "not-started", label: "not started" },
        { value: "in-progress", label: "in progress" },
        { value: "completed", label: "completed" },
        { value: "overdue", label: "overdue" }
    ];

    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

    return (
        <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <button 
                    onClick={() => router.push("/assignments")}
                    style={{
                        backgroundColor: "#4b335e",
                        color: "white",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    ← back
                </button>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        style={{
                            backgroundColor: isEditing ? "#8e639a" : "#4b335e",
                            color: "white",
                            border: "none",
                            padding: "0.5rem 1rem",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        {isEditing ? "cancel" : "edit"}
                    </button>
                    <button
                        onClick={handleDelete}
                        style={{
                            backgroundColor: "#ffb6c1",
                            color: "white",
                            border: "none",
                            padding: "0.5rem 1rem",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        delete
                    </button>
                </div>
            </div>

            <div style={{
                backgroundColor: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "2rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
                {isEditing ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>title</label>
                            <input
                                type="text"
                                name="title"
                                value={editData.title}
                                onChange={handleInputChange}
                                style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                            />
                        </div>
                        
                        <div style={{ display: "flex", gap: "1rem" }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>due date</label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={editData.dueDate}
                                    onChange={handleInputChange}
                                    style={{ 
                                        width: "100%",
                                        padding: "0.5rem", 
                                        borderRadius: "4px", 
                                        border: "1px solid #ccc",
                                        backgroundColor: "white"
                                    }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={editData.subject}
                                    onChange={handleInputChange}
                                    style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                                />
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "1rem" }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>priority</label>
                                <select
                                    name="priority"
                                    value={editData.priority}
                                    onChange={handleInputChange}
                                    style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                                >
                                    <option value="low">low</option>
                                    <option value="medium">medium</option>
                                    <option value="high">high</option>
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>status</label>
                                <select
                                    name="status"
                                    value={editData.status}
                                    onChange={handleInputChange}
                                    style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                                >
                                    {statusOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <ColorPicker
                                currentColor={editData.color}
                                onColorChange={handleColorChange}
                                label="assignment color:"
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>description</label>
                            <textarea
                                name="description"
                                value={editData.description}
                                onChange={handleInputChange}
                                rows={5}
                                style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", resize: "vertical" }}
                                placeholder="add notes, requirements, or additional details about this assignment..."
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            style={{
                                backgroundColor: "#8e639a",
                                color: "white",
                                border: "none",
                                padding: "0.75rem 1.5rem",
                                borderRadius: "4px",
                                cursor: "pointer",
                                alignSelf: "flex-start"
                            }}
                        >
                            save changes
                        </button>
                    </div>
                ) : (
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <div style={{
                                    width: "24px",
                                    height: "24px",
                                    backgroundColor: assignment.color || "#4b335e",
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                    flexShrink: 0
                                }}></div>
                                <h1 style={{ margin: 0, color: "#333" }}>{assignment.title}</h1>
                            </div>
                            <span style={{
                                backgroundColor: priorityColors[assignment.priority || "medium"],
                                color: "white",
                                padding: "0.25rem 0.75rem",
                                borderRadius: "12px",
                                fontSize: "0.8rem",
                                fontWeight: "bold",
                                textTransform: "uppercase"
                            }}>
                                {assignment.priority || "medium"} priority
                            </span>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                            <div>
                                <strong>due date:</strong> {formatDueDate(assignment.dueDate)}
                            </div>
                            <div>
                                <strong>subject:</strong> {assignment.subject}
                            </div>
                            <div>
                                <strong>status:</strong> {statusOptions.find(s => s.value === (assignment.status || "not-started"))?.label || "not started"}
                            </div>
                            <div>
                                <strong>progress:</strong> {assignment.progress || 0}%
                            </div>
                        </div>

                        {assignment.description && (
                            <div style={{ marginBottom: "1.5rem" }}>
                                <strong>description:</strong>
                                <p style={{ marginTop: "0.5rem", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "4px", lineHeight: "1.5" }}>
                                    {assignment.description}
                                </p>
                            </div>
                        )}

                        <div>
                            <strong>progress:</strong>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "0.5rem" }}>
                                <span>{assignment.progress || 0}%</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={assignment.progress || 0}
                                    onChange={handleProgressChange}
                                    style={{
                                        flex: 1,
                                        height: "8px",
                                        borderRadius: "4px",
                                        background: `linear-gradient(to right, #007bff 0%, #007bff ${assignment.progress || 0}%, #e0e0e0 ${assignment.progress || 0}%, #e0e0e0 100%)`,
                                        outline: "none",
                                        cursor: "pointer"
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
