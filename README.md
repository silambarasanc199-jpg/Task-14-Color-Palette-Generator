# 🎨 Chromatic — Color Palette Generator

A modern, responsive random color palette generator built with HTML5, CSS3, and JavaScript.

Generate beautiful color combinations, lock colors you like, copy HEX values instantly, and save your favorite palettes for later.

---

## ✨ Features

- 🎨 Generate 5 random HEX colors
- 🔀 Random color generation using `Math.random()`
- 📋 Click any HEX code to copy it
- ✅ Copy confirmation with toast notification
- 🔒 Lock individual colors
- 🔄 Generate new colors while keeping locked colors
- 📋 Copy the complete palette
- 💾 Save favorite palettes
- 🗂️ View saved palettes
- 🧹 Clear saved palettes
- 🌙 Light/Dark theme toggle
- ⌨️ Spacebar shortcut for generating palettes
- 📱 Fully responsive design
- ♿ Accessible buttons and keyboard-friendly interactions
- 💽 LocalStorage persistence

---

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Clipboard API
- LocalStorage API
- Math.random()

---

## 🎯 How It Works

### 1. Generate

JavaScript generates random RGB values and converts them into HEX color codes.

### 2. Explore

Each generated color is displayed as a large visual color card with its HEX and RGB values.

### 3. Lock

Lock any color you want to keep. When generating a new palette, locked colors remain unchanged.

### 4. Copy

Click a HEX value to copy it to your clipboard using the Clipboard API.

### 5. Save

Save your favorite palette using the Save Palette button or double-click the palette.

Saved palettes are stored locally using LocalStorage.

---

## 🎨 Example Palette

```text
#D7AD2A • #457591 • #DA12F9 • #B5347E • #2CA5ED
