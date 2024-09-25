# Use the official Python 3.11 image as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy only the requirements file initially
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the necessary files
COPY main.py .

# Expose the desired port
EXPOSE 8000

# Use ENTRYPOINT to set the base command
ENTRYPOINT ["python", "main.py"]
