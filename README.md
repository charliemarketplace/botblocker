# Quick Twitter Block - Browser Extension

A Chrome/Firefox extension that adds one-click block/hide buttons to Twitter posts, allowing users to instantly filter out unwanted accounts without navigating through Twitter's native block flow.

## Features

### 🚀 Core Functionality
- **One-Click Blocking**: Small "B" button appears on every tweet for instant blocking
- **Instant Hide**: Tweets disappear immediately with smooth animations
- **CSS-Based Hiding**: Fast, reversible blocking that doesn't require API calls
- **Persistent Storage**: Block list syncs across all Twitter/X tabs
- **Infinite Scroll Support**: Automatically handles dynamically loaded tweets

### 🎨 User Interface
- **Subtle Design**: Semi-transparent button (30% opacity) that becomes fully visible on hover
- **Smooth Animations**: 200ms fade transitions and 300ms hide animations
- **Toast Notifications**: Brief notifications with undo option (5 seconds)
- **Management Panel**: Full-featured popup for managing blocked users

### ⚙️ Settings & Management
- **Block Mode Toggle**: Choose between CSS hide or native Twitter block
- **Search & Filter**: Search through blocked users
- **Export/Import**: Backup and restore your block list as JSON
- **Bulk Operations**: Clear all blocks with one click
- **Real-Time Stats**: See how many users blocked and tweets hidden

## Installation

### Chrome/Edge/Brave

1. **Download the Extension**
   ```bash
   git clone https://github.com/yourusername/botblocker.git
   cd botblocker
   ```

2. **Load Extension in Developer Mode**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `extension` folder from this repository

3. **Verify Installation**
   - You should see "Quick Twitter Block" in your extensions list
   - The extension icon should appear in your browser toolbar

### Firefox

1. **Download the Extension** (same as above)

2. **Load Temporary Extension**
   - Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file from the `extension` folder

3. **For Permanent Installation**
   - Firefox requires signing for permanent installation
   - Follow Mozilla's [Add-on Distribution Guide](https://extensionworkshop.com/documentation/publish/)

## Usage Guide

### Blocking a User

1. **Navigate to Twitter/X** (twitter.com or x.com)
2. **Hover over any tweet** - A small "B" button appears in the top-right corner
3. **Click the "B" button** - The tweet instantly fades out
4. **Undo if needed** - Click "Undo" in the toast notification (5-second window)

All tweets from that user will be hidden from your timeline, both existing and future tweets.

### Managing Blocked Users

1. **Click the extension icon** in your browser toolbar
2. **View blocked users** - See complete list with block timestamps
3. **Search users** - Use the search box to filter the list
4. **Unblock users** - Click "Unblock" next to any user to restore their tweets

### Exporting/Importing Block Lists

**Export:**
1. Open extension popup
2. Click "Export" button
3. Save JSON file to your computer

**Import:**
1. Open extension popup
2. Click "Import" button
3. Select a previously exported JSON file
4. New blocks will merge with existing ones

### Settings

**Block Mode:**
- **CSS Hide (Default)**: Instantly hides tweets using CSS, fully reversible, no API calls
- **Native Twitter Block**: Uses Twitter's official block API (future feature)

**Button Visibility:**
- **Show on Hover**: Button appears only when hovering over tweets (default)
- **Always Show**: Button is always visible on all tweets

## Technical Details

### Architecture

```
extension/
├── manifest.json          # Extension configuration (Manifest V3)
├── content.js            # Main content script (DOM manipulation)
├── content.css           # Button and tweet styling
├── popup.html            # Extension popup interface
├── popup.js              # Popup logic and data management
├── popup.css             # Popup styling
└── icons/                # Extension icons (16x16, 48x48, 128x128)
```

### Key Technologies

- **Manifest V3**: Modern Chrome extension standard
- **MutationObserver API**: Detects dynamically loaded tweets
- **Chrome Storage API**: Persists block list across sessions
- **ES6+ JavaScript**: Modern syntax with classes and async/await

### Performance Optimizations

- **Debounced Observer**: 100ms debounce to prevent excessive DOM scans
- **WeakSet Tracking**: Efficient tweet processing tracking
- **Event Delegation**: Minimal event listeners for better performance
- **CSS-Only Hiding**: No DOM removal, just `display: none`

### DOM Selectors

The extension targets Twitter's current DOM structure:

```javascript
// Tweet container
const tweetSelector = 'article[data-testid="tweet"]';

// Username extraction
const usernameLinks = 'a[href^="/"]';

// Author section for button placement
const authorSection = '[data-testid="User-Name"]';
```

**Note**: Twitter frequently updates their DOM structure. If the extension stops working, these selectors may need updating.

### Storage Format

```json
{
  "blockedUsers": [
    {
      "username": "example_user",
      "userId": "123456789",
      "blockedAt": "2026-01-04T10:30:00Z",
      "method": "hide"
    }
  ],
  "config": {
    "blockMode": "hide",
    "buttonVisibility": "hover"
  }
}
```

## Permissions Explained

The extension requires these permissions:

- **`storage`**: Save and sync your block list
- **`activeTab`**: Access Twitter/X pages to inject buttons
- **`host_permissions`** (twitter.com, x.com): Run on Twitter/X domains only

**Privacy**: This extension does NOT:
- Send data to external servers
- Track your browsing
- Access other websites
- Use analytics or telemetry

All data is stored locally in your browser.

## Troubleshooting

### Buttons Not Appearing

1. **Refresh the page** - Twitter's dynamic loading sometimes requires a refresh
2. **Check permissions** - Ensure the extension has access to Twitter/X
3. **Check console** - Open DevTools (F12) and look for errors
4. **Reload extension** - Go to `chrome://extensions/` and click reload

### Tweets Not Hiding

1. **Check block list** - Open popup to verify user is actually blocked
2. **Clear and re-block** - Try unblocking and blocking again
3. **Check storage** - Extension might have hit storage limits (unlikely)

### Import/Export Issues

1. **Verify JSON format** - Ensure exported file is valid JSON
2. **Check file size** - Very large lists (>10,000 users) may be slow
3. **Browser compatibility** - Some features may differ between browsers

## Development

### Building from Source

```bash
# Clone repository
git clone https://github.com/yourusername/botblocker.git
cd botblocker

# Extension files are in the extension/ directory
cd extension

# No build process needed - load directly in browser
```

### Testing

1. Make changes to source files
2. Go to `chrome://extensions/`
3. Click reload icon on the extension
4. Refresh Twitter/X tab to see changes

### Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

### Planned Features

- [ ] **Native Twitter Block**: Implement actual Twitter API blocking
- [ ] **Keyword Blocking**: Block tweets containing specific words/phrases
- [ ] **Regex Filtering**: Advanced pattern-based blocking
- [ ] **Temporary Blocks**: Auto-expire blocks after X days
- [ ] **Thread Blocking**: Hide entire threads from specific users
- [ ] **Cloud Sync**: Sync block lists across devices
- [ ] **Statistics Dashboard**: Analytics on blocked accounts
- [ ] **Whitelist/VIP List**: Never hide specified accounts
- [ ] **Follower-Based Blocking**: Block by follower count or verification status
- [ ] **Keyboard Shortcuts**: Alt+B to block focused tweet

### Known Issues

- Twitter DOM structure changes may break selectors
- Retweets may show original author instead of retweeter
- Quoted tweets handling needs improvement
- Native blocking mode not yet implemented

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 88+     | ✅ Full support |
| Edge    | 88+     | ✅ Full support |
| Brave   | 1.20+   | ✅ Full support |
| Firefox | 109+    | ⚠️ Requires temporary loading |
| Safari  | —       | ❌ Not supported (different extension system) |

## License

MIT License - See [LICENSE](LICENSE) file for details

## Support

- **Issues**: [GitHub Issues](https://github.com/charliemarketplace/botblocker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/charliemarketplace/botblocker/discussions)

## Acknowledgments

- Inspired by various Twitter enhancement tools
- Built with ❤️ for a better Twitter experience
- Thanks to all contributors and users

---

**Disclaimer**: This extension is not affiliated with, endorsed by, or connected to Twitter, Inc. or X Corp. Use at your own discretion. 
