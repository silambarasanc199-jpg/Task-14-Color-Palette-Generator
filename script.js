/* =========================================
   CHROMATIC — COLOR PALETTE GENERATOR
   Task 14
   ========================================= */

"use strict";

/* ---------- Configuration ---------- */

const COLOR_COUNT = 5;
const STORAGE_KEY = "chromaticSavedPalettes";
const THEME_KEY = "chromaticTheme";


/* ---------- State ---------- */

let colors = [];
let lockedColors = new Array(COLOR_COUNT).fill(false);


/* ---------- DOM Elements ---------- */

const paletteGrid = document.getElementById("paletteGrid");

const generateButton =
    document.getElementById("generateButton");

const copyAllButton =
    document.getElementById("copyAllButton");

const themeButton =
    document.getElementById("themeButton");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

const savedPalettes =
    document.getElementById("savedPalettes");

const clearSavedButton =
    document.getElementById("clearSavedButton");


/* =========================================
   RANDOM HEX COLOR
   Uses Math.random()
   ========================================= */

function generateRandomHex() {

    const randomNumber =
        Math.floor(Math.random() * 16777216);

    const hex =
        randomNumber
            .toString(16)
            .padStart(6, "0");

    return `#${hex}`.toUpperCase();
}


/* =========================================
   HEX → RGB
   ========================================= */

function hexToRgb(hex) {

    const cleanHex =
        hex.replace("#", "");

    const red =
        parseInt(cleanHex.substring(0, 2), 16);

    const green =
        parseInt(cleanHex.substring(2, 4), 16);

    const blue =
        parseInt(cleanHex.substring(4, 6), 16);

    return {
        red,
        green,
        blue
    };
}


/* =========================================
   RGB TEXT
   ========================================= */

function getRgbText(hex) {

    const {
        red,
        green,
        blue
    } = hexToRgb(hex);

    return `rgb(${red}, ${green}, ${blue})`;
}


/* =========================================
   COLOR CONTRAST
   ========================================= */

function getContrastColor(hex) {

    const {
        red,
        green,
        blue
    } = hexToRgb(hex);

    const brightness =
        (red * 299 +
            green * 587 +
            blue * 114) / 1000;

    return brightness > 150
        ? "#111827"
        : "#FFFFFF";
}


/* =========================================
   GENERATE PALETTE
   ========================================= */

function generatePalette() {

    colors = colors.map((color, index) => {

        if (lockedColors[index]) {
            return color;
        }

        return generateRandomHex();
    });

    renderPalette();
}


/* =========================================
   INITIAL PALETTE
   ========================================= */

function initializePalette() {

    colors = Array.from(
        { length: COLOR_COUNT },
        () => generateRandomHex()
    );

    renderPalette();
}


/* =========================================
   RENDER PALETTE
   ========================================= */

function renderPalette() {

    paletteGrid.innerHTML = "";

    colors.forEach((color, index) => {

        const card =
            document.createElement("article");

        card.className = "color-card";

        card.style.backgroundColor = color;

        const textColor =
            getContrastColor(color);

        card.innerHTML = `
            <span
                class="color-number"
                style="color: ${textColor};"
            >
                COLOR ${String(index + 1).padStart(2, "0")}
            </span>

            <button
                class="lock-button"
                type="button"
                data-index="${index}"
                aria-label="${lockedColors[index]
                    ? "Unlock color"
                    : "Lock color"}"
                title="${lockedColors[index]
                    ? "Unlock color"
                    : "Lock color"}"
            >
                ${lockedColors[index] ? "🔒" : "🔓"}
            </button>

            <div class="color-content">

                <button
                    class="hex-button"
                    type="button"
                    data-color="${color}"
                    aria-label="Copy ${color}"
                    title="Click to copy"
                    style="color: ${textColor};"
                >
                    ${color}
                </button>

                <p
                    class="rgb-value"
                    style="color: ${textColor};"
                >
                    ${getRgbText(color)}
                </p>

            </div>
        `;

        paletteGrid.appendChild(card);
    });
}


/* =========================================
   LOCK / UNLOCK COLOR
   ========================================= */

function toggleLock(index) {

    lockedColors[index] =
        !lockedColors[index];

    renderPalette();

    showToast(
        lockedColors[index]
            ? "Color locked!"
            : "Color unlocked!"
    );
}


/* =========================================
   CLIPBOARD API
   ========================================= */

async function copyToClipboard(text) {

    try {

        await navigator.clipboard.writeText(text);

        showToast(`${text} copied!`);

    } catch (error) {

        /*
         Fallback for browsers where
         Clipboard API is unavailable.
        */

        const textarea =
            document.createElement("textarea");

        textarea.value = text;

        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);

        textarea.select();

        try {
            document.execCommand("copy");

            showToast(`${text} copied!`);

        } catch (fallbackError) {

            showToast(
                "Unable to copy. Please try again."
            );
        }

        textarea.remove();
    }
}


/* =========================================
   COPY ALL COLORS
   ========================================= */

async function copyAllColors() {

    const paletteText =
        colors.join(" • ");

    await copyToClipboard(paletteText);
}


/* =========================================
   TOAST
   ========================================= */

let toastTimer;

function showToast(message) {

    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 2200);
}


/* =========================================
   SAVE PALETTE
   ========================================= */

function savePalette() {

    const saved =
        getSavedPalettes();

    const newPalette = {
        id: Date.now(),
        colors: [...colors],
        date: new Date().toLocaleDateString()
    };

    saved.unshift(newPalette);

    const limitedSaved =
        saved.slice(0, 12);

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(limitedSaved)
    );

    renderSavedPalettes();

    showToast("Palette saved!");
}


/* =========================================
   GET SAVED PALETTES
   ========================================= */

function getSavedPalettes() {

    try {

        return JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        ) || [];

    } catch (error) {

        return [];
    }
}


/* =========================================
   RENDER SAVED PALETTES
   ========================================= */

function renderSavedPalettes() {

    const saved =
        getSavedPalettes();

    savedPalettes.innerHTML = "";

    if (saved.length === 0) {

        savedPalettes.innerHTML = `
            <div class="empty-state">
                <span>◇</span>
                <p>No saved palettes yet.</p>
            </div>
        `;

        return;
    }

    saved.forEach((palette) => {

        const paletteElement =
            document.createElement("article");

        paletteElement.className =
            "saved-palette";

        paletteElement.innerHTML = `

            <div class="saved-colors">

                ${palette.colors.map(
                    color => `
                        <div
                            class="saved-color"
                            style="background-color: ${color};"
                            title="${color}"
                        ></div>
                    `
                ).join("")}

            </div>

            <div class="saved-actions">

                <span class="saved-date">
                    ${palette.date}
                </span>

                <button
                    class="saved-copy"
                    type="button"
                    data-palette-id="${palette.id}"
                >
                    Copy
                </button>

            </div>
        `;

        savedPalettes.appendChild(
            paletteElement
        );
    });
}


/* =========================================
   COPY SAVED PALETTE
   ========================================= */

async function copySavedPalette(id) {

    const saved =
        getSavedPalettes();

    const palette =
        saved.find(item => item.id === id);

    if (!palette) {
        return;
    }

    await copyToClipboard(
        palette.colors.join(" • ")
    );
}


/* =========================================
   CLEAR SAVED PALETTES
   ========================================= */

function clearSavedPalettes() {

    const saved =
        getSavedPalettes();

    if (saved.length === 0) {

        showToast("Nothing to clear.");

        return;
    }

    const confirmed =
        window.confirm(
            "Clear all saved palettes?"
        );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem(
        STORAGE_KEY
    );

    renderSavedPalettes();

    showToast("Saved palettes cleared.");
}


/* =========================================
   THEME
   ========================================= */

function applyTheme(theme) {

    const isDark =
        theme === "dark";

    document.body.classList.toggle(
        "dark-theme",
        isDark
    );

    themeButton.textContent =
        isDark ? "☀" : "◐";

    themeButton.setAttribute(
        "aria-label",
        isDark
            ? "Switch to light theme"
            : "Switch to dark theme"
    );
}


/* =========================================
   LOAD THEME
   ========================================= */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(THEME_KEY);

    if (savedTheme) {

        applyTheme(savedTheme);

        return;
    }

    const prefersDark =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

    applyTheme(
        prefersDark ? "dark" : "light"
    );
}


/* =========================================
   TOGGLE THEME
   ========================================= */

function toggleTheme() {

    const isDark =
        document.body.classList.contains(
            "dark-theme"
        );

    const newTheme =
        isDark ? "light" : "dark";

    applyTheme(newTheme);

    localStorage.setItem(
        THEME_KEY,
        newTheme
    );
}


/* =========================================
   KEYBOARD SHORTCUT
   SPACE → GENERATE
   ========================================= */

document.addEventListener(
    "keydown",
    (event) => {

        const activeElement =
            document.activeElement;

        const isTyping =
            activeElement &&
            (
                activeElement.tagName === "INPUT" ||
                activeElement.tagName === "TEXTAREA" ||
                activeElement.isContentEditable
            );

        if (
            event.code === "Space" &&
            !isTyping
        ) {

            event.preventDefault();

            generatePalette();

            showToast(
                "New palette generated!"
            );
        }
    }
);


/* =========================================
   EVENT LISTENERS
   ========================================= */

generateButton.addEventListener(
    "click",
    () => {

        generatePalette();

        showToast(
            "New palette generated!"
        );
    }
);


copyAllButton.addEventListener(
    "click",
    copyAllColors
);


themeButton.addEventListener(
    "click",
    toggleTheme
);


clearSavedButton.addEventListener(
    "click",
    clearSavedPalettes
);


/* ---------- Palette Click Handling ---------- */

paletteGrid.addEventListener(
    "click",
    (event) => {

        const hexButton =
            event.target.closest(
                ".hex-button"
            );

        if (hexButton) {

            const color =
                hexButton.dataset.color;

            copyToClipboard(color);

            return;
        }

        const lockButton =
            event.target.closest(
                ".lock-button"
            );

        if (lockButton) {

            const index =
                Number(lockButton.dataset.index);

            toggleLock(index);
        }
    }
);


/* ---------- Saved Palette Click Handling ---------- */

savedPalettes.addEventListener(
    "click",
    (event) => {

        const copyButton =
            event.target.closest(
                ".saved-copy"
            );

        if (!copyButton) {
            return;
        }

        const id =
            Number(
                copyButton.dataset.paletteId
            );

        copySavedPalette(id);
    }
);


/* =========================================
   DOUBLE CLICK PALETTE → SAVE
   ========================================= */

paletteGrid.addEventListener(
    "dblclick",
    () => {

        savePalette();
    }
);


/* =========================================
   START APPLICATION
   ========================================= */

loadTheme();

initializePalette();

renderSavedPalettes();
