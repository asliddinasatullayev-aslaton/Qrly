# QRly — Precision QR Studio & Code Generator

<div align="center">
  <br />
  <strong>Next-Generation, 100% Scannable QR Studio with CTA Frame Badges, Logo Watermarking &amp; Local History.</strong>
  <br /><br />
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
  [![Design](https://img.shields.io/badge/Aesthetic-GPT%20Codex%20Dark%20Obsidian-6366F1.svg)](#design-philosophy)
  [![Scanability](https://img.shields.io/badge/Scanability-100%25%20Verified%20(Level%20H)-10B981.svg)](#features)
  [![Privacy](https://img.shields.io/badge/Privacy-Zero%20Tracking%20%7C%20No%20Auth-indigo.svg)](#privacy-first)
  [![Export](https://img.shields.io/badge/Export-PNG%20%7C%20SVG%20%7C%20Clipboard-purple.svg)](#features)
</div>

---

## 💡 Why QRly Was Built

Online QR generators are often cluttered with ad banners, forced subscription paywalls, confusing settings, or produce broken QR codes when logos obstruct data modules.

**QRly** delivers a sleek, high-precision developer studio experience:
- ⚡ **Instant Live Generation**: Debounced real-time generation as you type or paste links.
- 📱 **Guaranteed Scanability**: Industry-standard Reed-Solomon Error Correction Level H with protective circular shields for logo embeds.
- 🏷️ **Sticker & CTA Badges**: Print-ready frames with call-to-action banners (e.g. `SCAN ME`, `CONNECT WI-FI`, `VISIT SITE`).
- 🎨 **GPT Codex Aesthetic**: Deep obsidian backgrounds, mathematical matrix grids, frosted glass surfaces, and tactile ergonomics.
- 🛡️ **Zero Tracking & No Auth**: Pure client-side generation with local history stored safely in your browser.

---

## ✨ Core Features

### 1. 🏷️ Sticker & CTA Badge Frames *(New)*
- Adds a print-ready call-to-action banner right on the canvas.
- Customizable position (Bottom Banner or Top Header) and custom text (e.g. `SCAN ME`, `CONNECT WI-FI`, `VIEW MENU`).
- One-click export for table tents, stickers, flyers, and physical badges.

### 2. 🖼️ Protected Center Logo Watermarking *(New)*
- Upload custom PNG, SVG, or JPG icons.
- Built-in brand icons for GitHub, X/Twitter, Instagram, and Wi-Fi.
- Automatically applies a protective circular shield and Level H ECC to preserve 100% scanner tolerance.

### 3. 🔗 Smart Multi-Format Payloads
- **Website URLs** (with 1-click clipboard paste)
- **Wi-Fi Networks** (SSID, Password, WPA/WPA2/WPA3 encryption)
- **vCard Contacts** (Full Name, Phone, Email & Website)
- **Plain Text & Notes**

### 4. 🎨 Precision Palettes & Color Customizer
- Foreground and background color pickers with live hex readouts.
- Curated quick presets: *Obsidian Mono, Electric Indigo, Emerald Mint, Crimson Red, Midnight Gold*.

### 5. 🚀 1-Click Export Suite
- **Download PNG (HD)**: High-resolution raster image.
- **Download Vector SVG**: Scalable vector format for Illustrator, Figma, or print billboards.
- **Copy Image to Clipboard**: Direct binary copy to OS clipboard to paste in Figma, Photoshop, Slack, or Notion.

### 6. 💾 Local-First History (No Auth / No Sign-Up)
- Automatically saves your recent QR codes locally in `localStorage`.
- 1-click restore to reload any previous QR code into the editor.

---

## 🛠️ Architecture & Tech Stack

- **HTML5 & Modern CSS3**: Codex grid pattern, frosted glassmorphism (`backdrop-filter`), CSS variables, and spring micro-interactions.
- **Canvas 2D API**: High-resolution image, shield, and CTA banner compositing.
- **Reliable Engine**: High-performance `qrserver` API pipeline.
- **Zero Build Tools**: Works directly in any browser out-of-the-box.

---

## 🚀 Quick Start

1. Clone or download this project:
   ```bash
   git clone https://github.com/muslimbek/qrly.git
   ```
2. Double-click `index.html` to open it in your browser.

---

## 📄 License

MIT License — free for personal and commercial use.
