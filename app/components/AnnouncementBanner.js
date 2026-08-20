"use client";

import { useState, useEffect } from "react";

export default function AnnouncementBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only show if the user hasn't closed it previously
        const isDismissed = localStorage.getItem("sb_announcement_dismissed");
        if (!isDismissed) {
            setIsVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem("sb_announcement_dismissed", "true");
    };

    if (!isVisible) return null;

    const bannerText = (
        <span>
            <strong>New Update:</strong> An account is now required to access Study Buddy! For issues or feature requests, email me directly at{" "}
            <a href="mailto:studybuddyvercel@gmail.com">studybuddyvercel@gmail.com</a>
        </span>
    );

    return (
        <div className="announcementBanner">
            <div className="marqueeContainer">
                <div className="marqueeTrack">
                    {/* Duplicated text creates a seamless infinite scroll loop */}
                    {bannerText}
                    {bannerText}
                    {bannerText}
                </div>
            </div>
            <button
                type="button"
                className="bannerCloseBtn"
                onClick={handleDismiss}
                aria-label="Close notification"
            >
                ✕
            </button>
        </div>
    );
}