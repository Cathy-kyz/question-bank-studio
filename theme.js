(() => {
  const KEY = "ccarf-theme";
  const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  const read = () => { try { return localStorage.getItem(KEY); } catch (error) { return null; } };
  const current = () => { const saved = read(); return saved === "dark" || saved === "light" ? saved : (media && media.matches ? "dark" : "light"); };
  const apply = (theme) => {
    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "dark" ? "#14151f" : "#f7f8fc";
    const button = document.getElementById("theme-toggle");
    if (button) {
      button.textContent = theme === "dark" ? "☀" : "☾";
      button.setAttribute("aria-pressed", String(theme === "dark"));
      button.setAttribute("aria-label", theme === "dark" ? "Light mode" : "Dark mode");
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
        const next = current() === "dark" ? "light" : "dark";
        try { localStorage.setItem(KEY, next); } catch (error) { /* theme still applies for this visit */ }
        apply(next);
      });
      right.appendChild(button);
    }
    apply(current());
  });
  if (media && media.addEventListener) media.addEventListener("change", () => { if (!read()) apply(current()); });
})();
