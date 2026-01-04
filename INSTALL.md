# Installation & Testing Guide

## Quick Start

### For Chrome/Chromium-based Browsers (Chrome, Edge, Brave, Opera)

1. **Navigate to Extensions Page**
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`
   - Opera: `opera://extensions/`

2. **Enable Developer Mode**
   - Look for "Developer mode" toggle in the top-right corner
   - Turn it ON

3. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to the `botblocker/extension` folder
   - Click "Select Folder" or "Open"

4. **Verify Installation**
   - You should see "Quick Twitter Block" appear in your extensions list
   - Status should show "Enabled"
   - Extension icon should appear in browser toolbar (puzzle piece icon -> pin it)

### For Firefox

1. **Open Debug Page**
   - Type `about:debugging` in address bar
   - Click "This Firefox" in left sidebar

2. **Load Temporary Extension**
   - Click "Load Temporary Add-on" button
   - Navigate to `botblocker/extension` folder
   - Select the `manifest.json` file
   - Click "Open"

3. **Important Note**
   - Firefox temporary extensions are removed when browser closes
   - For permanent installation, extension must be signed by Mozilla
   - See: https://extensionworkshop.com/documentation/publish/

## Testing the Extension

### Basic Functionality Test

1. **Open Twitter/X**
   - Go to https://twitter.com or https://x.com
   - Make sure you're logged in

2. **Verify Buttons Appear**
   - Scroll through your timeline
   - Hover over any tweet
   - You should see a small gray "B" button in the top-right of each tweet
   - Button should turn red on hover

3. **Test Blocking**
   - Click the "B" button on any tweet
   - Tweet should fade out and disappear (300ms animation)
   - Toast notification should appear bottom-right: "Hidden @username"
   - Toast should have an "Undo" button
   - All other tweets from same user should also disappear

4. **Test Undo**
   - Click "B" button on a tweet
   - Quickly click "Undo" in the toast (within 5 seconds)
   - User should be unblocked
   - Their tweets should reappear

5. **Test Extension Popup**
   - Click the extension icon in toolbar
   - Popup should open showing:
     - Blocked count
     - Settings (Block Mode, Button Visibility)
     - Blocked users list
     - Export/Import/Clear All buttons

6. **Test Unblocking**
   - In popup, find a blocked user
   - Click "Unblock" button
   - User's tweets should reappear on Twitter
   - User should disappear from blocked list

### Advanced Testing

#### Infinite Scroll Test
1. Scroll down your Twitter timeline
2. New tweets load dynamically
3. Verify "B" buttons appear on all new tweets
4. Block a user and scroll more
5. Verify their future tweets don't appear

#### Multi-Tab Sync Test
1. Open Twitter in two tabs
2. Block a user in Tab 1
3. Switch to Tab 2 and refresh
4. Verify that user's tweets are hidden in Tab 2

#### Export/Import Test
1. Block several users (3-5)
2. Open extension popup
3. Click "Export" button
4. Save JSON file
5. Click "Clear All" and confirm
6. Click "Import" button
7. Select the saved JSON file
8. Verify all users are restored

#### Search Test
1. Block multiple users with different names
2. Open extension popup
3. Use search box to filter users
4. Verify search works correctly

## Troubleshooting

### Buttons Not Appearing

**Problem**: No "B" buttons visible on tweets

**Solutions**:
1. **Refresh the page** (Ctrl+R or Cmd+R)
2. **Check if extension is enabled**
   - Go to `chrome://extensions/`
   - Verify "Quick Twitter Block" is ON
3. **Check for JavaScript errors**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for red error messages
4. **Reload the extension**
   - Go to `chrome://extensions/`
   - Click reload icon on Quick Twitter Block
   - Refresh Twitter page

### Extension Not Loading

**Problem**: Extension doesn't appear in extensions list

**Solutions**:
1. **Verify folder structure**
   ```
   extension/
   ├── manifest.json  (must be present!)
   ├── content.js
   ├── content.css
   ├── popup.html
   ├── popup.js
   └── popup.css
   ```

2. **Check manifest.json syntax**
   - Open `extension/manifest.json`
   - Verify it's valid JSON (use a validator)
   - Look for missing commas, brackets

3. **Check browser compatibility**
   - Chrome/Edge/Brave: Version 88+
   - Firefox: Version 109+

### Tweets Not Hiding

**Problem**: Clicking "B" button doesn't hide tweets

**Solutions**:
1. **Check browser console for errors** (F12 → Console)
2. **Verify storage permissions**
   - Extension should have `storage` permission
   - Check in manifest.json
3. **Clear extension data**
   - Go to `chrome://extensions/`
   - Click "Details" on Quick Twitter Block
   - Scroll down, click "Clear storage and reset"
   - Reload extension

### Popup Not Opening

**Problem**: Clicking extension icon does nothing

**Solutions**:
1. **Check if popup.html exists** in extension folder
2. **Look for console errors**
   - Right-click extension icon
   - Select "Inspect popup"
   - Check Console for errors
3. **Verify manifest.json has correct popup path**
   ```json
   "action": {
     "default_popup": "popup.html"
   }
   ```

### Twitter/X Not Recognized

**Problem**: Extension doesn't work on Twitter

**Solutions**:
1. **Check URL**
   - Extension works on: `twitter.com/*` and `x.com/*`
   - Does NOT work on: `mobile.twitter.com`, `tweetdeck.twitter.com`
2. **Verify host permissions**
   - Go to `chrome://extensions/`
   - Click "Details" on Quick Twitter Block
   - Scroll to "Site access"
   - Should show "On specific sites" with twitter.com and x.com

## Performance Testing

### Check Resource Usage

1. **Open Chrome Task Manager**
   - Chrome menu → More tools → Task Manager
   - Or: Shift+Esc

2. **Find Extension Process**
   - Look for "Extension: Quick Twitter Block"
   - Check memory usage (should be < 50MB)
   - Check CPU usage (should be ~0% when idle)

### Profile Performance

1. **Open DevTools** (F12)
2. **Go to Performance Tab**
3. **Record profile** while scrolling Twitter
4. **Check for issues**:
   - No long tasks (>50ms)
   - No excessive reflows
   - No memory leaks

## Development Testing

### Testing Code Changes

1. Make changes to extension files
2. Go to `chrome://extensions/`
3. Click reload icon (⟳) on extension
4. Refresh Twitter tab (Ctrl+R)
5. Test the changed functionality

### Debugging

**Content Script Debugging**:
1. Open Twitter/X
2. Press F12 (DevTools)
3. Go to Console tab
4. Check for errors from content.js
5. Use `console.log()` to debug

**Popup Debugging**:
1. Click extension icon
2. Right-click on popup
3. Select "Inspect"
4. DevTools opens for popup
5. Check Console for errors

**Storage Debugging**:
```javascript
// In browser console
chrome.storage.local.get(['blockedUsers', 'config'], (data) => {
  console.log('Blocked users:', data.blockedUsers);
  console.log('Config:', data.config);
});
```

## Clean Installation

To completely reset the extension:

1. **Remove Extension**
   - Go to `chrome://extensions/`
   - Click "Remove" on Quick Twitter Block
   - Confirm removal

2. **Clear Extension Data** (optional)
   ```javascript
   // In browser console on any page
   chrome.storage.local.clear(() => {
     console.log('Extension data cleared');
   });
   ```

3. **Reinstall**
   - Follow installation steps above
   - Extension starts fresh with no data

## Browser Console Commands

Useful commands for testing:

```javascript
// View blocked users
chrome.storage.local.get('blockedUsers', (d) => console.table(d.blockedUsers));

// View config
chrome.storage.local.get('config', (d) => console.log(d.config));

// Manually add a blocked user
chrome.storage.local.get('blockedUsers', (data) => {
  const list = data.blockedUsers || [];
  list.push({
    username: 'testuser',
    userId: '123',
    blockedAt: new Date().toISOString(),
    method: 'hide'
  });
  chrome.storage.local.set({ blockedUsers: list });
});

// Clear all blocks
chrome.storage.local.set({ blockedUsers: [] });
```

## Known Limitations

1. **Twitter DOM Changes**
   - Twitter frequently updates their HTML structure
   - Extension may break after Twitter updates
   - Check for updates if buttons stop appearing

2. **Mobile Twitter**
   - Extension doesn't work on mobile browsers
   - Desktop browsers only

3. **TweetDeck**
   - Not currently supported
   - May add support in future

4. **Performance**
   - Very large block lists (10,000+ users) may slow down
   - Consider exporting and clearing old blocks

## Getting Help

If you encounter issues:

1. **Check this guide first**
2. **Look for similar issues**: https://github.com/charliemarketplace/botblocker/issues
3. **Open a new issue**: Include:
   - Browser name and version
   - Operating system
   - Steps to reproduce
   - Console errors (if any)
   - Screenshots (if applicable)

## Success Criteria

Extension is working correctly if:

- ✅ "B" buttons appear on all tweets
- ✅ Clicking "B" hides the tweet immediately
- ✅ All tweets from blocked user disappear
- ✅ Toast notification appears with undo option
- ✅ Popup shows blocked users list
- ✅ Unblock functionality works
- ✅ Export/Import works
- ✅ Blocks persist across page refreshes
- ✅ Blocks sync across multiple tabs
- ✅ New tweets from blocked users don't appear

Happy blocking! 🚫
