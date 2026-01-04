// Popup script for Quick Twitter Block extension

class PopupManager {
  constructor() {
    this.blockedUsers = [];
    this.config = {
      blockMode: 'hide',
      buttonVisibility: 'hover'
    };
    this.searchQuery = '';

    this.init();
  }

  async init() {
    // Load data
    await this.loadData();

    // Setup event listeners
    this.setupEventListeners();

    // Render UI
    this.render();
  }

  async loadData() {
    const data = await chrome.storage.local.get(['blockedUsers', 'config']);

    this.blockedUsers = data.blockedUsers || [];
    this.config = data.config || { blockMode: 'hide', buttonVisibility: 'hover' };

    // Sort by most recent first
    this.blockedUsers.sort((a, b) =>
      new Date(b.blockedAt) - new Date(a.blockedAt)
    );
  }

  setupEventListeners() {
    // Block mode selector
    const blockModeSelect = document.getElementById('blockMode');
    blockModeSelect.value = this.config.blockMode;
    blockModeSelect.addEventListener('change', (e) => {
      this.config.blockMode = e.target.value;
      this.saveConfig();
    });

    // Button visibility selector
    const buttonVisibilitySelect = document.getElementById('buttonVisibility');
    buttonVisibilitySelect.value = this.config.buttonVisibility;
    buttonVisibilitySelect.addEventListener('change', (e) => {
      this.config.buttonVisibility = e.target.value;
      this.saveConfig();
    });

    // Search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase();
      this.renderBlockedUsers();
    });

    // Export button
    document.getElementById('exportBtn').addEventListener('click', () => {
      this.exportBlockList();
    });

    // Import button
    document.getElementById('importBtn').addEventListener('click', () => {
      document.getElementById('importFileInput').click();
    });

    // Import file input
    document.getElementById('importFileInput').addEventListener('change', (e) => {
      this.importBlockList(e.target.files[0]);
    });

    // Clear all button
    document.getElementById('clearAllBtn').addEventListener('click', () => {
      this.clearAllBlocks();
    });

    // Listen for storage changes
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.blockedUsers) {
        this.loadData().then(() => this.render());
      }
    });
  }

  async saveConfig() {
    await chrome.storage.local.set({ config: this.config });
  }

  render() {
    this.renderStats();
    this.renderBlockedUsers();
  }

  renderStats() {
    const blockedCount = this.blockedUsers.length;
    document.getElementById('blockedCount').textContent = blockedCount;

    // Calculate total tweets hidden (rough estimate)
    // Assume average of 10 tweets per user visible at any time
    const tweetsHiddenEstimate = blockedCount * 10;
    document.getElementById('tweetsHiddenCount').textContent = tweetsHiddenEstimate;
  }

  renderBlockedUsers() {
    const listContainer = document.getElementById('blockedUsersList');

    // Filter users based on search query
    const filteredUsers = this.searchQuery
      ? this.blockedUsers.filter(u =>
          u.username.toLowerCase().includes(this.searchQuery)
        )
      : this.blockedUsers;

    // Clear existing content
    listContainer.innerHTML = '';

    if (filteredUsers.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.className = 'empty-message';
      emptyMessage.textContent = this.searchQuery
        ? 'No users found matching your search'
        : 'No blocked users yet';
      listContainer.appendChild(emptyMessage);
      return;
    }

    // Render each user
    filteredUsers.forEach(user => {
      const userItem = this.createUserItem(user);
      listContainer.appendChild(userItem);
    });
  }

  createUserItem(user) {
    const item = document.createElement('div');
    item.className = 'user-item';

    const userInfo = document.createElement('div');
    userInfo.className = 'user-info';

    const username = document.createElement('span');
    username.className = 'user-username';
    username.textContent = `@${user.username}`;

    const date = document.createElement('span');
    date.className = 'user-date';
    date.textContent = this.formatDate(user.blockedAt);

    userInfo.appendChild(username);
    userInfo.appendChild(date);

    const actions = document.createElement('div');
    actions.className = 'user-actions';

    const unblockBtn = document.createElement('button');
    unblockBtn.className = 'unblock-btn';
    unblockBtn.textContent = 'Unblock';
    unblockBtn.addEventListener('click', () => {
      this.unblockUser(user.username);
    });

    actions.appendChild(unblockBtn);

    item.appendChild(userInfo);
    item.appendChild(actions);

    return item;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }

  async unblockUser(username) {
    const normalizedUsername = username.toLowerCase();

    // Remove from list
    this.blockedUsers = this.blockedUsers.filter(
      u => u.username.toLowerCase() !== normalizedUsername
    );

    // Save to storage
    await chrome.storage.local.set({ blockedUsers: this.blockedUsers });

    // Re-render
    this.render();
  }

  async clearAllBlocks() {
    if (!confirm('Are you sure you want to unblock all users? This cannot be undone.')) {
      return;
    }

    this.blockedUsers = [];
    await chrome.storage.local.set({ blockedUsers: [] });
    this.render();
  }

  exportBlockList() {
    const dataStr = JSON.stringify({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      blockedUsers: this.blockedUsers
    }, null, 2);

    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `twitter-blocklist-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
  }

  async importBlockList(file) {
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.blockedUsers || !Array.isArray(data.blockedUsers)) {
        alert('Invalid block list file format');
        return;
      }

      // Merge with existing blocks (avoid duplicates)
      const existingUsernames = new Set(
        this.blockedUsers.map(u => u.username.toLowerCase())
      );

      const newUsers = data.blockedUsers.filter(
        u => !existingUsernames.has(u.username.toLowerCase())
      );

      if (newUsers.length === 0) {
        alert('No new users to import');
        return;
      }

      this.blockedUsers = [...this.blockedUsers, ...newUsers];
      await chrome.storage.local.set({ blockedUsers: this.blockedUsers });

      alert(`Successfully imported ${newUsers.length} new blocked users`);
      this.render();
    } catch (error) {
      alert('Error importing block list: ' + error.message);
    }
  }
}

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});
