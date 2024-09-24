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


Testing notes (25/09/2024)

### DDAS testing notes:

hawamahal network ip: http://172.18.27.190/ (Windows)

my laptop network ip: http://10.1.92.183/ (Ubuntu)

**Test 1: Transferring file from my laptop to hawamahal**

filename: training.zip

Description: A dataset of images downloaded from kaggle

total data transferred: 3797.7 MB (3.8 GB)

total time taken: 3 mins and 50 seconds = 230 seconds

Intranet transfer speed = 3797.7 MB/ 230 s = 16.5 MBps = 132 Mbps


**Test 2: Transferring files from hawamahal to my laptop**

filename: flutter_windows_3.24.3-stable.zip

Description: Flutter sdk

total data transferred: 1032.4 MB (1.0 GB)

total time taken: 51 seconds

Intranet transfer speed = 1032.4 MB / 51 s =   20.2 MBps = 162 Mbps
