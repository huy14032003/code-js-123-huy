import Utils from "./Utils.js";

export default class AutoScrollElement {
    #options = {
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
    };

    /**
     * @typedef {Object} UI
     * @property {WeakRef<HTMLElement>} element
     */

    /** @type {UI} */
    #ui = {
        element: null,
    };

    /**
     * @typedef {Object} State
     * @property {MutationObserver | null} mutationObserver
     */

    /** @type {State} */
    #state = {
        mutationObserver: null,
    }

    /**
     * @param {WeakRef<HTMLElement>} element 
     * @param {Record<any, any>} options 
     */
    constructor(element, options = {}) {
        if(!element) {
            throw new Error("Element is required");
        }
        Utils.merge(this.#options, options);
        this.#ui.element = new WeakRef(element);

        this.#state.mutationObserver = new MutationObserver(() => this.#scrollToBottom());
        this.#state.mutationObserver.observe(element, { childList: true, subtree: true });
    }

    destroy() {
        this.#state.mutationObserver?.disconnect();
        this.#state.mutationObserver = null;
        this.#ui.element = null;
    }

    #scrollToBottom() {
        const element = this.#ui.element?.deref();
        if(!element) {
            return;
        }
        
        requestAnimationFrame(() => {
            element.scrollTo({
                behavior: this.#options.behavior,
                top: element.scrollHeight,
            });
        });
    }
}
