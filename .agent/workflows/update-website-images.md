---
description: How to manually update the background images on the website
---

# How to Update Website Background Images

You can easily change the images on your website by replacing the image files in the `public/assets/` folder. You do not need to change any code if you keep the filenames the same.

## Image Locations

The website looks for images with these specific names in your `public/assets/` folder:

| Page | Section | File Name |
|------|---------|-----------|
| **Homepage** | Hotel Slide | `hotel-bg.jpg` |
| **Homepage** | Spa Slide | `spa-bg.jpg` |
| **Hotel Page** | Main Hero | `hotel-hero-bg.jpg` |
| **Spa Page** | Main Hero | `spa-hero-bg.jpg` |

## How to Replace an Image

1.  **Prepare your new image**:
    *   Make sure it is a high-quality `.jpg` or `.jpeg` file.
    *   It is best if the image is in landscape orientation (wider than it is tall).

2.  **Rename your new image**:
    *   Rename your new file to match the target file name exactly (e.g., `hotel-bg.jpg`).

3.  **Replace the file**:
    *   Copy your new file into the `d:\test\public\assets\` folder.
    *   When asked, choose to **overwrite** or **replace** the existing file.

4.  **Refresh**:
    *   Reload your website browser. You should see the new image immediately!

## Tips
*   **Aspect Ratio**: For best results, use "landscape" images (horizontal) since these are full-screen backgrounds.
*   **File Size**: Try to keep image sizes reasonable (under 2MB) so the website loads quickly.
