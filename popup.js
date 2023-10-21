const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const clearMessagesButton = document.getElementById('clear-messages'); // Get the button element

// Function to scroll to the bottom of the chat box
function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to add a message to the chat box
function addMessageToChat(message, timestamp, url) {
  chatBox.innerHTML += `<p><strong>${timestamp} (${url}):</strong> ${message}</p>`;
  messageInput.value = '';
  scrollToBottom();
}

// Event listener for typing and sending a message
messageInput.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    const message = messageInput.value;
    if (message) {
      const timestamp = new Date().toLocaleTimeString();
    //   addMessageToChat(message, timestamp, ''); // Displaying an empty URL for now

      // Capture the active tab's URL
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const url = tabs[0] ? tabs[0].url : 'N/A';
        addMessageToChat(message, timestamp, url);

        // Send the message, timestamp, and URL to the service worker to store
        chrome.runtime.sendMessage({ action: 'addMessage', message, timestamp, url });
      });
    }
  }
});

// Event listener for clicking the "Clear Messages" button
clearMessagesButton.addEventListener('click', function () {
    clearMessages();
  });
  
  // Function to clear all messages
  function clearMessages() {
    chatBox.innerHTML = ''; // Clear the chat box
    chrome.runtime.sendMessage({ action: 'clearMessages' }); // Notify the background script to clear messages
  }

// Retrieve and display messages from the service worker when the extension is opened
chrome.runtime.sendMessage({ action: 'getMessages' }, function (response) {
  const storedMessages = response.messages;
  storedMessages.forEach(({ message, timestamp, url }) => {
    addMessageToChat(message, timestamp, url);
  });
});
