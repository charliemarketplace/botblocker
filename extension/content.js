// Quick Twitter Block - Content Script
// Handles tweet detection, button injection, and blocking logic

class QuickBlockManager {
  constructor() {
    this.blockedUsers = new Set();
    this.processedTweets = new WeakSet();
    this.observerDebounceTimer = null;
    this.config = {
      blockMode: 'hide', // 'hide' or 'native'
      buttonVisibility: 'hover' // 'hover' or 'always'
    };

    this.init();
  }

  async init() {
    // Load blocked users from storage
    await this.loadBlockedUsers();

    // Load config
    await this.loadConfig();

    // Process existing tweets
    this.processAllTweets();

    // Set up mutation observer for new tweets
    this.setupObserver();

    // Listen for storage changes (sync across tabs)
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.blockedUsers) {
        this.loadBlockedUsers();
      }
    });
  }

  async loadBlockedUsers() {
    const data = await chrome.storage.local.get(['blockedUsers']);
    const blockedList = data.blockedUsers || [];
    this.blockedUsers = new Set(blockedList.map(u => u.username.toLowerCase()));

    // Re-apply blocks to visible tweets
    this.hideBlockedTweets();
  }

  async loadConfig() {
    const data = await chrome.storage.local.get(['config']);
    if (data.config) {
      this.config = { ...this.config, ...data.config };
    }
  }

  setupObserver() {
    const observer = new MutationObserver((mutations) => {
      // Debounce to avoid excessive processing
      clearTimeout(this.observerDebounceTimer);
      this.observerDebounceTimer = setTimeout(() => {
        this.processAllTweets();
      }, 100);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  processAllTweets() {
    const tweets = document.querySelectorAll('article[data-testid="tweet"]');
    tweets.forEach(tweet => {
      if (!this.processedTweets.has(tweet)) {
        this.processTweet(tweet);
        this.processedTweets.add(tweet);
      }
    });
  }

  processTweet(tweetElement) {
    // Extract username from tweet
    const userInfo = this.extractUserInfo(tweetElement);

    if (!userInfo) return;

    // Check if user is already blocked
    if (this.blockedUsers.has(userInfo.username.toLowerCase())) {
      this.hideTweet(tweetElement, false);
      return;
    }

    // Inject block button
    this.injectBlockButton(tweetElement, userInfo);
  }

  extractUserInfo(tweetElement) {
    // Try to find username link
    // Twitter structure: a[href^="/"][href*="/status/"] or the author link
    const usernameLinks = tweetElement.querySelectorAll('a[href^="/"]');

    for (const link of usernameLinks) {
      const href = link.getAttribute('href');
      if (!href) continue;

      // Extract username from href (format: /@username or /username)
      const match = href.match(/^\/([^\/]+)/);
      if (match && match[1] && !match[1].includes('status') && !match[1].includes('i/')) {
        const username = match[1];

        // Try to get user ID from data attributes or other sources
        const userId = this.extractUserId(tweetElement) || username;

        return { username, userId };
      }
    }

    return null;
  }

  extractUserId(tweetElement) {
    // Try to extract user ID from various possible locations
    // This is a best-effort approach as Twitter's DOM can vary

    // Check for data attributes
    const userIdAttr = tweetElement.querySelector('[data-testid="User-Name"]');
    if (userIdAttr) {
      const links = userIdAttr.querySelectorAll('a[href^="/"]');
      if (links.length > 0) {
        return links[0].getAttribute('href')?.replace('/', '') || null;
      }
    }

    return null;
  }

  injectBlockButton(tweetElement, userInfo) {
    // Check if button already exists
    if (tweetElement.querySelector('.quick-block-btn')) return;

    // Create button
    const button = document.createElement('button');
    button.className = 'quick-block-btn';
    button.setAttribute('data-username', userInfo.username);
    button.setAttribute('data-user-id', userInfo.userId);
    button.setAttribute('title', `Block @${userInfo.username}`);
    button.textContent = 'B';

    // Add click handler
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.blockUser(userInfo.username, userInfo.userId, tweetElement);
    });

    // Append button to tweet
    // Try to position it in the header area
    const header = tweetElement.querySelector('[data-testid="User-Name"]')?.parentElement;
    if (header) {
      header.style.position = 'relative';
      header.appendChild(button);
    } else {
      // Fallback: append to tweet element
      tweetElement.style.position = 'relative';
      tweetElement.appendChild(button);
    }
  }

  async blockUser(username, userId, tweetElement) {
    const normalizedUsername = username.toLowerCase();

    // Add to blocked set
    this.blockedUsers.add(normalizedUsername);

    // Save to storage
    const data = await chrome.storage.local.get(['blockedUsers']);
    const blockedList = data.blockedUsers || [];

    blockedList.push({
      username: username,
      userId: userId,
      blockedAt: new Date().toISOString(),
      method: this.config.blockMode
    });

    await chrome.storage.local.set({ blockedUsers: blockedList });

    // Hide the clicked tweet
    this.hideTweet(tweetElement, true);

    // Hide all other tweets from this user
    this.hideAllTweetsFromUser(normalizedUsername);

    // Show toast notification
    this.showToast(username, userId);
  }

  hideTweet(tweetElement, animate = false) {
    if (animate) {
      tweetElement.classList.add('extension-hiding');
      setTimeout(() => {
        tweetElement.classList.add('extension-hidden');
        tweetElement.classList.remove('extension-hiding');
      }, 300);
    } else {
      tweetElement.classList.add('extension-hidden');
    }
  }

  hideAllTweetsFromUser(username) {
    const normalizedUsername = username.toLowerCase();
    const allTweets = document.querySelectorAll('article[data-testid="tweet"]');

    allTweets.forEach(tweet => {
      const userInfo = this.extractUserInfo(tweet);
      if (userInfo && userInfo.username.toLowerCase() === normalizedUsername) {
        this.hideTweet(tweet, true);
      }
    });
  }

  hideBlockedTweets() {
    const allTweets = document.querySelectorAll('article[data-testid="tweet"]');

    allTweets.forEach(tweet => {
      const userInfo = this.extractUserInfo(tweet);
      if (userInfo && this.blockedUsers.has(userInfo.username.toLowerCase())) {
        this.hideTweet(tweet, false);
      }
    });
  }

  async unblockUser(username) {
    const normalizedUsername = username.toLowerCase();
    this.blockedUsers.delete(normalizedUsername);

    // Remove from storage
    const data = await chrome.storage.local.get(['blockedUsers']);
    const blockedList = data.blockedUsers || [];
    const updatedList = blockedList.filter(
      u => u.username.toLowerCase() !== normalizedUsername
    );

    await chrome.storage.local.set({ blockedUsers: updatedList });

    // Unhide tweets
    this.unhideAllTweetsFromUser(normalizedUsername);
  }

  unhideAllTweetsFromUser(username) {
    const normalizedUsername = username.toLowerCase();
    const allTweets = document.querySelectorAll('article[data-testid="tweet"]');

    allTweets.forEach(tweet => {
      const userInfo = this.extractUserInfo(tweet);
      if (userInfo && userInfo.username.toLowerCase() === normalizedUsername) {
        tweet.classList.remove('extension-hidden', 'extension-hiding');
      }
    });
  }

  showToast(username, userId) {
    // Remove any existing toast
    const existingToast = document.querySelector('.quick-block-toast');
    if (existingToast) {
      existingToast.remove();
    }

    // Create toast
    const toast = document.createElement('div');
    toast.className = 'quick-block-toast';

    const message = document.createElement('span');
    message.className = 'quick-block-toast-message';
    message.textContent = `Hidden @${username}`;

    const undoBtn = document.createElement('button');
    undoBtn.className = 'quick-block-toast-undo';
    undoBtn.textContent = 'Undo';
    undoBtn.addEventListener('click', () => {
      this.unblockUser(username);
      toast.remove();
    });

    toast.appendChild(message);
    toast.appendChild(undoBtn);
    document.body.appendChild(toast);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
      }
    }, 5000);
  }
}

// Initialize the extension
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new QuickBlockManager();
  });
} else {
  new QuickBlockManager();
}
