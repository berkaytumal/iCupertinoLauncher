import springBoard from "../springBoardEvents";

// Create web worker
const worker = new Worker('assets/scripts/libraries/iconizer.worker.js');

// Function to send message to web worker and wait for response
function processImages(imageUrls) {
    return new Promise((resolve, reject) => {
        // Listen for messages from the web worker
        worker.onmessage = function (e) {
            resolve(e.data);
        };

        // Send image URLs to the web worker
        worker.postMessage(imageUrls);
    });
}




async function loadImageFromUrl(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const blob = await response.blob();
        const imageBitmap = await createImageBitmap(blob);
        return imageBitmap;
    } catch (error) {
        console.error('Error loading image:', error);
        return null;
    }
}


const iconizer = (apps, force = false) => {
    return new Promise(async (resolve, reject) => {

        /* for (let app of apps) {
             const image = await loadImageFromUrl(app.icon);
             if (image) {
                 console.log("SUCESS")
             } else {
                 console.error("couldnt load", app.icon)
             }
         }*/

        try {
            if (force) {
                console.log("force", force)

            } else {
                console.log("force", force)
                const already = new Set(Object.keys(springBoard.getDB().iconpack))
                const newones = new Set(apps.map((n)=>n["packageName"]))
                const dif = newones.difference(already)
                console.log(dif)
                apps = apps.filter((n)=>{
                    return dif.has(n.packageName)
                }) 
                
                console.log("bitti")
              if(dif.length == 0){
                console.log("yeni öğe yokds jkfglsdjkghs")
                resolve({})
              }
            }
            const resizedImages = await processImages(apps);
            console.log('Resized images:', resizedImages);
            resolve(resizedImages);
            // Display resized images in the DOM or perform further actions
        } catch (error) {
            console.error('Error processing images:', error);
            reject(error)
        }
    });
};

export default iconizer;

/*  return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 60;
        canvas.height = 60;

        const img = new Image();
        img.onload = () => {
            // Draw the image on the canvas
            ctx.drawImage(img, 0, 0, 60, 60);

            // Get the new image as base64
            const newImage = canvas.toDataURL();
            resolve(newImage);
        };
        img.onerror = (err) => {
            reject(err);
        };
        
        // Set the image source to the input image (Base64 or URL)
        img.src = image;
    });*/