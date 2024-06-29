import React, { useState, useEffect } from "react";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.log("Access Token not found");
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
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    fetchPlaylists();
  }, []);

  return (
    <div className="p-4 bg-black min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-white">Your Playlists</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="bg-gray-800 p-4 rounded-lg cursor-pointer bg-cover bg-center w-96 h-96 flex flex-col justify-between"
            style={{ backgroundImage: `url(${playlist.images[0]?.url})` }}
            onClick={() =>
              window.open(playlist.external_urls.spotify, "_blank")
            }
          >
            <div className="text-white text-3xl font-bold backdrop-brightness-50 p-3 rounded-lg">
              {playlist.name}
            </div>
            <div className="text-gray-100 text-xl font-semibold backdrop-brightness-50 p-1 rounded-lg">
              {playlist.description || "No description"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlists;
