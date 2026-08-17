"use client";

import Link from 'next/link';
import { useAssignments } from "@/app/context/AssignmentsContext";
import { supabase } from "@/app/lib/supabase";

export default function Navbar() {
    const { user } = useAssignments();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <nav>
            <div id="title">
                <Link href="/">
                    study buddy
                </Link>
            </div>
            <div>
                <Link id="link" href="/assignments">
                    assignments
                </Link>
                <Link id="link" href="/todo">
                    to-do
                </Link>
                <Link id="link" href="/calendar">
                    calendar
                </Link>
                {/* <Link id="link" href="/pomodoro">
                    pomodoro
                </Link> */}
                <Link id="link" href="/settings">
                    settings
                </Link>
                {user ? (
                    <button className="navAuthBtn" onClick={handleSignOut}>
                        sign out
                    </button>
                ) : (
                    <Link className="navAuthBtn" href="/login">
                        login
                    </Link>
                )}
            </div>
        </nav>
    );
}