/**
 * ChaiForm Embed SDK (Zero-Scrollbar Auto-Resize Handler)
 * https://chaiform.kenilpatel.in
 *
 * Automatically synchronizes iframe height with ChaiForm public runner
 * to ensure 100% fluid, scrollbar-free native embedding on host websites.
 */
(function () {
  if (typeof window === "undefined") return;

  function handleChaiFormMessage(event) {
    if (!event || !event.data || event.data.type !== "chaiform:resize") return;

    var newHeight = event.data.height;
    if (!newHeight || typeof newHeight !== "number") return;

    var iframes = document.querySelectorAll('iframe[src*="/form/"]');
    for (var i = 0; i < iframes.length; i++) {
      var iframe = iframes[i];
      try {
        if (iframe.contentWindow === event.source) {
          iframe.style.height = newHeight + 8 + "px";
        }
      } catch (e) {
        // Fallback matching if cross-origin access restricts contentWindow comparison
        iframe.style.height = newHeight + 8 + "px";
      }
    }
  }

  if (window.__chaiform_embed_initialized) return;
  window.__chaiform_embed_initialized = true;

  window.addEventListener("message", handleChaiFormMessage, false);
})();
