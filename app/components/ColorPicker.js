"use client";

export default function ColorPicker({ currentColor = "#4b335e", onColorChange, label = "Color:" }) {
    // will update colros to be cuter later
    const colorOptions = [
        { value: "#f77968", name: "red" },
        { value: "#f59753", name: "orange" },
        { value: "#f5d56e", name: "yellow" },
        { value: "#a6f56e", name: "light green" },
        { value: "#53ad58", name: "green"},
        { value: "#2c593a", name: "forest green"},
        { value: "#63dbcd", name: "teal"},
        { value: "#63c5db", name: "light blue" },
        { value: "#5186c2", name: "blue" },
        { value: "#b481d4", name: "light purple" },
        { value: "#7448a3", name: "purple" },
        { value: "#f56ef5", name: "pink" },
    ];

    const handleColorChange = (e) => {
        const selectedColor = e.target.value;
        onColorChange(selectedColor);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ 
                fontWeight: "bold", 
                color: "#333",
                fontSize: "0.9rem"
            }}>
                {label}
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {/* Color preview circle */}
                <div style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: currentColor,
                    borderRadius: "50%",
                    border: "2px solid #ccc",
                    flexShrink: 0
                }} />
                
                {/* Dropdown */}
                <select
                    value={currentColor}
                    onChange={handleColorChange}
                    style={{
                        padding: "0.5rem",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        backgroundColor: "white",
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        minWidth: "120px"
                    }}
                >
                    {colorOptions.map((color) => (
                        <option key={color.value} value={color.value}>
                            {color.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
