import Utils from "./Utils.js";
import gsap from "./libs/gsap/index.js";
import Flip from "./libs/gsap/Flip.js";

const ScreenController = (() => {
  let _opts = {
    layoutId: null,
    numberOfScreen: 0,
  };

  let state = null;
  let layoutElem = null;
  let cardItems = [];

  const screenMap = {
    screen1: [1, 2, 3, 4, 5, 8, 11, 42],
    screen2: [1, 11, 8, 23, 25, 26, 42, 5],
    screen3: [1, 21, 8, 14, 42, 11, 5],
    screen4: [43, 29, 30, 33, 34, 35, 37, 42],
    screen5: [1, 3, 4, 5, 41, 11],
    screen6: [1, 21, 2, 4, 34, 35, 37, 14, 15, 16, 17],
    screen7: [1, 22, 2, 34, 35, 37, 23, 24, 25, 26],
  };

  function _cacheDom() {
    layoutElem = document.getElementById(_opts.layoutId);
    cardItems = [];
    for (let i = 1; i <= _opts.numberOfScreen; i++) {
      const el = document.querySelector(`.cardItem${i}`);
      if (el) cardItems[i] = el;
    }
  }

  async function _switchToScreenWithKey(arr) {
    arr.forEach((i) => {
      const el = cardItems[i];
      if (el) el.classList.remove("d-none");
    });

    Flip.from(state, {
      duration: 0.4,
      ease: "power1.inOut",
    });
  }

  async function switchTo(screen, opts = { onComplete: () => {} }) {
    state = Flip.getState(`#${_opts.layoutId}, .cardItem`);

    cardItems.forEach((el) => {
      if (el) el.classList.add("d-none");
    });

    Object.keys(screenMap).forEach((cls) => layoutElem.classList.remove(cls));

    const screenKey = screenMap[screen] ? screen : "screen1";
    layoutElem.classList.add(screenKey);

    await _switchToScreenWithKey(screenMap[screenKey]);

    window.dispatchEvent(new Event("resize"));
    opts.onComplete?.(screen);
  }

  function init(opts = {}) {
    Utils.merge(_opts, opts);
    _cacheDom();
    gsap.timeline()
      .fromTo(
        ".cardItem:not(.d-none)",
        { opacity: 0.75, y: -50 },
        { opacity: 0.8, y: 0, ease: "power1.inOut" }
      )
      .to(".cardItem:not(.d-none)", { opacity: 1, ease: "power2" });
  }

  return {
    switchTo,
    init,
  };
})();

export default ScreenController;