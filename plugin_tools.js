function getText(file) {
    var result = ""
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4 && (rawFile.status === 200 || rawFile.status == 0)) {
            result = rawFile.responseText;
        }
    }
    rawFile.send(null);
    return result;
}

function onActiveTab(handler) {
    chrome.tabs.getSelected(null, handler);
}

function runOnTab(tabId, runInfo, handler) {
  chrome.tabs.executeScript(tabId, runInfo, handler);
}

function callInjectedCode(tabId, c, handler) {
    runOnTab(tabId, {code: c}, handler);
}