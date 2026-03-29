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
        accent: "#c44536",
        accentSoft: "#ffe8dc",
        accentStrong: "#922f24",
        accentText: "#70241b",
        bgFrom: "#ffe4c4",
        bgTo: "#ffb3a7",
    },
    {
        id: "forest",
        name: "Forest",
        accent: "#22543d",
        accentSoft: "#e6fffa",
        accentStrong: "#1a3b2c",
        accentText: "#163329",
        bgFrom: "#c6f6d5",
        bgTo: "#9ae6b4",
    },
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
