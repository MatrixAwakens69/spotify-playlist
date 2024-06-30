import React from "react";

const DownloadButton = ({ playlistId }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(`/download-playlist/${playlistId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `playlist_${playlistId}.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again later.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Download
    </button>
  );
};

export default DownloadButton;
