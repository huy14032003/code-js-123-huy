import Utils from "./Utils.js";

const Chatbot = (() => {
    let _opts = {
        flat: {
            enabled: false,
            container: null,
        }
    };

    function init(opts) {
        Utils.merge(_opts, opts);
    };
    return { init };
})();

export default Chatbot;