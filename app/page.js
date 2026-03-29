"use client";
import { useAssignments } from "./context/AssignmentsContext";
import { useEffect, useState } from "react";
import Link from "next/link";

function getWeekBounds() {
  const now = new Date();
  const day = now.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(now.getDate() + diffToMon);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}

function formatDueDate(dateStr) {
  const date = new Date(dateStr + "T00:00:00");
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  if (date.toDateString() === now.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
  if (diffDays >= 0 && diffDays < 7) return dayNames[date.getDay()];

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Home() {
  const { assignments } = useAssignments();
  const [name, setName] = useState("you");

  useEffect(() => {
    const saved = localStorage.getItem("homework-name");
    if (saved) setName(saved);
  }, []);

  const { monday, sunday } = getWeekBounds();

  const thisWeekAssignments = assignments.filter(
    (a) => !a.archived && a.dueDate && new Date(a.dueDate + "T00:00:00") >= monday && new Date(a.dueDate + "T00:00:00") <= sunday
  );

  const dueThisWeek = thisWeekAssignments.filter((a) => a.progress < 100).length;

  const completedThisWeek = thisWeekAssignments.filter((a) => a.progress === 100).length;
  const progressPercent =
    thisWeekAssignments.length > 0
      ? Math.round((completedThisWeek / thisWeekAssignments.length) * 100)
      : null;

  const upcoming = assignments
    .filter((a) => !a.archived && a.progress < 100 && a.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  const staggerDelay = (i) => ({ animationDelay: `${0.1 + i * 0.05}s` });

  return (
    <div className="homePage">
      <h1 className="welcome">hello, {name}!</h1>
      <p className="homeSubtitle">
        {dueThisWeek > 0 ? (
          <>you have <span>{dueThisWeek} assignment{dueThisWeek !== 1 ? "s" : ""}</span> due this week</>
        ) : (
          "you're all caught up this week!"
        )}
      </p>

      <div className="bentoGrid">
        {/* Upcoming Assignments */}
        <div className="bentoCard bentoCardWide" style={staggerDelay(0)}>
          <div className="bentoLabelRow">
            <span className="bentoLabel" style={{ marginBottom: 0 }}>Upcoming Assignments</span>
            <Link href="/assignments">View all →</Link>
          </div>
          {upcoming.length > 0 ? (
            <div className="upcomingList">
              {upcoming.map((a) => (
                <div key={a.id} className="upcomingItem">
                  <div
                    className="upcomingItemStrip"
                    style={{ backgroundColor: a.color || "#f77968" }}
                  />
                  <div className="upcomingItemTitle">{a.title}</div>
                  <div className="upcomingItemDate">{formatDueDate(a.dueDate)}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="emptyState">No upcoming assignments</p>
          )}
        </div>

        {/* Progress */}
        <div className="bentoCard progressCard" style={staggerDelay(1)}>
          <div className="progressLabel">Progress</div>
          <div className="progressNumber">
            {progressPercent !== null ? `${progressPercent}%` : "—"}
          </div>
          <div className="progressLabel">this week</div>
        </div>

        {/* Quick Access Tools */}
        <Link href="/pomodoro" className="bentoCard toolCard" style={staggerDelay(2)}>
          <div className="toolIcon">⏱</div>
          <div className="toolLabel">Pomodoro</div>
        </Link>

        <Link href="/calendar" className="bentoCard toolCard" style={staggerDelay(3)}>
          <div className="toolIcon">📅</div>
          <div className="toolLabel">Calendar</div>
        </Link>

        <Link href="/todo" className="bentoCard toolCard" style={staggerDelay(4)}>
          <div className="toolIcon">✓</div>
          <div className="toolLabel">To-Do</div>
        </Link>
      </div>
    </div>
  );
}
