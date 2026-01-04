# Extension Icons

This folder should contain the following icons for the browser extension:

- `icon16.png` - 16x16 pixels (toolbar icon)
- `icon48.png` - 48x48 pixels (extension management)
- `icon128.png` - 128x128 pixels (Chrome Web Store)

## Creating Icons

You can create these icons using:

1. **Design tools**: Figma, Adobe Illustrator, Sketch
2. **Icon generators**: Use online tools or convert SVG to PNG
3. **Simple approach**: Create a simple icon with a "B" letter on a colored background

### Recommended Design

- Background: Gradient purple/blue (#667eea to #764ba2)
- Icon: White "B" letter or block symbol
- Style: Modern, minimal, rounded corners

### Quick Creation

Use an online PNG generator or create using ImageMagick:

```bash
# Install ImageMagick
sudo apt-get install imagemagick

# Create simple icon (requires proper ImageMagick setup)
convert -size 128x128 xc:#667eea -pointsize 80 -fill white -gravity center -annotate +0+0 "B" icon128.png
convert icon128.png -resize 48x48 icon48.png
convert icon128.png -resize 16x16 icon16.png
```

For now, the extension will work without icons, but they're recommended for a professional appearance.
