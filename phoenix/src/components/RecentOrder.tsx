import React from 'react'
import { format } from 'date-fns'
import Link from 'next/link'
import { getOrderStatus } from '../lib/helpers'

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



const recentTransferData: FileTransferStatus[] = [
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


];

const RecentOrders: React.FC = () => {
  return (
    <div className="bg-gray-800 p-4 rounded-md border border-gray-700 shadow-sm">
      <strong className="text-gray-200 text-lg font-semibold">Recent Orders</strong>
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y border divide-gray-200">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Sender</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">File Name</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Start Time</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">File Size</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Receiver </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y text-gray-700 text-sm divide-gray-200">
            {recentTransferData.map((file) => (
              <tr key={file.id} className="">
                <td className="px-3 py-4 whitespace-nowrap">
                  <Link href={`/`} className="text-gray-300 hover:text-gray-200">
                    #{file.id}
                  </Link>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <p className="text-gray-300 hover:text-gray-200">
                    #{file.sender}
                  </p>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <p className="text-gray-300 hover:text-gray-200">
                    {file.filename.slice(0, 40)}
                  </p>
                </td>
                <td className="px-3 py-4 text-gray-300 whitespace-nowrap">
                  {format(new Date(file.startTime), 'dd MMM yyyy')}
                </td>
                <td className="px-3 py-4 text-gray-300 whitespace-nowrap">
                  {file.bytesReceived}
                </td>
                <td className="px-3 py-4 text-gray-300 whitespace-nowrap">
                  {file.receiver}
                </td>
                <td className="px-3 py-4 text-gray-300 whitespace-nowrap">
                  {getOrderStatus("DELIVERED")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  )
}

export default RecentOrders
