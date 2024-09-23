from typing import Optional
from pydantic import BaseModel
from time import time


class FileTransferDetails(BaseModel):
    file_size: int
    partial_checksum: str
    file_location: str
    download_url: str
    final_download_url: str
    download_id: int
    filename: str
    mime: str
    bytes_received: int
    final_url: str
    state: str
    start_time: time
    end_time: time
    total_bytes: int
    paused: bool
    referrer: str
    danger: str
    exists: bool
    incognito: bool