// Background script

// Log installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Download List Extension Installed');
});

// Handle messages to get downloads
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === 'getDownloads') {
    chrome.downloads.search({}, (results) => {
      console.log(results);
      sendResponse({ downloads: results });
    });
    return true; // Indicate that the response will be sent asynchronously
  }
});

// Listen for new download creation
chrome.downloads.onCreated.addListener((downloadItem) => {
  console.log('Download started:', downloadItem);
  
  // Create a notification
  chrome.notifications.create({
    type: 'basic',
    title: 'Download Started',
    message: `Download started: ${downloadItem.filename}`,
    priority: 1
  });

  // Open the popup
  chrome.action.openPopup();
});

// Listen for changes in downloads
chrome.downloads.onChanged.addListener((delta) => {
  chrome.downloads.search({ id: delta.id }, (results) => {
    if (results.length) {
      const downloadItem = results[0];
      console.log('Download updated:', downloadItem);
    }
  });
});
