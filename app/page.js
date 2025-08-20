"use client";
import styles from "./page.module.css";
import { useAssignments } from "./context/AssignmentsContext";
import { useEffect, useState } from "react";

export default function Home() {
  const { assignments } = useAssignments();
  const incompleteAssignments = assignments.filter(a => a.progress < 100).length;
  const [taylorLyric, setTaylorLyric] = useState("Gray November, I've been down since July, Motion capture, Put me in a bad light");

  function fetchTaylorLyric() {
    fetch("https://taylorswiftapi.onrender.com/get")
      .then(response => response.json())
      .then(data => {
        console.log("API Response:", data); // Debug log
        if (data && data.quote) {
          setTaylorLyric(data.quote);
        } else if (data && data.lyric) {
          setTaylorLyric(data.lyric);
        } else if (data && data.text) {
          setTaylorLyric(data.text);
        } else if (typeof data === 'string') {
          setTaylorLyric(data);
        } else {
          setTaylorLyric("No lyric found in response");
        }
      })
      .catch(error => {
        console.error("Error fetching Taylor Swift lyric:", error);
        setTaylorLyric("Error fetching lyric");
      });
  }

  return (
    <div className="homePage">
      <h1 className="welcome">welcome, bella</h1>
      <h2>you have {incompleteAssignments} assignments to complete</h2>
      <h2 id="lyric">{taylorLyric}</h2>
      <button onClick={fetchTaylorLyric}>new lyric</button>
    </div>
  );
}
