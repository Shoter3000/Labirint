// Function to preload images
function preloadImages(imagePaths) {
    const preloadedImages = [];
    imagePaths.forEach(src => {
        const img = new Image();
        img.src = src;
        preloadedImages.push(img);
    });
    return preloadedImages;
}

// List of image paths to preload
const imagePaths = [
    'img/sprite.png',
    'img/ethernet.png',
    'img/monitor.gif',
    'img/monitor.png',
    // Add more image paths as needed
];

// Preload images
const preloadedImages = preloadImages(imagePaths);

// Export preloaded images if needed
export { preloadedImages };