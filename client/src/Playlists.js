import React, { useState, useEffect } from "react";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const accessToken = localStorage.getItem("accessToken"); // Assuming the access token is stored in localStorage
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
        setPlaylists(data.items); // Assuming the Spotify API response structure
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    fetchPlaylists();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Playlists</h2>
      <div className="grid grid-cols-3 gap-4">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="bg-gray-800 p-4 rounded-lg">
            <img
              src={playlist.images[0]?.url}
              alt={playlist.name}
              className="w-full h-48 object-cover rounded-md"
            />
            <h3 className="mt-2 text-white">{playlist.name}</h3>
            <p className="text-gray-400">{playlist.tracks.total} tracks</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlists;
