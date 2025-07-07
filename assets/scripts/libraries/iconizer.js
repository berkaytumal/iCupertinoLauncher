import { getDB, setDB } from './indexedDBHelper.js';

// Create web worker
const worker = new Worker('assets/scripts/libraries/iconizer.worker.js');
async function initializeIcons() {
    const db = await getDB();
    window.icons = { "dsf": "dsklfgşnsa" };

    if (db.iconpack) {
        for (const [packageName, blob] of Object.entries(db.iconpack)) {
            window.icons[packageName] = URL.createObjectURL(blob);
        }
    }
}
// Function to send message to web worker and wait for response
function processImages(imageUrls) {
    return new Promise((resolve, reject) => {
        // Listen for messages from the web worker
        worker.onmessage = function (e) {
            resolve(e.data);
        };

        // Send image URLs to the web worker
        worker.postMessage([imageUrls, devicePixelRatio]);
    });
}

const iconizer = (apps, force = false) => {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await getDB();

            if (!force) {
                console.log("force", force);
                const already = new Set(Object.keys(db.iconpack));
                const newones = new Set(apps.map((n) => n.packageName));
                const dif = new Set([...newones].filter(x => !already.has(x)));

                console.log(dif);

                apps = apps.filter((n) => {
                    return dif.has(n.packageName);
                });

                console.log("bitti");
                if (dif.size === 0) {
                    console.log("yeni öğe yok");
                    resolve({});
                    return;
                }
            }

            const resizedImages = await processImages(apps);
            console.log('Resized images:', resizedImages);

            const iconpack = db.iconpack;
            Object.keys(resizedImages).forEach(packageName => {
                iconpack[packageName] = resizedImages[packageName];
            });

            db.iconpack = iconpack;
            await setDB(db);
            await initializeIcons();  // Initialize icons after setting DB
            resolve(resizedImages);
        } catch (error) {
            console.error('Error processing images:', error);
            reject(error);
        }
    });
};

export default iconizer;
