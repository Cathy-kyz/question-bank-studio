(() => {
  const KEY = "ccarf-theme";
  const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  const read = () => { try { return localStorage.getItem(KEY); } catch (error) { return null; } };
  const ORDER = ["light", "eye", "dark"];
  const LABEL = { light: "Light mode", eye: "Eye-care mode", dark: "Dark mode" };
  const ICON = { light: "☀", eye: "🌿", dark: "☾" };
  const COLOR = { light: "#f7f8fc", eye: "#f1ead6", dark: "#14151f" };
  const current = () => { const saved = read(); return ORDER.includes(saved) ? saved : (media && media.matches ? "dark" : "light"); };
  const apply = (theme) => {
    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = COLOR[theme];
    const button = document.getElementById("theme-toggle");
    if (button) {
      button.textContent = ICON[theme];
      button.title = LABEL[theme];
      button.setAttribute("aria-label", `${LABEL[theme]} (tap to change)`);
    }
  };
  apply(current());
  document.addEventListener("DOMContentLoaded", () => {
    const right = document.querySelector(".topbar-right");
    if (right) {
      const button = document.createElement("button");
      button.id = "theme-toggle";
      button.className = "theme-toggle";
      button.type = "button";
      button.addEventListener("click", () => {
        const next = ORDER[(ORDER.indexOf(current()) + 1) % ORDER.length];
        try { localStorage.setItem(KEY, next); } catch (error) { /* theme still applies for this visit */ }
        apply(next);
      });
      right.appendChild(button);
    }
    apply(current());
  });
  if (media && media.addEventListener) media.addEventListener("change", () => { if (!read()) apply(current()); });
})();
