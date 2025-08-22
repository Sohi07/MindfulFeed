// MindfulFeed Content Script - MVP Version
// Simple, working solution for 5-day deadline

console.log('MindfulFeed content script loaded');

// Simple sentiment analysis without external dependencies
function analyzeSentiment(text) {
  const positiveWords = [
    'good', 'great', 'love', 'amazing', 'happy', 'awesome', 'excellent', 
    'wonderful', 'perfect', 'best', 'fantastic', 'brilliant', 'beautiful',
    'nice', 'cool', 'fun', 'excited', 'grateful', 'blessed', 'proud'
  ];
  
  const negativeWords = [
    'bad', 'hate', 'terrible', 'awful', 'sad', 'angry', 'worst', 
    'horrible', 'stupid', 'boring', 'annoying', 'frustrated', 'disappointed',
    'disgusting', 'pathetic', 'useless', 'depressed', 'stressed', 'worried'
  ];
  
  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 1;
    if (negativeWords.includes(word)) score -= 1;
  });
  
  return { 
    score: score, 
    sentiment: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral' 
  };
}

// Detect which social media platform we're on
function getCurrentPlatform() {
  const hostname = window.location.hostname.toLowerCase();
  
  if (hostname.includes('youtube.com')) return 'youtube';
  if (hostname.includes('instagram.com')) return 'instagram';
  if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'twitter';
  if (hostname.includes('facebook.com')) return 'facebook';
  if (hostname.includes('reddit.com')) return 'reddit';
  
  return 'unknown';
}

// Track time spent on current page
let startTime = Date.now();
let isActive = true;
let lastActivity = Date.now();

// Update activity when user interacts with page
['click', 'scroll', 'keypress', 'mousemove'].forEach(event => {
  document.addEventListener(event, () => {
    lastActivity = Date.now();
    isActive = true;
  }, { passive: true });
});

// Check if user is still active (inactive after 30 seconds)
setInterval(() => {
  isActive = (Date.now() - lastActivity) < 30000;
}, 5000);

// Main function to analyze the feed content
function analyzeFeed() {
  const platform = getCurrentPlatform();
  
  if (platform === 'unknown') {
    console.log('MindfulFeed: Platform not supported');
    return;
  }

  if (!isActive) {
    console.log('MindfulFeed: User inactive, skipping analysis');
    return;
  }

  console.log(`MindfulFeed: Analyzing ${platform} feed...`);
  
  let texts = [];
  
  // Extract text content from page - keeping it simple for MVP
  const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
  
  textElements.forEach(element => {
    const text = element.innerText?.trim();
    
    // Filter for meaningful content
    if (text && 
        text.length > 10 && 
        text.length < 500 && 
        !isUIText(text)) {
      texts.push(text);
    }
  });

  // Limit to 50 texts for performance
  texts = texts.slice(0, 50);
  
  if (texts.length === 0) {
    console.log('MindfulFeed: No content found to analyze');
    return;
  }

  // Analyze sentiment of extracted texts
  let stats = {
    positive: 0,
    negative: 0,
    neutral: 0,
    total: texts.length,
    platform: platform,
    timestamp: Date.now(),
    url: window.location.href,
    sessionTime: Math.floor((Date.now() - startTime) / 1000) // seconds
  };

  let totalScore = 0;

  texts.forEach(text => {
    const result = analyzeSentiment(text);
    totalScore += result.score;
    
    if (result.sentiment === 'positive') {
      stats.positive++;
    } else if (result.sentiment === 'negative') {
      stats.negative++;
    } else {
      stats.neutral++;
    }
  });

  stats.averageScore = texts.length > 0 ? (totalScore / texts.length).toFixed(2) : 0;
  
  // Calculate percentages
  stats.positivePercent = Math.round((stats.positive / stats.total) * 100);
  stats.negativePercent = Math.round((stats.negative / stats.total) * 100);
  stats.neutralPercent = Math.round((stats.neutral / stats.total) * 100);

  console.log('MindfulFeed analysis result:', stats);
  
  // Save data to Chrome storage
  saveAnalysisData(stats);
}

// Check if text is likely UI element (to filter out navigation, buttons, etc.)
function isUIText(text) {
  const uiPatterns = [
    /^(like|share|comment|follow|subscribe|login|logout|home|profile|settings|search)$/i,
    /^\d+\s+(like|share|comment|view|subscriber)s?$/i,
    /^(•|→|←|↑|↓|\||-)$/,
    /^(am|pm|\d{1,2}:\d{2})$/i,
    /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i
  ];
  
  return uiPatterns.some(pattern => pattern.test(text.trim())) || 
         text.length < 3 || 
         /^[\d\s.,!?-]+$/.test(text);
}

// Save analysis data to Chrome storage
function saveAnalysisData(stats) {
  chrome.storage.local.get({
    analysisHistory: [],
    dailyStats: {},
    platformTime: {}
  }, (data) => {
    
    // Add to analysis history
    data.analysisHistory.push(stats);
    
    // Keep only last 100 entries for MVP
    if (data.analysisHistory.length > 100) {
      data.analysisHistory = data.analysisHistory.slice(-100);
    }
    
    // Update daily stats
    const today = new Date().toDateString();
    if (!data.dailyStats[today]) {
      data.dailyStats[today] = {};
    }
    
    if (!data.dailyStats[today][stats.platform]) {
      data.dailyStats[today][stats.platform] = {
        sessions: 0,
        totalTime: 0,
        contentAnalyzed: 0,
        sentiment: { positive: 0, negative: 0, neutral: 0 }
      };
    }
    
    // Update today's stats
    const todayPlatform = data.dailyStats[today][stats.platform];
    todayPlatform.sessions++;
    todayPlatform.totalTime += stats.sessionTime;
    todayPlatform.contentAnalyzed += stats.total;
    todayPlatform.sentiment.positive += stats.positive;
    todayPlatform.sentiment.negative += stats.negative;
    todayPlatform.sentiment.neutral += stats.neutral;
    
    // Update total platform time
    if (!data.platformTime[stats.platform]) {
      data.platformTime[stats.platform] = 0;
    }
    data.platformTime[stats.platform] += 2; // 2 minutes increment
    
    // Save everything back to storage
    chrome.storage.local.set({
      analysisHistory: data.analysisHistory,
      dailyStats: data.dailyStats,
      platformTime: data.platformTime,
      lastUpdate: Date.now()
    }, () => {
      if (chrome.runtime.lastError) {
        console.error('MindfulFeed storage error:', chrome.runtime.lastError);
      } else {
        console.log('MindfulFeed: Data saved successfully');
      }
    });
  });
}

// Send message to background script about current activity
function sendHeartbeat() {
  if (chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage({
      type: 'heartbeat',
      platform: getCurrentPlatform(),
      isActive: isActive,
      timeSpent: Date.now() - startTime
    }).catch(error => {
      // Ignore errors if background script is not available
      console.log('Background script not available:', error.message);
    });
  }
}

// Initialize the extension
function initialize() {
  const platform = getCurrentPlatform();
  
  if (platform === 'unknown') {
    console.log('MindfulFeed: Platform not supported, exiting');
    return;
  }
  
  console.log(`MindfulFeed: Starting analysis on ${platform}`);
  
  // Initial analysis after 3 seconds (let page load)
  setTimeout(() => {
    analyzeFeed();
  }, 3000);
  
  // Analyze every 2 minutes
  setInterval(() => {
    if (isActive) {
      analyzeFeed();
    }
  }, 120000); // 2 minutes
  
  // Send heartbeat every 30 seconds
  setInterval(sendHeartbeat, 30000);
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

// Handle page navigation (for single-page apps like Instagram, Twitter)
let currentUrl = window.location.href;
setInterval(() => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;
    startTime = Date.now(); // Reset session timer
    console.log('MindfulFeed: Page navigation detected, restarting analysis');
    setTimeout(analyzeFeed, 2000); // Analyze after navigation
  }
}, 1000);