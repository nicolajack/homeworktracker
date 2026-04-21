"use client";
import { useAssignments } from "./context/AssignmentsContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { THEME_PALETTES, THEME_STORAGE_KEY, findPaletteById, applyPaletteVars } from "./theme";
import { useForm } from '@formspree/react';


const ClockIcon = ({ color = 'var(--accent)', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M12 7v5l3 2" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const CalendarIcon = ({ color = 'var(--accent)', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="3" y="5" width="18" height="16" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M16 3v4M8 3v4" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 11h10M7 15h10" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TodoIcon = ({ color = 'var(--accent)', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="3.5" y="4" width="17" height="16" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
    <path d="M7 12l2.5 2.5L17 7" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// to display how many items are due this week
function getWeekBounds() {
  const today = new Date();
  // normalize to start of today
  today.setHours(0, 0, 0, 0);
  // getDay(): 0 = Sunday, 1 = Monday, ... 6 = Saturday
  const dayIndex = today.getDay();

  // start = most recent Sunday (or today if it's Sunday) at 00:00:00
  const start = new Date(today);
  start.setDate(today.getDate() - dayIndex);
  start.setHours(0, 0, 0, 0);

  // end = following Saturday at 23:59:59.999 (start + 6 days)
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
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
  const [taylorLyric, setTaylorLyric] = useState("in the cracks of light, i dreamed of you");
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [activePaletteId, setActivePaletteId] = useState(THEME_PALETTES[0]?.id || "twilight");

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

  // load name & saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("homework-name");
    if (saved) setName(saved);

    const savedThemeId = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedThemeId) {
      const palette = findPaletteById(savedThemeId);
      if (palette) {
        setActivePaletteId(savedThemeId);
        applyPaletteVars(palette);
      }
    } else if (THEME_PALETTES[0]) {
      applyPaletteVars(THEME_PALETTES[0]);
    }
  }, []);

  const { start, end } = getWeekBounds();

  const thisWeekAssignments = assignments.filter(
    (a) => !a.archived && a.dueDate && new Date(a.dueDate + "T00:00:00") >= start && new Date(a.dueDate + "T00:00:00") <= end
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

  const handlePaletteSelect = (id) => {
    const palette = findPaletteById(id);
    if (!palette) return;
    setActivePaletteId(id);
    applyPaletteVars(palette);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, id);
    } catch (e) {
      console.error("Failed to save theme", e);
    }
  };

  const [formState, handleFeedbackSubmit] = useForm("xaqlegoo");

  useEffect(() => {
    if (formState.succeeded) {
      const timer = setTimeout(() => setIsFeedbackModalOpen(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [formState.succeeded]);

  return (
    <div className="homePage">
      {/* floating feedback button */}
      <button
        type="button"
        className="feedbackButton"
        onClick={() => setIsFeedbackModalOpen(true)}
        aria-label="Send feedback"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </button>
      <button
        type="button"
        className="themeToggleButton"
        onClick={() => setIsThemeModalOpen(true)}
        aria-label="Change color theme"
      >
        🎨
      </button>

      {isFeedbackModalOpen && (
        <div className="themeModalOverlay feedbackOverlay" onClick={() => setIsFeedbackModalOpen(false)}>
          <div className="themeModal feedbackModal" onClick={(e) => e.stopPropagation()}>
            <div className="themeModalHeader">
              <h2>send feedback</h2>
              <button
                type="button"
                className="themeModalClose"
                onClick={() => setIsFeedbackModalOpen(false)}
                aria-label="Close feedback form"
              >
                ×
              </button>
            </div>
            {formState.succeeded ? (
              <p className="feedbackSuccess">thanks for ur feedback :3!</p>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="feedbackForm">
                <textarea
                  id="message"
                  name="message"
                  placeholder="what's on ur mind?"
                  rows={4}
                  required
                />
                <button type="submit" className="feedbackSubmitBtn" disabled={formState.submitting}>
                  {formState.submitting ? "sending..." : "send"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {isThemeModalOpen && (
        <div className="themeModalOverlay" onClick={() => setIsThemeModalOpen(false)}>
          <div className="themeModal" onClick={(e) => e.stopPropagation()}>
            <div className="themeModalHeader">
              <h2>choose ur vibe</h2>
              <button
                type="button"
                className="themeModalClose"
                onClick={() => setIsThemeModalOpen(false)}
                aria-label="Close theme picker"
              >
                ×
              </button>
            </div>
            <p className="themeModalSubtitle">pick a palette and watch the site transform</p>
            <div className="themePaletteGrid">
              {THEME_PALETTES.map((palette) => (
                <button
                  key={palette.id}
                  type="button"
                  className={`themePaletteTile${palette.id === activePaletteId ? " themePaletteTileActive" : ""}`}
                  onClick={() => handlePaletteSelect(palette.id)}
                >
                  <div className="themePaletteSwatches">
                    <span style={{ background: palette.bgFrom }} />
                    <span style={{ background: palette.bgTo }} />
                    <span style={{ background: palette.accentSoft }} />
                    <span style={{ background: palette.accent }} />
                  </div>
                  <span className="themePaletteName">{palette.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <h1 className="welcome">hello, {name}!</h1>
      <p className="homeSubtitle">
        {dueThisWeek > 0 ? (
          <>you have <span>{dueThisWeek} assignment{dueThisWeek !== 1 ? "s" : ""}</span> due this week</>
        ) : (
          "you're all caught up this week! study buddy helps you track assignments, plan your week, and stay focused."
        )}
      </p>

      <h2 className="sr-only">your homework dashboard</h2>
      <div className="bentoGrid">
        {/* Upcoming Assignments */}
        <section className="bentoCard bentoCardWide" aria-label="Upcoming assignments" style={staggerDelay(0)}>
          <div className="bentoLabelRow">
            <span className="bentoLabel" style={{ marginBottom: 0 }}>Upcoming Assignments</span>
            <Link href="/assignments">view all →</Link>
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
            <p className="emptyState">no upcoming assignments yet — add your first one to get started tracking homework and due dates</p>
          )}
        </section>

        {/* Progress */}
        <div className="bentoCard progressCard" style={staggerDelay(1)}>
          <div className="progressLabel">Progress</div>
          <div className="progressNumber">
            {progressPercent !== null ? `${progressPercent}%` : "—"}
          </div>
          <div className="progressLabel">this week</div>
        </div>

        {/* Quick Access Tools */}
        <Link href="/pomodoro" className="bentoCard toolCard" aria-label="Pomodoro study timer" style={staggerDelay(2)}>
          <div className="toolIcon">
            <ClockIcon />
          </div>
          <div className="toolLabel">pomodoro</div>
          <div className="toolDescriptor">stay focused with timed study sessions</div>
        </Link>

        <Link href="/calendar" className="bentoCard toolCard" aria-label="Assignment calendar" style={staggerDelay(3)}>
          <div className="toolIcon"><CalendarIcon /></div>
          <div className="toolLabel">calendar</div>
          <div className="toolDescriptor">view assignments by due date</div>
        </Link>

        <Link href="/todo" className="bentoCard toolCard" aria-label="To-do list" style={staggerDelay(4)}>
          <div className="toolIcon"><TodoIcon /></div>
          <div className="toolLabel">to-do</div>
          <div className="toolDescriptor">keep track of daily tasks</div>
        </Link>
        {/* bringing back ts lyric */}
        <div className="bentoCard" style={{ ...staggerDelay(5), gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', padding: '1rem 1.25rem' }}>
          <h2 id="lyric" style={{ margin: 0, textAlign: 'left', color: 'var(--accent-text)', flex: 1 }}>{taylorLyric}</h2>
          <button
            onClick={fetchTaylorLyric}
            aria-label="Refresh lyric"
            title="Refresh lyric"
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--accent-soft)',
              color: 'var(--accent-text)',
              cursor: 'pointer',
              fontSize: '1.5rem',
              transition: 'background 0.2s ease, transform 0.1s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            ⟳
          </button>
        </div>
      </div>
    </div>
  );
}
