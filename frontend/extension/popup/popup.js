document.getElementById("capture-button").addEventListener("click", async () => {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const screenshotUrl = await captureScreenshot(tab.windowId);
        document.getElementById("screenshot").src = screenshotUrl;

        await uploadScreenshot(screenshotUrl,tab.id);
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

async function uploadScreenshot(dataUrl,tabId) {
    try {
        const blob = await fetch(dataUrl).then(res => res.blob());

        const formData = new FormData();
        formData.append('screenshot', blob, 'cropped_screenshot.png');

        const response = await fetch("http://127.0.0.1:5000/upload_screenshot", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        console.log("Upload successful:", result);

        chrome.tabs.sendMessage(tabId, {
            type: "chatbot_response",
            response: result.response 
        });
        // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        //     if (tabs.length > 0) {
        //         chrome.tabs.sendMessage(tabs[0].id, {
        //             type: "chatbot_response",
        //             response: result.response 
        //         });
        //     }
        // });
        
    } catch (error) {
        console.error("Upload failed:", error);
    }
}