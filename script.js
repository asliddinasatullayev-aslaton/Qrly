(function () {
    'use strict';

    const state = {
        type: 'url',
        payload: 'https://github.com/asliddin/qrly',
        fgColor: '090B0E',
        bgColor: 'FFFFFF',
        logoDataUrl: null,
        logoImage: null,
        frameEnabled: false,
        frameText: 'SCAN ME',
        framePosition: 'bottom' // 'bottom' | 'top'
    };

    const HISTORY_KEY = 'QRLY_CODEX_HISTORY_V1';
    let debounceTimer = null;

    // DOM Elements Cache
    const el = {
        // Inputs
        tabPills: document.querySelectorAll('.tab-pill'),
        paneViews: document.querySelectorAll('.pane-view'),
        urlInput: document.getElementById('url-input'),
        pasteBtn: document.getElementById('paste-btn'),
        wifiSsid: document.getElementById('wifi-ssid'),
        wifiType: document.getElementById('wifi-type'),
        wifiPass: document.getElementById('wifi-pass'),
        vcardFn: document.getElementById('vcard-fn'),
        vcardTel: document.getElementById('vcard-tel'),
        vcardEm: document.getElementById('vcard-em'),
        vcardUrl: document.getElementById('vcard-url'),
        textInput: document.getElementById('text-input'),

        // Styling
        fgColor: document.getElementById('fg-color'),
        fgColorHex: document.getElementById('fg-color-hex'),
        bgColor: document.getElementById('bg-color'),
        bgColorHex: document.getElementById('bg-color-hex'),
        swatchChips: document.querySelectorAll('.swatch-chip'),

        // Frame CTA Feature
        frameEnable: document.getElementById('frame-enable'),
        frameSubpanel: document.getElementById('frame-settings-subpanel'),
        frameTextInput: document.getElementById('frame-text-input'),
        framePosition: document.getElementById('frame-position'),
        ctaPillBtns: document.querySelectorAll('.cta-pill-btn'),

        // Logo Feature
        logoFile: document.getElementById('logo-file'),
        uploadLogoBtn: document.getElementById('upload-logo-btn'),
        iconPresetBtns: document.querySelectorAll('.icon-preset-btn'),
        activeLogoPill: document.getElementById('active-logo-pill'),
        logoPreviewImg: document.getElementById('logo-preview-img'),
        removeLogoBtn: document.getElementById('remove-logo-btn'),

        // Stage & Canvas
        canvas: document.getElementById('main-qr-canvas'),
        spinner: document.getElementById('qr-loading-spinner'),
        targetSummary: document.getElementById('target-summary'),

        // Export Actions
        downloadPngBtn: document.getElementById('download-png-btn'),
        downloadSvgBtn: document.getElementById('download-svg-btn'),
        copyClipboardBtn: document.getElementById('copy-clipboard-btn'),

        // History Drawer
        historyToggleBtn: document.getElementById('history-toggle-btn'),
        closeDrawerBtn: document.getElementById('close-drawer-btn'),
        drawerOverlay: document.getElementById('drawer-overlay'),
        historyDrawer: document.getElementById('history-drawer'),
        historyList: document.getElementById('history-list-items'),
        historyBadge: document.getElementById('history-badge'),
        historyTotalCount: document.getElementById('history-total-count'),
        clearAllHistory: document.getElementById('clear-all-history'),

        // Theme & Toast
        themeBtn: document.getElementById('theme-btn'),
        toastRoot: document.getElementById('toast-root')
    };

    // Vector Brand Icons for Logo Overlay
    const SVG_ICONS = {
        github: `<svg viewBox="0 0 24 24" fill="#090B0E"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`,
        twitter: `<svg viewBox="0 0 24 24" fill="#090B0E"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
        instagram: `<svg viewBox="0 0 24 24" fill="#E1306C"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
        wifi: `<svg viewBox="0 0 24 24" fill="#3B82F6"><path d="M12 18c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-4.95-3.54c1.37-1.37 3.23-2.21 5.29-2.21s3.92.84 5.29 2.21l1.41-1.41c-1.74-1.74-4.1-2.8-6.7-2.8s-4.96 1.06-6.7 2.8l1.41 1.41zm-2.83-2.83c2.1-2.1 4.96-3.38 8.12-3.38s6.02 1.28 8.12 3.38l1.41-1.41c-2.47-2.47-5.83-3.97-9.53-3.97s-7.06 1.5-9.53 3.97l1.41 1.41z"/></svg>`
    };

    /**
     * Compute current payload string based on active type
     */
    function computePayload() {
        switch (state.type) {
            case 'url': {
                let val = (el.urlInput.value || '').trim();
                if (!val) val = 'https://github.com/muslimbek/qrly';
                if (!val.startsWith('http://') && !val.startsWith('https://')) {
                    val = 'https://' + val;
                }
                state.payload = val;
                break;
            }
            case 'wifi': {
                const ssid = (el.wifiSsid.value || '').trim() || 'My_WiFi';
                const auth = el.wifiType.value || 'WPA';
                const pass = el.wifiPass.value || '';
                state.payload = `WIFI:T:${auth};S:${ssid};P:${pass};;`;
                break;
            }
            case 'vcard': {
                const fn = (el.vcardFn.value || '').trim() || 'Muslimbek';
                const tel = (el.vcardTel.value || '').trim();
                const em = (el.vcardEm.value || '').trim();
                const url = (el.vcardUrl.value || '').trim();
                state.payload = `BEGIN:VCARD\nVERSION:3.0\nN:${fn}\nFN:${fn}${tel ? '\nTEL:' + tel : ''}${em ? '\nEMAIL:' + em : ''}${url ? '\nURL:' + url : ''}\nEND:VCARD`;
                break;
            }
            case 'text': {
                state.payload = el.textInput.value || 'Hello from QRly';
                break;
            }
        }

        let summary = state.payload;
        if (summary.length > 38) summary = summary.substring(0, 38) + '…';
        el.targetSummary.textContent = summary;

        return state.payload;
    }

    /**
     * Build QR API URL
     */
    function getQrApiUrl(format = 'png') {
        const payload = encodeURIComponent(state.payload);
        const fg = state.fgColor.replace('#', '');
        const bg = state.bgColor.replace('#', '');
        return `https://api.qrserver.com/v1/create-qr-code/?data=${payload}&size=600x600&color=${fg}&bgcolor=${bg}&format=${format}&ecc=H&margin=1`;
    }

    /**
     * Generate & Render QR Code on Canvas
     */
    function renderQRCode() {
        computePayload();
        showSpinner(true);

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = getQrApiUrl('png');

        img.onload = () => {
            const ctx = el.canvas.getContext('2d');
            const baseSize = 600;

            if (state.frameEnabled) {
                // Extended canvas with CTA banner frame
                const bannerHeight = 110;
                const pad = 24;
                el.canvas.width = baseSize;
                el.canvas.height = baseSize + bannerHeight;

                const w = el.canvas.width;
                const h = el.canvas.height;

                // Card background
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = '#' + state.bgColor;
                roundRect(ctx, 0, 0, w, h, 28);
                ctx.fill();

                // Draw QR in proper position
                const qrY = state.framePosition === 'top' ? bannerHeight : 0;
                ctx.drawImage(img, pad, qrY + pad, baseSize - pad * 2, baseSize - pad * 2);

                // Draw Center Logo if enabled
                if (state.logoImage && state.logoImage.complete) {
                    drawCenterLogo(ctx, baseSize / 2, qrY + baseSize / 2, baseSize - pad * 2);
                }

                // Draw CTA Text Banner
                const bannerY = state.framePosition === 'top' ? 56 : baseSize + 56;
                drawCtaBanner(ctx, w / 2, bannerY, state.frameText);

            } else {
                // Standard 600x600 canvas
                el.canvas.width = baseSize;
                el.canvas.height = baseSize;
                const w = el.canvas.width;
                const h = el.canvas.height;

                ctx.clearRect(0, 0, w, h);
                ctx.drawImage(img, 0, 0, w, h);

                // Draw Center Logo if enabled
                if (state.logoImage && state.logoImage.complete) {
                    drawCenterLogo(ctx, w / 2, h / 2, w);
                }
            }

            showSpinner(false);
            autoSaveToHistory();
        };

        img.onerror = () => {
            showSpinner(false);
            showToast('Unable to reach QR service. Please check connection.', 'error');
        };
    }

    /**
     * Draw Logo with clean white shield in the center of QR
     */
    function drawCenterLogo(ctx, cx, cy, qrWidth) {
        const logoSize = qrWidth * 0.22;
        const shieldSize = logoSize + 14;

        ctx.save();

        // 1. Protective circular shield
        ctx.beginPath();
        ctx.arc(cx, cy, shieldSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = '#' + state.bgColor;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
        ctx.shadowBlur = 12;
        ctx.fill();

        // 2. Shield subtle border
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = '#' + state.fgColor;
        ctx.stroke();

        // 3. Clip and draw logo
        ctx.beginPath();
        ctx.arc(cx, cy, logoSize / 2, 0, Math.PI * 2);
        ctx.clip();

        ctx.drawImage(
            state.logoImage,
            cx - logoSize / 2,
            cy - logoSize / 2,
            logoSize,
            logoSize
        );

        ctx.restore();
    }

    /**
     * Draw CTA Banner on Canvas
     */
    function drawCtaBanner(ctx, cx, cy, text) {
        ctx.save();
        ctx.font = 'bold 28px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const textMetrics = ctx.measureText(text.toUpperCase());
        const pillWidth = Math.max(textMetrics.width + 48, 220);
        const pillHeight = 52;

        // Pill background
        ctx.fillStyle = '#' + state.fgColor;
        roundRect(ctx, cx - pillWidth / 2, cy - pillHeight / 2, pillWidth, pillHeight, 26);
        ctx.fill();

        // Pill text
        ctx.fillStyle = '#' + state.bgColor;
        ctx.fillText(text.toUpperCase(), cx, cy + 1);

        ctx.restore();
    }

    /**
     * Helper to draw rounded rect on canvas
     */
    function roundRect(ctx, x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    function showSpinner(show) {
        el.spinner.style.display = show ? 'flex' : 'none';
    }

    function queueRender() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(renderQRCode, 160);
    }


    function downloadPNG() {
        el.canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `QRly-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('Downloaded High-Res PNG!', 'success');
        }, 'image/png');
    }

    async function downloadSVG() {
        try {
            const svgUrl = getQrApiUrl('svg');
            const res = await fetch(svgUrl);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `QRly-Vector-${Date.now()}.svg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('Downloaded Vector SVG!', 'success');
        } catch (e) {
            showToast('Failed to download SVG', 'error');
        }
    }

    async function copyImageToClipboard() {
        try {
            el.canvas.toBlob(async (blob) => {
                if (!blob) throw new Error('Blob failed');
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                showToast('Copied QR Image to clipboard!', 'success');
            }, 'image/png');
        } catch (e) {
            showToast('Direct copy not supported, downloaded PNG instead', 'info');
            downloadPNG();
        }
    }

    function setLogoFromDataUrl(dataUrl) {
        state.logoDataUrl = dataUrl;
        state.logoImage = new Image();
        state.logoImage.src = dataUrl;
        state.logoImage.onload = () => {
            el.logoPreviewImg.src = dataUrl;
            el.activeLogoPill.style.display = 'inline-flex';
            renderQRCode();
            showToast('Logo embedded into QR!', 'success');
        };
    }

    function removeLogo() {
        state.logoDataUrl = null;
        state.logoImage = null;
        el.logoFile.value = '';
        el.activeLogoPill.style.display = 'none';
        renderQRCode();
        showToast('Logo removed', 'info');
    }


    function getHistory() {
        try {
            const val = localStorage.getItem(HISTORY_KEY);
            return val ? JSON.parse(val) : [];
        } catch (e) {
            return [];
        }
    }

    function autoSaveToHistory() {
        try {
            let history = getHistory();
            const currentPayload = state.payload;
            history = history.filter(h => h.payload !== currentPayload);

            const thumb = el.canvas.toDataURL('image/png', 0.5);
            history.unshift({
                id: 'qr_' + Date.now(),
                type: state.type,
                payload: currentPayload,
                fg: state.fgColor,
                bg: state.bgColor,
                thumb: thumb,
                time: Date.now()
            });

            if (history.length > 25) history = history.slice(0, 25);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
            updateHistoryUI();
        } catch (e) {
            // Quota safe
        }
    }

    function updateHistoryUI() {
        const list = getHistory();
        el.historyBadge.textContent = list.length;
        el.historyBadge.style.display = list.length > 0 ? 'inline-block' : 'none';
        el.historyTotalCount.textContent = `${list.length} item${list.length === 1 ? '' : 's'}`;

        if (list.length === 0) {
            el.historyList.innerHTML = `
                <div class="empty-history-box">
                    <p>No saved QR codes yet.</p>
                    <span>Your generated QR codes will appear here for 1-click restore.</span>
                </div>
            `;
            return;
        }

        el.historyList.innerHTML = '';
        list.forEach(item => {
            const card = document.createElement('div');
            card.className = 'history-item-row';
            card.innerHTML = `
                <div class="history-item-thumb">
                    <img src="${item.thumb}" alt="QR" />
                </div>
                <div class="history-item-info">
                    <span class="history-item-title">${escapeHtml(item.payload)}</span>
                    <span class="history-item-time">${formatTimeAgo(item.time)}</span>
                </div>
                <div class="history-item-actions">
                    <button class="restore-act-btn" title="Load this QR">Load</button>
                    <button class="del-act-btn" title="Delete">✕</button>
                </div>
            `;

            card.querySelector('.restore-act-btn').addEventListener('click', () => {
                restoreItem(item);
            });

            card.querySelector('.del-act-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteHistoryItem(item.id);
            });

            el.historyList.appendChild(card);
        });
    }

    function restoreItem(item) {
        state.type = item.type || 'url';
        state.fgColor = item.fg || '090B0E';
        state.bgColor = item.bg || 'FFFFFF';

        el.tabPills.forEach(chip => {
            chip.classList.toggle('active', chip.dataset.type === state.type);
        });
        el.paneViews.forEach(pane => {
            pane.classList.toggle('active', pane.id === `pane-${state.type}`);
        });

        if (state.type === 'url') el.urlInput.value = item.payload;
        if (state.type === 'text') el.textInput.value = item.payload;

        el.fgColor.value = '#' + state.fgColor;
        el.fgColorHex.textContent = '#' + state.fgColor;
        el.bgColor.value = '#' + state.bgColor;
        el.bgColorHex.textContent = '#' + state.bgColor;

        renderQRCode();
        closeDrawer();
        showToast('Restored QR Code from history!', 'success');
    }

    function deleteHistoryItem(id) {
        let history = getHistory().filter(h => h.id !== id);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        updateHistoryUI();
    }

    function clearHistory() {
        localStorage.removeItem(HISTORY_KEY);
        updateHistoryUI();
        showToast('Cleared all history', 'info');
    }

    function openDrawer() {
        el.historyDrawer.classList.add('open');
        el.drawerOverlay.classList.add('open');
        updateHistoryUI();
    }

    function closeDrawer() {
        el.historyDrawer.classList.remove('open');
        el.drawerOverlay.classList.remove('open');
    }



    function showToast(msg, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast-capsule ${type}`;
        toast.textContent = msg;
        el.toastRoot.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('show'));

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 250);
        }, 2600);
    }

    function formatTimeAgo(ts) {
        const diff = Math.floor((Date.now() - ts) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    }

    function escapeHtml(str) {
        return (str || '').replace(/[&<>"']/g, m => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[m]);
    }


    function initListeners() {
        // Type Tabs
        el.tabPills.forEach(chip => {
            chip.addEventListener('click', () => {
                el.tabPills.forEach(c => c.classList.remove('active'));
                el.paneViews.forEach(p => p.classList.remove('active'));

                chip.classList.add('active');
                state.type = chip.dataset.type;
                const activePane = document.getElementById(`pane-${state.type}`);
                if (activePane) activePane.classList.add('active');

                renderQRCode();
            });
        });

        // Inputs
        const inputs = [
            el.urlInput, el.wifiSsid, el.wifiType, el.wifiPass,
            el.vcardFn, el.vcardTel, el.vcardEm, el.vcardUrl, el.textInput
        ];
        inputs.forEach(input => {
            if (input) input.addEventListener('input', queueRender);
        });

        // Paste Button
        if (el.pasteBtn) {
            el.pasteBtn.addEventListener('click', async () => {
                try {
                    const clipText = await navigator.clipboard.readText();
                    if (clipText) {
                        el.urlInput.value = clipText.trim();
                        renderQRCode();
                        showToast('Pasted from clipboard', 'success');
                    }
                } catch (err) {
                    el.urlInput.focus();
                }
            });
        }

        // Color Pickers
        el.fgColor.addEventListener('input', (e) => {
            state.fgColor = e.target.value.replace('#', '');
            el.fgColorHex.textContent = e.target.value;
            queueRender();
        });

        el.bgColor.addEventListener('input', (e) => {
            state.bgColor = e.target.value.replace('#', '');
            el.bgColorHex.textContent = e.target.value;
            queueRender();
        });

        // Palette Swatches
        el.swatchChips.forEach(chip => {
            chip.addEventListener('click', () => {
                el.swatchChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');

                const fg = chip.dataset.fg;
                const bg = chip.dataset.bg;

                state.fgColor = fg.replace('#', '');
                state.bgColor = bg.replace('#', '');

                el.fgColor.value = fg;
                el.fgColorHex.textContent = fg;
                el.bgColor.value = bg;
                el.bgColorHex.textContent = bg;

                renderQRCode();
            });
        });

        // Frame CTA Toggles & Inputs
        if (el.frameEnable) {
            el.frameEnable.addEventListener('change', (e) => {
                state.frameEnabled = e.target.checked;
                el.frameSubpanel.style.display = state.frameEnabled ? 'block' : 'none';
                renderQRCode();
            });
        }

        if (el.frameTextInput) {
            el.frameTextInput.addEventListener('input', (e) => {
                state.frameText = e.target.value || 'SCAN ME';
                queueRender();
            });
        }

        if (el.framePosition) {
            el.framePosition.addEventListener('change', (e) => {
                state.framePosition = e.target.value;
                renderQRCode();
            });
        }

        el.ctaPillBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const txt = btn.dataset.text;
                state.frameText = txt;
                el.frameTextInput.value = txt;
                renderQRCode();
            });
        });

        // Logo Upload & Presets
        el.uploadLogoBtn.addEventListener('click', () => el.logoFile.click());
        el.logoFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => setLogoFromDataUrl(ev.target.result);
            reader.readAsDataURL(file);
        });

        el.iconPresetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const iconName = btn.dataset.icon;
                const svgStr = SVG_ICONS[iconName];
                if (!svgStr) return;
                const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
                setLogoFromDataUrl(dataUrl);
            });
        });

        el.removeLogoBtn.addEventListener('click', removeLogo);

        // Export Actions
        el.downloadPngBtn.addEventListener('click', downloadPNG);
        el.downloadSvgBtn.addEventListener('click', downloadSVG);
        el.copyClipboardBtn.addEventListener('click', copyImageToClipboard);

        // Drawer
        el.historyToggleBtn.addEventListener('click', openDrawer);
        el.closeDrawerBtn.addEventListener('click', closeDrawer);
        el.drawerOverlay.addEventListener('click', closeDrawer);
        el.clearAllHistory.addEventListener('click', clearHistory);

        // Theme Toggle
        el.themeBtn.addEventListener('click', () => {
            const cur = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = cur === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('QRLY_THEME', next);
        });
    }

    function init() {
        const savedTheme = localStorage.getItem('QRLY_THEME') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);

        initListeners();
        updateHistoryUI();
        renderQRCode();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
