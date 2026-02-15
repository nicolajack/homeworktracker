import React from "react";

export default function Popup({showPopUp, closePopUp, children}){
    if (!showPopUp){
        return null
    }
    return (
        <div className="popup">
            <button onClick={closePopUp}>x</button>
        </div>
    )
}