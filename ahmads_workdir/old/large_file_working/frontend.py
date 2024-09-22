import streamlit as st
import requests

SERVER_URL = "http://localhost:8000"

def get_pending_uploads():
    response = requests.get(f"{SERVER_URL}/pending_uploads")
    if response.status_code == 200:
        return response.json()["pending_uploads"]
    return []

def confirm_upload(file_name):
    response = requests.post(f"{SERVER_URL}/confirm_upload", params={"file_name": file_name})
    return response.status_code == 200

def reject_upload(file_name):
    response = requests.post(f"{SERVER_URL}/reject_upload", params={"file_name": file_name})
    return response.status_code == 200

st.title("File Upload Confirmation")

if st.button("Refresh Pending Uploads"):
    st.rerun()  # Only trigger a refresh when the button is clicked

pending_uploads = get_pending_uploads()

if pending_uploads:
    for file_name in pending_uploads:
        st.write(f"Pending file: {file_name}")
        col1, col2 = st.columns(2)
        
        with col1:
            if st.button(f"Accept {file_name}"):
                if confirm_upload(file_name):
                    st.success(f"File {file_name} accepted and saved.")
                    st.experimental_rerun()  # Refresh after action
                else:
                    st.error("Error confirming file upload.")
        
        with col2:
            if st.button(f"Reject {file_name}"):
                if reject_upload(file_name):
                    st.warning(f"File {file_name} rejected and deleted.")
                    st.experimental_rerun()  # Refresh after action
                else:
                    st.error("Error rejecting file upload.")
else:
    st.write("No pending uploads.")
