import { SETTING_STORE_KEY } from "./config.js";

export class Setting {
    static instance;

    constructor(opts = {}) {
        if (Setting.instance) {
            return Setting.instance;
        }

        this.#isOpenPopup = false;
        this.opts = {};
        this.setOptions(opts);

        this.#setupEventListeners();
        Setting.instance = this;
    }

    // --- Private properties ---
    #isOpenPopup = false;
    #popupElement = null;

    // --- Private methods ---
    #setupEventListeners() {
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === ",") {
                this.togglePopup();
            }
        });
    }

    #createPopup() {
        if (this.#popupElement) return;

        const popup = document.createElement("div");
        popup.id = "setting-popup";

        // Fullscreen style
        popup.style.position = "fixed";
        popup.style.top = "4rem";
        popup.style.left = "0";
        popup.style.width = "100vw";
        popup.style.height = "100vh";
        popup.style.backgroundColor = "rgba(0, 0, 0, 0.95)";
        popup.style.color = "#fff";
        popup.style.zIndex = 9999;
        popup.style.padding = "40px";
        popup.style.boxSizing = "border-box";
        popup.style.overflowY = "auto";

        const title = document.createElement("h5");
        title.textContent = "⚙️ Settings";
        title.style.marginBottom = "20px";
        popup.appendChild(title);

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "❌ Close";
        closeBtn.style.position = "absolute";
        closeBtn.style.top = "20px";
        closeBtn.style.right = "20px";
        closeBtn.style.background = "#dc3545";
        closeBtn.style.color = "#fff";
        closeBtn.style.border = "none";
        closeBtn.style.padding = "10px 15px";
        closeBtn.style.fontSize = "16px";
        closeBtn.style.cursor = "pointer";
        closeBtn.addEventListener("click", () => this.#closePopup());
        popup.appendChild(closeBtn);

        const form = document.createElement("form");
        form.id = "setting-form";

        // Generate inputs from opts
        for (const key in this.opts) {
            const container = document.createElement("div");
            container.style.marginBottom = "20px";

            const label = document.createElement("label");
            label.textContent = key;
            label.style.display = "block";
            label.style.fontWeight = "bold";
            label.style.marginBottom = "5px";

            const input = document.createElement("input");
            input.type = "text";
            input.name = key;
            input.value = this.opts[key] ?? '';
            input.style.width = "100%";
            input.style.padding = "10px";
            input.style.borderRadius = "4px";
            input.style.border = "1px solid #ccc";

            container.appendChild(label);
            container.appendChild(input);
            form.appendChild(container);
        }

        const saveBtn = document.createElement("button");
        saveBtn.type = "submit";
        saveBtn.textContent = "💾 Save Settings";
        saveBtn.style.padding = "12px 20px";
        saveBtn.style.background = "#28a745";
        saveBtn.style.color = "#fff";
        saveBtn.style.border = "none";
        saveBtn.style.cursor = "pointer";
        saveBtn.style.fontSize = "16px";
        saveBtn.style.marginTop = "20px";

        form.appendChild(saveBtn);

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const newOpts = {};
            for (const [key, value] of formData.entries()) {
                newOpts[key] = value;
            }
            this.setOptions(newOpts);
        });

        popup.appendChild(form);
        document.body.appendChild(popup);
        this.#popupElement = popup;

        this.onCreated();
    }

    #updatePopup() {
        if (!this.#popupElement) return;

        const form = this.#popupElement.querySelector("form");
        if (!form) return;

        // Update input values in form
        for (const [key, value] of Object.entries(this.opts)) {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = value ?? '';
            }
        }

        this.onUpdated();
    }

    #openPopup() {
        this.#isOpenPopup = true;
        Logger.warn('<span class="text-greenyellow">[SETIG]</span> Setting has opened!');
        this.#createPopup();
    }

    #closePopup() {
        this.#isOpenPopup = false;
        Logger.warn('<span class="text-greenyellow">[SETIG]</span> Setting has closed!');
        if (this.#popupElement) {
            document.body.removeChild(this.#popupElement);
            this.#popupElement = null;
        }
    }

    // --- Public methods ---
    togglePopup() {
        if (this.#isOpenPopup) {
            this.#closePopup();
        } else {
            this.#openPopup();
        }
    }

    /**
     * Cập nhật các tùy chọn cấu hình.
     * @param {Object} options
     */
    setOptions(options = {}) {
        this.opts = {
            ...this.opts,
            ...options
        };
        localStorage.setItem(SETTING_STORE_KEY, JSON.stringify(this.opts));
        this.#updatePopup();
    }

    /**
     * Gọi khi popup được tạo lần đầu.
     */
    onCreated() {
        Logger.info('<span class="text-yellow">[SETIG]</span> Popup created.');
    }

    /**
     * Gọi khi popup được cập nhật nội dung.
     */
    onUpdated() {
        Logger.info('<span class="text-yellow">[SETIG]</span> Popup updated.');
    }
}