document.getElementById("capture-button").addEventListener("click", async () => {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const screenshotUrl = await captureScreenshot(tab.windowId);
        document.getElementById("screenshot").src = screenshotUrl;

        // Optionally, upload to backend if needed
        await uploadScreenshot(screenshotUrl);
    } catch (error) {
        console.error("Error capturing screenshot:", error);
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

async function uploadScreenshot(dataUrl) {
    try {
        // Convert base64 data URL to a Blob
        const blob = await fetch(dataUrl).then(res => res.blob());

        // Create FormData and append the screenshot file
        const formData = new FormData();
        formData.append('screenshot', blob, 'cropped_screenshot.png');

        // Send the FormData to the server
        const response = await fetch("http://127.0.0.1:5000/upload_screenshot", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        console.log("Upload successful:", result);
    } catch (error) {
        console.error("Upload failed:", error);
    }
}