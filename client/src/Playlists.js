import React, { useState, useEffect } from "react";
import DownloadButton from "./components/DownloadButton";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      setIsLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.log("Access Token not found");
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `http://localhost:8000/playlists?access_token=${accessToken}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch playlists");
        }
        const data = await response.json();
        setPlaylists(data.items);
        console.log("Fetched playlists:", data.items);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
      setIsLoading(false);
    };

    fetchPlaylists();
  }, []);

  return (
    <div className="p-4 bg-black min-h-screen">
      <h2 className="text-4xl text-center font-bold mb-10 text-white">
        Your Playlists
      </h2>
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
          <h3 className="text-white mt-4">Fetching playlists...</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-gray-100 p-4 rounded-lg cursor-pointer bg-cover bg-center w-96 h-96 flex flex-col justify-between"
              style={{ backgroundImage: `url(${playlist.images[0]?.url})` }}
              onClick={() => {
                const url = playlist.tracks.href;
                const accessToken = localStorage.getItem("accessToken");
                console.log("Tracks:", url + "?access_token=" + accessToken);
                window.open(playlist.external_urls.spotify, "_blank");
              }}
            >
              <div className="text-white text-3xl font-bold backdrop-brightness-50 p-3 rounded-lg">
                {playlist.name}
              </div>
              <div className="text-gray-100 text-xl font-semibold backdrop-brightness-50 p-1 rounded-lg">
                {playlist.description || "No description"}
              </div>
              <DownloadButton playlistId={playlist.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlists;
