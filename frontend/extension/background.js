chrome.action.onClicked.addListener(async (tab) => {
    try {
        const screenshotUrl = await captureScreenshot(tab.windowId);
        console.log("Screenshot captured:", screenshotUrl);

        // If you have an existing function to handle the image, integrate it here
        uploadScreenshot(screenshotUrl);
    } catch (error) {
        console.error("Failed to capture screenshot:", error);
    }
});

async function captureScreenshot(windowId) {
    return new Promise((resolve, reject) => {
        chrome.tabs.captureVisibleTab(windowId, { format: "png" }, (dataUrl) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(dataUrl);
            }
        });
    });
}

function handleScreenshot(dataUrl) {
    // Example: Send the screenshot to your existing app or backend
    fetch("http://127.0.0.1:5000/upload_screenshot", {
        method: "POST",
        body: JSON.stringify({ image: dataUrl }),
        headers: { "Content-Type": "application/json" }
    })
        .then((response) => response.json())
        .then((data) => console.log("Upload successful:", data))
        .catch((error) => console.error("Upload failed:", error));
}

async function uploadScreenshot(dataUrl) {
    try {
        // Convert base64 data URL to a Blob
        const blob = await fetch(dataUrl).then(res => res.blob());

        const formData = new FormData();
        formData.append('screenshot', blob, 'cropped_screenshot.png');

        const response = await fetch("http://127.0.0.1:5000/upload_screenshot", {
            method: "POST",
            body: formData
        });
        const result = await response.json();
        console.log("Upload successful:", result);
    } catch (error) {
        console.error("Upload failed:", error);
    }
}