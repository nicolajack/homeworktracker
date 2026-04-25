export const THEME_STORAGE_KEY = "homework-theme-palette";

export const THEME_PALETTES = [
    {
        id: "twilight",
        name: "Twilight",
        accent: "#4b335e",
        accentSoft: "#f3ecf8",
        accentStrong: "#5a4070",
        accentText: "#4b335e",
        bgFrom: "#ebd6ff",
        bgTo: "#cab0e8",
    },
    {
        id: "ocean",
        name: "Ocean",
        accent: "#1b4f72",
        accentSoft: "#e3f2fd",
        accentStrong: "#133957",
        accentText: "#10314a",
        bgFrom: "#cfe9ff",
        bgTo: "#9ad0ff",
    },
    {
        id: "sunset",
        name: "Sunset",
        // warmer + less muddy reds; keeps contrast for text/buttons
        accent: "#B23A48",        // raspberry
        accentSoft: "#FFF1E6",    // peach cream
        accentStrong: "#7A1E2D",  // deep berry
        accentText: "#5E1723",
        bgFrom: "#FFE2D1",       // soft apricot
        bgTo: "#F9A8D4",         // rosy pink
    },
    {
        id: "forest",
        name: "Forest",
        // greener + cleaner teals; avoids the "mint" look
        accent: "#1F5E4B",        // deep eucalyptus
        accentSoft: "#E9FBF4",    // light mist
        accentStrong: "#164236",  // dark pine
        accentText: "#0F2F27",
        bgFrom: "#DFF7EC",       // pale green
        bgTo: "#A7E3C8",         // fresh jade
    },
    {
        id: "mountains",
        name: "Mountains",
        // rocky grays + snowy peaks + forest greens
        accent: "#5A4A42",        // rocky brown
        accentSoft: "#F0F4F8",    // snowy white
        accentStrong: "#3D2F28",  // dark stone
        accentText: "#2C2420",    // charcoal
        bgFrom: "#D4D0CC",        // stone gray
        bgTo: "#A8C5A0",          // forest green
    },
    {
        id: "Rocky",
        name: "Rocky",
        accent: "#726D6A",        // rocky gray
        accentSoft: "#EBE3DF",    // soft stone
        accentStrong: "#4A4644",  // dark stone
        accentText: "#2F2E2D",    // charcoal
        bgFrom: "#F8ECE6",        // light stone
        bgTo: "#D5C4BD",          // deep stone
    }
];

export function findPaletteById(id) {
    return THEME_PALETTES.find((p) => p.id === id) || null;
}

export function applyPaletteVars(palette) {
    if (typeof window === "undefined" || !palette) return;
    const root = document.documentElement;
    root.style.setProperty("--accent", palette.accent);
    root.style.setProperty("--accent-soft", palette.accentSoft);
    root.style.setProperty("--accent-strong", palette.accentStrong);
    root.style.setProperty("--accent-text", palette.accentText);
    root.style.setProperty("--bg-gradient-from", palette.bgFrom);
    root.style.setProperty("--bg-gradient-to", palette.bgTo);
}
