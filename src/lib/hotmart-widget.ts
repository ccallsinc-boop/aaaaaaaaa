const HOTMART_SRC = "https://static.hotmart.com/checkout/widget.min.js";
const HOTMART_CSS = "https://static.hotmart.com/css/hotmart-fb.min.css";

let loaded = false;

/**
 * True once Hotmart's widget script has actually loaded.
 *
 * Checkout buttons keep a real href and only cancel navigation when this is true.
 * Hotmart's own snippet uses `onclick="return false;"` unconditionally, which
 * turns every button into a no-op whenever their CDN is slow or blocked. Gating on
 * the load event keeps the overlay when it works and falls back to navigating to
 * the same checkout URL when it does not.
 */
export function hotmartWidgetLoaded(): boolean {
  return loaded;
}

// The widget binds to `.hotmart-fb` anchors when its script loads, so it must be
// (re)loaded after the checkout buttons exist in the DOM.
export function loadHotmartWidget() {
  if (!document.querySelector(`link[href="${HOTMART_CSS}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = HOTMART_CSS;
    document.head.appendChild(link);
  }
  document.querySelectorAll(`script[src="${HOTMART_SRC}"]`).forEach((el) => el.remove());
  const script = document.createElement("script");
  script.src = HOTMART_SRC;
  script.async = true;
  script.addEventListener("load", () => {
    loaded = true;
  });
  script.addEventListener("error", () => {
    loaded = false;
  });
  document.head.appendChild(script);
}

export const HOTMART_WIDGET_CLASSES = "hotmart-fb hotmart__button-checkout";
