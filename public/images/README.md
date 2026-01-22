# Dashboard Screenshots

The landing page now uses **online images from Unsplash** instead of local files.

## Current Image Sources

All dashboard screenshots are loaded from Unsplash (https://unsplash.com), a free stock photo service. The images are automatically optimized and cached.

## Image URLs Used

The landing page uses the following Unsplash image URLs:

1. **Hero Dashboard** - Analytics/dashboard overview image
2. **Analytics Dashboard** - Revenue analytics and charts
3. **Customer Management** - Customer management interface
4. **Hotspot Management** - Network/hotspot management
5. **Package Management** - Package listing interface
6. **Payment Analytics** - Payment and transaction analytics
7. **Device Management** - Device monitoring interface

## Customizing Images

If you want to use your own dashboard screenshots instead:

1. Take screenshots of your dashboard pages
2. Upload them to a hosting service (e.g., Cloudinary, Imgur, or your own CDN)
3. Update the image URLs in `src/pages/LandingPage.tsx`
4. Replace the Unsplash URLs with your image URLs

## Fallback Behavior

If an image fails to load, the landing page will display a placeholder with an icon and message. This ensures the page remains functional even if images are unavailable.

## Image Guidelines (if using custom images)

- **Format**: PNG or JPG
- **Aspect Ratio**: 16:9 (1920x1080) recommended
- **File Size**: Optimize images for web (under 500KB each recommended)
- **Quality**: High quality screenshots that showcase the dashboard clearly
