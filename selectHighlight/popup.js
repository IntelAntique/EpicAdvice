

document.addEventListener("DOMContentLoaded", function() {
    console.log('Popup loaded!');
    function getSelectionText() {
        let text = "";

        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }

        return text;
    }
    function click() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const tabId = tabs[0].id;

            // Check if chrome.scripting is available (Manifest V3)
            if (chrome.scripting) {
                chrome.scripting.executeScript({
                    target: {tabId: tabId},
                    function: getSelectionText
                }, handleResult);
            } else {
                console.error("Unable to execute script in the active tab.");
            }
        });
    }

    function handleResult(results) {
        const text = document.getElementById("result");
        if (text) {
            const para = document.createElement("p");
            para.innerText = results[0]?.result || results[0] || "No text selected";
            text.appendChild(para);
        } else {
            console.error("Element with ID 'result' not found.");
        }
    }

    document.getElementById("scanButton").addEventListener("click", click);
});