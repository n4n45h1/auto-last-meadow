/*
  Discord last meadow autoclicker (browser console/userscript style).
  Runs automatically on load - no console commands needed.
*/

(function () {
  "use strict";

  if (window.adventureClicker && typeof window.adventureClicker.unload === "function") {
    window.adventureClicker.unload();
  }

  function sleep(ms) {
    return new Promise(function (resolve) {
      window.setTimeout(resolve, ms);
    });
  }

  function clickElement(el) {
    el.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, cancelable: true }));
    el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
    el.dispatchEvent(new MouseEvent("pointerup", { bubbles: true, cancelable: true }));
    el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true }));
    el.click();
  }

  function isDisabledButton(button) {
    if (!button) return true;
    if (button.classList.contains("disabled__65fca")) return true;
    var container = button.querySelector(".container__65fca");
    if (container && container.classList.contains("containerDisabled__65fca")) return true;
    if (button.getAttribute("aria-disabled") === "true") return true;
    return false;
  }

  function makeAdventureBot() {
    var state = {
      timerId: null,
      intervalMs: 60,
      clicks: 0,
      active: false,
    };

    function findAdventureButton() {
      var selectors = [
        ".game__5c62c .activityButton__8af73 [role='button']",
        ".activityButton__8af73 .button__65fca.clickable__5c90e[role='button']",
        ".activityButton__8af73 .clickable__5c90e[role='button']",
        ".activityButton__8af73 [role='button']",
      ];

      for (var i = 0; i < selectors.length; i += 1) {
        var button = document.querySelector(selectors[i]);
        if (button) return button;
      }

      return null;
    }

    function tick() {
      var button = findAdventureButton();
      if (!button) return;
      button.click();
      state.clicks += 1;
    }

    function start() {
      if (state.active) return;
      state.timerId = window.setInterval(tick, state.intervalMs);
      state.active = true;
      console.log("[adventure] Started and running");
    }

    function stop() {
      if (!state.active) return;
      window.clearInterval(state.timerId);
      state.timerId = null;
      state.active = false;
      console.log("[adventure] Stopped");
    }

    function status() {
      return {
        active: state.active,
        intervalMs: state.intervalMs,
        clicks: state.clicks,
        buttonFound: Boolean(findAdventureButton()),
      };
    }

    function unload() {
      stop();
    }

    return {
      start: start,
      stop: stop,
      status: status,
      unload: unload,
    };
  }

  var adventure = makeAdventureBot();

  // Auto-start adventure on load
  adventure.start();

  // Expose control methods if needed
  window.adventureClicker = {
    start: function() { adventure.start(); },
    stop: function() { adventure.stop(); },
    status: function() { 
      var info = adventure.status();
      console.log("[adventure] Status:", info);
      return info;
    },
    unload: function() {
      adventure.unload();
      try {
        delete window.adventureClicker;
      } catch (e) {
        window.adventureClicker = undefined;
      }
    }
  };

  console.log("[adventure] Loaded and auto-started. Use window.adventureClicker.stop() to pause.");
})();
