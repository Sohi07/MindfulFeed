// MindfulFeed Popup Script - MVP Version

console.log('MindfulFeed popup loaded');

// DOM elements
const loadingEl = document.getElementById('loading');
const contentEl = document.getElementById('content');
const currentPlatformEl = document.getElementById('current-platform');
const currentTimeEl = document.getElementById('current-time');
const dailyStatsEl = document.getElementById('daily-stats');
const openDashboardBtn = document.getElementById('open-dashboard');

// Sentiment elements
const positivePercentEl = document.getElementById('positive-percent');
const neutralPercentEl = document.getElementById('neutral-percent');
const negativePercentEl = document.getElementById('negative-percent');

// Format time from seconds to readable format
function formatTime(seconds) {
  if (seconds < 60) {
    return `${seconds} seconds`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}

// Capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Get current session info from background script
function getCurrentSession() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'getActiveTime' }, (response) => {
      if (chrome.runtime.lastError) {
        console.log('No background response:', chrome.runtime.lastError.message);
        resolve({ currentSession: 0, platform: null, domain: null });
      } else {
        resolve(response || { currentSession: 0, platform: null, domain: null });
      }
    });
  });
}

// Load and display all data
async function loadPopupData() {
  try {
    // Get current session from background script
    const currentSession = await getCurrentSession();
    
    // Get stored data
    chrome.storage.local.get([
      'dailyTime', 
      'platformTime', 
      'analysisHistory'
    ], (data) => {
      console.log('Popup data loaded:', data);
      
      // Update current session
      updateCurrentSession(currentSession);
      
      // Update daily stats
      updateDailyStats(data.dailyTime || {});
      
      // Update sentiment stats
      updateSentimentStats(data.analysisHistory || []);
      
      // Show content, hide loading
      loadingEl.style.display = 'none';
      contentEl.style.display = 'block';
    });
    
  } catch (error) {
    console.error('Error loading popup data:', error);
    loadingEl.textContent = 'Error loading data';
  }
}

// Update current session display
function updateCurrentSession(session) {
  if (session.platform) {
    currentPlatformEl.textContent = `📱 ${capitalize(session.platform)}`;
    currentTimeEl.textContent = formatTime(session.currentSession);
  } else {
    currentPlatformEl.textContent = '✅ Not on social media';
    currentTimeEl.textContent = 'Great job taking a break!';
  }
}

// Update today's daily stats
function updateDailyStats(dailyTime) {
  const today = new Date().toDateString();
  const todayData = dailyTime[today];
  
  if (!todayData || Object.keys(todayData).length === 0) {
    dailyStatsEl.innerHTML = '<div class="no-data">No social media usage today</div>';
    return;
  }
  
  // Sort platforms by time spent
  const sortedPlatforms = Object.entries(todayData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3); // Show top 3
  
  let statsHTML = '';
  sortedPlatforms.forEach(([platform, seconds]) => {
    statsHTML += `
      <div class="stat-item">
        <span class="platform-name">${capitalize(platform)}</span>
        <span class="time-value">${formatTime(seconds)}</span>
      </div>
    `;
  });
  
  dailyStatsEl.innerHTML = statsHTML;
}

// Update sentiment stats from recent analysis
function updateSentimentStats(analysisHistory) {
  if (!analysisHistory || analysisHistory.length === 0) {
    positivePercentEl.textContent = '0%';
    neutralPercentEl.textContent = '0%';
    negativePercentEl.textContent = '0%';
    return;
  }
  
  // Get recent analyses (last 10)
  const recentAnalyses = analysisHistory.slice(-10);
  
  // Calculate totals
  let totalPositive = 0;
  let totalNegative = 0;
  let totalNeutral = 0;
  let totalContent = 0;
  
  recentAnalyses.forEach(analysis => {
    totalPositive += analysis.positive || 0;
    totalNegative += analysis.negative || 0;
    totalNeutral += analysis.neutral || 0;
    totalContent += analysis.total || 0;
  });
  
  if (totalContent > 0) {
    const positivePercent = Math.round((totalPositive / totalContent) * 100);
    const negativePercent = Math.round((totalNegative / totalContent) * 100);
    const neutralPercent = Math.round((totalNeutral / totalContent) * 100);
    
    positivePercentEl.textContent = `${positivePercent}%`;
    negativePercentEl.textContent = `${negativePercent}%`;
    neutralPercentEl.textContent = `${neutralPercent}%`;
  } else {
    positivePercentEl.textContent = '0%';
    neutralPercentEl.textContent = '0%';
    negativePercentEl.textContent = '0%';
  }
}

// Open dashboard in new tab
function openDashboard() {
  // For now, we'll create the dashboard URL
  // You'll replace this with your actual dashboard URL
  const dashboardUrl = chrome.runtime.getURL('../dashboard/index.html');
  
  chrome.tabs.create({ url: dashboardUrl }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error opening dashboard:', chrome.runtime.lastError);
      // Fallback: try to open your web dashboard
      chrome.tabs.create({ url: 'http://localhost:3000' }); // Your React app
    }
  });
  
  // Close popup
  window.close();
}

// Event listeners
openDashboardBtn.addEventListener('click', openDashboard);

// Auto-refresh current session every 5 seconds
setInterval(async () => {
  if (contentEl.style.display !== 'none') {
    const currentSession = await getCurrentSession();
    updateCurrentSession(currentSession);
  }
}, 5000);

// Load data when popup opens
document.addEventListener('DOMContentLoaded', loadPopupData);

// Also load immediately if DOM is already ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadPopupData);
} else {
  loadPopupData();
}