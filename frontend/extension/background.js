chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'downloadImage' && message.imageData) {
        chrome.downloads.download({
            url: message.imageData,
            filename: 'screenshot.png',
            saveAs: true
        }, (downloadId) => {
            if (chrome.runtime.lastError) {
                console.error("Download failed:", chrome.runtime.lastError);
                sendResponse({ success: false });
            } else {
                console.log("Screenshot saved with ID:", downloadId);
                sendResponse({ success: true });
            }
        });
        return true; // Indicates that sendResponse will be called asynchronously
    }
});
