import Link from 'next/link';

export default function Navbar() {
    return (
        <nav>
        <div id="title">
            study buddy
        </div>
        <div>
            <Link id="link"
            href="/"
            
            >
            home
            </Link>
            <Link id="link"
            href="/assignments"
            
            >
            assignments
            </Link>
            <Link id="link"
            href="/todo"
            
            >
            to-do
            </Link>
            <Link id="link"
            href="/settings"
            
            >
            settings
            </Link>
        </div>
        </nav>
    );
    }