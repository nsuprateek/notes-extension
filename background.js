let messages = [];

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.get({ messages: [] }, function (result) {
    messages = result.messages;
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'addMessage') {
    addMessage(request.message, request.timestamp, request.url);
  } else if (request.action === 'getMessages') {
    sendResponse({ messages });
  } else if (request.action === 'clearMessages') {
    clearMessages();
  }
});

function addMessage(message, timestamp, url) {
  messages.push({ message, timestamp, url });
  chrome.storage.local.set({ messages });
}

function clearMessages() {
  messages = [];
  chrome.storage.local.set({ messages });
}
