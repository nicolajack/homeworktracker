"use client";
import { useAssignments } from "./context/AssignmentsContext";
import { useEffect, useState } from "react";

export default function Home() {
  const { assignments } = useAssignments();
  const incompleteAssignments = assignments.filter(a => a.progress < 100).length;
  const [taylorLyric, setTaylorLyric] = useState("in the cracks of light, i dreamed of you");
  const [showPopUp, setShowPopUp] = useState(false);

  // load persisted user name from localStorage
  const [name, setName] = useState("you");
  useEffect(() => {
    const saved = localStorage.getItem("homework-name");
    if (saved) setName(saved);
  }, []);

  function fetchTaylorLyric() {
    fetch("https://taylorswiftapi.onrender.com/get")
      .then(response => response.json())
      .then(data => {
        console.log("API Response:", data);
        setTaylorLyric((data.quote || data.lyric || data.text || data).toLowerCase());
      })
      .catch(error => {
        console.error("Error fetching Taylor Swift lyric:", error);
        setTaylorLyric("Error fetching lyric");
      });
  }

  return (
    <div className="homePage">
      <h1 className="welcome">hello, {name}!</h1>
      <h2>you have {incompleteAssignments} assignments to complete</h2>
      <h2 id="lyric">{taylorLyric}</h2>
      <button onClick={fetchTaylorLyric} id="addbutton">new lyric</button>
    </div>
  );
}
