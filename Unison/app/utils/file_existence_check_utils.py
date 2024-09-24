import aiohttp
from typing import Dict, Optional

class FileExistenceCheckerClient:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.session: Optional[aiohttp.ClientSession] = None

    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    async def check_file_existence(self, file_path: str) -> Dict[str, bool]:
        """
        Check if a file exists by calling the file existence checker API.

        Args:
            file_path (str): The path of the file to check.

        Returns:
            Dict[str, bool]: A dictionary with the key "exists" and a boolean value.

        Raises:
            aiohttp.ClientError: If there's a client-side error when making the request.
            ValueError: If the API response is not in the expected format.
        """
        if not self.session:
            raise RuntimeError("Client session not initialized. Use 'async with' to create a session.")

        url = f"{self.base_url}/check-file-existence"
        payload = {"file_path": file_path}

        try:
            async with self.session.post(url, json=payload) as response:
                response.raise_for_status()
                data = await response.json()

                if "exists" not in data:
                    raise ValueError("Unexpected API response format")

                return data
        except aiohttp.ClientError as e:
            raise e
        except ValueError as e:
            raise e