
function resizeImage(imageBitmap, scale = 1) {
    const width = scale * 60
    const height = width
    const offscreenCanvas = new OffscreenCanvas(width, height);
    const ctx = offscreenCanvas.getContext('2d');
    ctx.drawImage(imageBitmap, 0, 0, width, height);
    return offscreenCanvas.convertToBlob().then(blob => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    });
  }

// Listen for messages from the main thread
self.onmessage = async function (e) {
    const apps = e.data;
    const resizedImages = {};
    for (let i = 0; i < apps.length; i++) {
        try {
            const response = await fetch(apps[i]["icon"]);
            const blob = await response.blob();
            const imageBitmap = await createImageBitmap(blob);
            const resizedImage = await resizeImage(imageBitmap);
            resizedImages[apps[i].packageName] = resizedImage;

            // Log percentage completion
            const progress = ((i + 1) / apps.length) * 100;
            console.log(`Image ${i + 1} processed of ${apps.length}. Progress: ${progress.toFixed(2)}%`);
        } catch (error) {
            console.error('Error processing image:', error);
            return Promise.reject(error);
        }
    }

    // Send resized images back to the main thread
    postMessage(resizedImages);
};
