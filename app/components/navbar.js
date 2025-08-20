import Link from 'next/link';

export default function Navbar() {
    return (
        <nav>
        <div id="title">
            study buddy
        </div>
        <div>
            <Link
            href="/"
            
            >
            home
            </Link>
            <Link
            href="/assignments"
            
            >
            assignments
            </Link>
            <Link
            href="/todo"
            
            >
            to-do
            </Link>
            <Link
            href="/settings"
            
            >
            settings
            </Link>
        </div>
        </nav>
    );
    }