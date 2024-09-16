import React from 'react';
import { useState } from 'react';
// Define the type for the file transfer status
interface FileTransferStatus {
  bytesReceived: number;
  endTime: string;
  fileSize: number;
  filename: string;
  id: number;
  incognito: boolean;
  mime: string;
  paused: boolean;
  startTime: string;
  state: string;
  totalBytes: number;
  sender: string;
  receiver: string;
}


const fileTransferData: FileTransferStatus[] = [
  {
    bytesReceived: 40554,
    endTime: "2024-09-15T07:38:27.975Z",
    fileSize: 40554,
    filename: "colorful-design-with-spiral-design_188544-9588.avif",
    id: 1,
    incognito: false,
    mime: "image/avif",
    paused: false,
    startTime: "2024-09-15T07:38:25.967Z",
    state: "complete",
    totalBytes: 40554,
    sender: "ojf",
    receiver: "asfs"
  },
  {
    bytesReceived: 102400,
    endTime: "2024-09-15T08:15:12.456Z",
    fileSize: 102400,
    filename: "sunset-over-mountains_123456-7890.jpg",
    id: 2,
    incognito: true,
    mime: "image/jpeg",
    paused: false,
    startTime: "2024-09-15T08:14:30.123Z",
    state: "complete",
    totalBytes: 102400,
    sender: "xyz",
    receiver: "abc"
  },
  {
    bytesReceived: 51200,
    endTime: "2024-09-15T09:25:35.678Z",
    fileSize: 51200,
    filename: "document-with-notes_876543-2101.pdf",
    id: 3,
    incognito: false,
    mime: "application/pdf",
    paused: true,
    startTime: "2024-09-15T09:20:10.987Z",
    state: "paused",
    totalBytes: 51200,
    sender: "user1",
    receiver: "user2"
  },
  {
    bytesReceived: 20480,
    endTime: "2024-09-15T10:35:20.345Z",
    fileSize: 20480,
    filename: "simple-icon_543210-9876.png",
    id: 4,
    incognito: false,
    mime: "image/png",
    paused: false,
    startTime: "2024-09-15T10:30:15.789Z",
    state: "complete",
    totalBytes: 20480,
    sender: "jkl",
    receiver: "mno"
  },
  {
    bytesReceived: 81920,
    endTime: "2024-09-15T11:45:50.123Z",
    fileSize: 81920,
    filename: "high-resolution-background_567890-1234.bmp",
    id: 5,
    incognito: true,
    mime: "image/bmp",
    paused: false,
    startTime: "2024-09-15T11:40:00.456Z",
    state: "complete",
    totalBytes: 81920,
    sender: "pqr",
    receiver: "stu"
  },
  {
    bytesReceived: 4096,
    endTime: "2024-09-15T12:10:05.678Z",
    fileSize: 4096,
    filename: "tiny-file_234567-8901.txt",
    id: 6,
    incognito: false,
    mime: "text/plain",
    paused: false,
    startTime: "2024-09-15T12:05:00.123Z",
    state: "complete",
    totalBytes: 4096,
    sender: "abc",
    receiver: "xyz"
  },
  {
    bytesReceived: 2048,
    endTime: "2024-09-15T13:00:25.456Z",
    fileSize: 2048,
    filename: "small-data_345678-9012.csv",
    id: 7,
    incognito: true,
    mime: "text/csv",
    paused: false,
    startTime: "2024-09-15T12:55:00.789Z",
    state: "complete",
    totalBytes: 2048,
    sender: "def",
    receiver: "ghi"
  },
  {
    bytesReceived: 16384,
    endTime: "2024-09-15T14:25:40.678Z",
    fileSize: 16384,
    filename: "medium-file_456789-0123.docx",
    id: 8,
    incognito: false,
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    paused: true,
    startTime: "2024-09-15T14:20:10.123Z",
    state: "paused",
    totalBytes: 16384,
    sender: "jkl",
    receiver: "mno"
  },
  {
    bytesReceived: 327680,
    endTime: "2024-09-15T15:40:50.345Z",
    fileSize: 327680,
    filename: "large-archive_567890-1234.zip",
    id: 9,
    incognito: false,
    mime: "application/zip",
    paused: false,
    startTime: "2024-09-15T15:30:20.456Z",
    state: "complete",
    totalBytes: 327680,
    sender: "stu",
    receiver: "uvw"
  },
  {
    bytesReceived: 65536,
    endTime: "2024-09-15T16:10:15.789Z",
    fileSize: 65536,
    filename: "video-file_678901-2345.mp4",
    id: 10,
    incognito: true,
    mime: "video/mp4",
    paused: false,
    startTime: "2024-09-15T16:00:05.678Z",
    state: "complete",
    totalBytes: 65536,
    sender: "opq",
    receiver: "rst"
  },
  {
    bytesReceived: 1024,
    endTime: "2024-09-15T17:20:35.123Z",
    fileSize: 1024,
    filename: "icon_789012-3456.ico",
    id: 11,
    incognito: false,
    mime: "image/x-icon",
    paused: false,
    startTime: "2024-09-15T17:15:00.456Z",
    state: "complete",
    totalBytes: 1024,
    sender: "uvw",
    receiver: "xyz"
  },
  {
    bytesReceived: 8192,
    endTime: "2024-09-15T18:05:50.456Z",
    fileSize: 8192,
    filename: "small-archive_890123-4567.rar",
    id: 12,
    incognito: true,
    mime: "application/x-rar-compressed",
    paused: false,
    startTime: "2024-09-15T18:00:10.789Z",
    state: "complete",
    totalBytes: 8192,
    sender: "rst",
    receiver: "opq"
  },
  {
    bytesReceived: 204800,
    endTime: "2024-09-15T19:30:25.678Z",
    fileSize: 204800,
    filename: "software-update_901234-5678.dmg",
    id: 13,
    incognito: false,
    mime: "application/x-apple-diskimage",
    paused: false,
    startTime: "2024-09-15T19:20:15.123Z",
    state: "complete",
    totalBytes: 204800,
    sender: "ghi",
    receiver: "jkl"
  }
];


const FileTransferTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = fileTransferData.filter(item =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    new Date(item.startTime).toLocaleString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    new Date(item.endTime).toLocaleString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.receiver.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-screen-xl min-w-full mx-auto px-4">
      <div className="flex items-center justify-end mt-4 gap-x-3">
        <div className="relative flex  items-center justify-end w-full">
          <span className="absolute">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search"
            className="block w-full py-1.5 pr-5 text-gray-200 bg-gray-800 border rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 focus:outline-none border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-8 shadow-sm border border-gray-700 rounded-lg min-w-full  ">
        <table className=" min-w-full  text-sm text-left">
          <thead className="bg-gray-800 min-w-full w-full text-gray-200 font-medium border-b">
            <tr>
              <th className="py-3 px-6">Filename</th>
              <th className="py-3 px-6">File Size</th>
              <th className="py-3 px-6">Start Time</th>
              <th className="py-3 px-6">End Time</th>
              <th className="py-3 px-6">State</th>
              <th className="py-3 px-6">Sender</th>
              <th className="py-3 px-6">Receiver</th>
            </tr>
          </thead>
          <tbody className="text-gray-300 w-full divide-y">
            {
              fileTransferData.length != 0 &&
              filteredData.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.filename.slice(0, 40)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.fileSize}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(item.startTime).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(item.endTime).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.state}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.sender}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.receiver}</td>
                </tr>
              ))
            }
            {
              fileTransferData.length == 0 &&
              <tr>
                <td className="px-6 py-4 whitespace-nowrap"></td>
                <td className="px-6 py-4 whitespace-nowrap"></td>
                <td className="px-6 py-4 whitespace-nowrap"></td>
                <td className="px-6 py-4 whitespace-nowrap"></td>
                <td className="px-6 py-4 whitespace-nowrap"></td>
                <td className="px-6 py-4 whitespace-nowrap"></td>
                <td className="px-6 py-4 whitespace-nowrap"></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FileTransferTable;
