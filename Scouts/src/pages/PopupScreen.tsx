import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileAudio,
  FaFileVideo,
  FaFileArchive,
  FaFile,
  FaExclamationTriangle,
  FaPause,
  FaPlay,
  FaTimes,
  FaUser,
} from 'react-icons/fa';
import ToggleSwitch from '../components/ToggleSwitch';
import { useTab } from '../hooks/TabContext';

// Function to get the appropriate file icon based on file extension
const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const iconMap: { [key: string]: JSX.Element } = {
    pdf: <FaFilePdf className="text-red-600" />,
    doc: <FaFileWord className="text-blue-600" />,
    xls: <FaFileExcel className="text-green-600" />,
    jpg: <FaFileImage className="text-pink-600" />,
    mp3: <FaFileAudio className="text-purple-600" />,
    mp4: <FaFileVideo className="text-yellow-600" />,
    zip: <FaFileArchive className="text-orange-600" />,
    rar: <FaFileArchive className="text-orange-600" />,
  };
  return iconMap[ext] || <FaFile className="text-gray-600" />;
};

interface DownloadItem {
  id: number;
  filename: string;
  mime: string;
  fileSize: number;
  bytesReceived: number;
  finalUrl: string;
  state: string;
  startTime: string;
  paused: boolean;
  totalBytes: number;
}

// Function to format bytes into readable format (e.g., KB, MB)
const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const Popup = () => {
  const { switchTab } = useTab();
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [ongoingDownloads, setOngoingDownloads] = useState<DownloadItem[]>([]);
  const [pausedIds, setPausedIds] = useState<number[]>([]);

  // Function to pause all ongoing downloads during API calls
  const pauseAllDownloads = () => {
    const pausedIds = ongoingDownloads.map((download) => {
      if (!download.paused) {
        chrome.downloads.pause(download.id); // Pause download if not already paused
        return download.id;
      }
      return null;
    }).filter((id) => id !== null);
    setPausedIds(pausedIds as number[]);
  };

  // Function to resume previously paused downloads after API calls
  const resumePausedDownloads = () => {
    pausedIds.forEach((id) => {
      chrome.downloads.resume(id); // Resume paused downloads
    });
    setPausedIds([]);
  };

  // Function to fetch the checksum of a file and pause downloads during the API call
  const fetchChecksum = async (url: string) => {
    pauseAllDownloads(); // Pause all downloads before API call
    const token = localStorage.getItem('accessToken');
    try {
      console.log(token);
      const response = await axios.get(`http://52.172.0.204:8080/api/file-metadata/calculate-partial-checksum?url=${encodeURIComponent(url)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      return response.data.checksum;
    } catch (error) {
      console.error('Error fetching checksum:', error);
      return null;
    } finally {
      resumePausedDownloads(); // Resume downloads after the API call completes
    }
  };

  // Function to fetch metadata of a file and pause downloads during the API call
  const fetchMetadata = async (url: string) => {
    pauseAllDownloads(); // Pause all downloads before API call
    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.get(`http://52.172.0.204:8080/api/file-metadata?download_url=${encodeURIComponent(url)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      console.log('Here');
      return response.data.metadata;
    } catch (error) {
      console.error('Error fetching metadata:', error);
      return null;
    } finally {
      resumePausedDownloads(); // Resume downloads after the API call completes
    }
  };

  // Function to post metadata to the server and pause downloads during the API call
  const postMetadata = async (metadata: any) => {
    pauseAllDownloads(); // Pause all downloads before API call
    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.post('http://52.172.0.204:8080/api/file-metadata', metadata, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error posting metadata:', error);
      return null;
    } finally {
      resumePausedDownloads(); // Resume downloads after the API call completes
    }
  };

  // Function to pause an individual download
  const handlePause = (id: number) => {
    chrome.downloads.pause(id);
  };

  // Function to resume an individual download
  const handleResume = (id: number) => {
    chrome.downloads.resume(id);
  };

  // Function to cancel an individual download
  const handleCancel = (id: number) => {
    chrome.downloads.cancel(id);
  };

  // Function to handle new downloads, fetching checksum and metadata, and posting the combined data
  const handleNewDownload = async (downloadItem: DownloadItem) => {
    const checksum = await fetchChecksum(downloadItem.finalUrl);
    const metadata = await fetchMetadata(downloadItem.finalUrl);

    if (checksum && metadata) {
      const combinedData = { checksum, metadata, downloadItem };
      await postMetadata(combinedData); // Post combined data after fetching checksum and metadata
    }
  };

  // Fetch ongoing downloads periodically to update the state
  const fetchOngoingDownloads = () => {
    chrome.downloads.search({}, (results) => {
      const ongoing = results.filter((item) => item.state === 'in_progress');
      pauseAllDownloads();
      setOngoingDownloads(ongoing as DownloadItem[]);
    });
  };

  // useEffect hook to initialize the downloads list and set up periodic fetching of ongoing downloads
  useEffect(() => {
    chrome.runtime.sendMessage({ command: 'getDownloads' }, (response) => {
      if (response && Array.isArray(response.downloads)) {
        setDownloads(response.downloads as DownloadItem[]);
        response.downloads.forEach((downloadItem: DownloadItem) => {
          if (downloadItem.state === 'in_progress') {
            handleNewDownload(downloadItem);
            console.log('here');
          }
        });
      }
    });

    const interval = setInterval(fetchOngoingDownloads, 1000); // Fetch ongoing downloads every second
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  // Helper function to extract file name from a URL or path
  const getFileName = (path: string): string => {
    return path.substring(path.lastIndexOf('/') + 1);
  };

  return (
    <div className="flex flex-col hide-scrollbar pb-10 px-1 gap-4 overflow-y-scroll">
      <div className="p-3 flex items-center justify-between">
        <ToggleSwitch />
        <button
          onClick={() => {
            switchTab('profile');
          }}
          className="px-6 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600 inline-flex items-center justify-center gap-2"
        >
          <FaUser /> Profile
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-center py-2 text-lg font-semibold">Ongoing Downloads</h2>
        {ongoingDownloads.length > 0 ? (
          ongoingDownloads.map((download) => (
            <div
              key={download.id}
              className="block mx-2 px-4 py-6 border bg-white border-gray-200 rounded-lg shadow"
            >
              <div className="flex items-center justify-between">
                <p className="mb-2 text-sm font-bold tracking-tight text-gray-900">
                  {getFileName(download.filename)}
                </p>
                <div className="flex gap-2">
                  {download.paused ? (
                    <button
                      onClick={() => handleResume(download.id)}
                      className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      <FaPlay />
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePause(download.id)}
                      className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                    >
                      <FaPause />
                    </button>
                  )}
                  <button
                    onClick={() => handleCancel(download.id)}
                    className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-700">
                {formatBytes(download.bytesReceived)}/{formatBytes(download.totalBytes)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-700 text-center">No ongoing downloads</p>
        )}

        <h2 className="text-center py-2 text-lg font-semibold">Previous Downloads</h2>
        {downloads.slice(0, 10).map((download) => (
          <div
            key={download.id}
            className={`block hover:border-blue-500 mx-2 px-4 py-4 border border-gray-200 rounded-lg shadow ${download.state === 'interrupted' ? 'bg-red-100 border-red-400' : 'bg-white'
              }`}
          >
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">{getFileIcon(download.filename)}</span>
              <h5 className="text-md font-bold tracking-tight text-gray-900">
                {getFileName(download.filename)}
              </h5>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-700">
                {formatBytes(download.bytesReceived)}/{formatBytes(download.fileSize)}
              </p>
              {download.state === 'interrupted' && (
                <p className="text-xs text-red-700 flex items-center">
                  <FaExclamationTriangle className="mr-1" />
                  Download Interrupted
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Popup;
