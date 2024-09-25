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
  
   // First API call to get checksum
   fetchChecksum(downloadItem)
   .then((checksum) => {
     console.log('Checksum fetched:', checksum);

     // Second API call to get the local URL using the checksum
     return fetchLocalUrl(checksum);
   })

   .then((localUrl) => {
     console.log('Local URL fetched:', localUrl);


  // Create a notification
  chrome.notifications.create({
    type: 'basic',
    title: 'Download Started',
    message: `Download started: ${downloadItem.filename}`,
    priority: 1
  });


  // Open the popup
  chrome.action.openPopup();
 })

  .catch((error) => {
  console.error('Error during API calls:', error);
  });
});


// Function to fetch the checksum from an API
function fetchChecksum(downloadItem) {
  return new Promise((resolve, reject) => {
    const apiUrl = 'https://localhost:serverport/checksum'; // Replace with your actual checksum API
    const bodyData = {
      filename: downloadItem.filename,
      id: downloadItem.id
    };

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.checksum) {
          resolve(data.checksum);
        } else {
          reject('Checksum not found');
        }
      })
      .catch((error) => reject(error));
  });
}

// Function to fetch the local URL using the checksum
function fetchLocalUrl(checksum) {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://localhost:serverport/local-url/${checksum}`; // Replace with your actual URL API

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.localUrl) {
          resolve(data.localUrl);
        } else {
          reject('Local URL not found');
        }
      })
      .catch((error) => reject(error));
  });
}



// Listen for changes in downloads
chrome.downloads.onChanged.addListener((delta) => {
  chrome.downloads.search({ id: delta.id }, (results) => {
    if (results.length) {
      const downloadItem = results[0];
      console.log('Download updated:', downloadItem);
    }
  });
});
