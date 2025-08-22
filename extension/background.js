let activeDomain = null;
let startTime = null;

function getDomain(url) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return null;
  }
}

function startTracking(domain) {
  activeDomain = domain;
  startTime = Date.now();
}

function stopTracking() {
  if (activeDomain && startTime) {
    const duration = Math.floor((Date.now() - startTime) / 1000); // seconds
    chrome.storage.local.get([activeDomain], (res) => {
      const prev = res[activeDomain] || 0;
      chrome.storage.local.set({ [activeDomain]: prev + duration });
    });
  }
  activeDomain = null;
  startTime = null;
}

// Track when user changes tab
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  stopTracking();
  if (tab.url) startTracking(getDomain(tab.url));
});

// Track when tab updates (page reload/navigation)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === "complete") {
    stopTracking();
    if (tab.url) startTracking(getDomain(tab.url));
  }
});

// Track when window focus changes
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    stopTracking(); // user left Chrome
  } else {
    const [tab] = await chrome.tabs.query({ active: true, windowId });
    if (tab) {
      stopTracking();
      if (tab.url) startTracking(getDomain(tab.url));
    }
  }
});
