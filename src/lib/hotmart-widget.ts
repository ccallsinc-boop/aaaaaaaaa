const HOTMART_SRC = "https://static.hotmart.com/checkout/widget.min.js";
const HOTMART_CSS = "https://static.hotmart.com/css/hotmart-fb.min.css";

// The Hotmart widget binds to `.hotmart-fb` anchors when its script loads,
// so it must be (re)loaded after the checkout button exists in the DOM.
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
  document.head.appendChild(script);
}

export const HOTMART_WIDGET_CLASSES = "hotmart-fb hotmart__button-checkout";
