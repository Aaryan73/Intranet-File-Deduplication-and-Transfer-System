## System Architecture

### **Browser Extension (JavaScript)**

- Role: Monitors downloads. For files larger than 10MB, it extracts the file size and calculates a partial checksum (first 8MB).
- Workflow: Sends the file size and partial checksum to the central server via API to check if the file is already downloaded by another user.
- Technology:
  - JavaScript for browser integration.
  - Web APIs to detect and interact with downloads.
  - XHR or Fetch API to send requests to the central server.

### **Central Server (Python + FastAPI)**

- Role: Stores metadata (file size, partial checksums) and checks if a file has already been downloaded by another user.
- Workflow:
  - Receives API requests from the browser extension.
  - Searches its database for matching file metadata (size + checksum).
  - If a match is found, returns the details of the user who has the file.
- Technology:
  - Python with FastAPI for building a lightweight, fast API server.
  - MongoDB for storing partial checksum values, file sizes and user's data.

### **User File Server (Python)**

- Role: Runs a simple web server on each user's machine, allowing file transfers within the local network.
- Workflow:
  - If another user needs the file, the web server shares the file over HTTP.
- Technology:
  - Python with http.server or FastAPI to create a basic HTTP file server.

### Preview

![prototype](working-images/prototype.gif)
