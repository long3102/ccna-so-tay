const Format = (() => {
  function esc(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function inline(value) {
    return esc(value)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }

  function list(tag, items) {
    return `<${tag}>${items.map((item) => `<li>${inline(item)}</li>`).join("")}</${tag}>`;
  }

  return { esc, inline, list };
})();
