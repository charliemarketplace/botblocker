# Changelog

All notable changes to the Quick Twitter Block extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-04

### Added
- Initial release of Quick Twitter Block extension
- One-click block/hide functionality for Twitter/X posts
- Subtle "B" button on every tweet (30% opacity, 100% on hover)
- Instant CSS-based hiding with smooth fade animations
- MutationObserver for handling infinite scroll and dynamic content
- Toast notifications with 5-second undo option
- Extension popup interface with:
  - Blocked users list with timestamps
  - Search functionality for blocked users
  - Export/Import block list as JSON
  - Settings for block mode and button visibility
  - Real-time statistics (blocked count, estimated hidden tweets)
- Local storage persistence for block lists
- Cross-tab synchronization of blocks
- Debounced DOM observer (100ms) for performance
- WeakSet-based tweet tracking to avoid reprocessing
- Support for both twitter.com and x.com domains
- Comprehensive documentation:
  - README with features and usage guide
  - INSTALL.md with detailed testing instructions
  - Troubleshooting guides
- Browser compatibility:
  - Chrome 88+
  - Edge 88+
  - Brave 1.20+
  - Firefox 109+ (temporary loading)

### Technical Details
- Manifest V3 compliance
- ES6+ JavaScript with classes and async/await
- Efficient CSS-only hiding (no DOM removal)
- Storage format with username, userId, timestamp, and method
- Configurable settings (block mode, button visibility)
- Professional UI with gradient purple theme

### Known Limitations
- Native Twitter blocking mode not yet implemented (CSS hide only)
- Retweets may show original author instead of retweeter
- Quoted tweets handling needs improvement
- Safari not supported (different extension system)
- Mobile browsers not supported

## [Unreleased]

### Planned for 1.1.0
- Native Twitter API blocking integration
- Keyboard shortcuts (Alt+B to block focused tweet)
- Improved retweet and quoted tweet detection

### Planned for 1.2.0
- Keyword-based blocking
- Regex pattern filtering
- Temporary blocks with auto-expire

### Planned for 2.0.0
- Cloud sync for block lists
- Statistics dashboard
- Whitelist/VIP functionality
- Thread-level blocking
- Follower-count based filtering

---

## Version History

- **1.0.0** (2026-01-04) - Initial release with core blocking functionality
