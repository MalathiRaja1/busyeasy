export const trackPageView = (path) => {
  if (window.gtag) {
    window.gtag('config', 'G-ZL17ZD4VTE', {
      page_path: path,
    });
  }
};

export const trackEvent = (action, category, label, value) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};