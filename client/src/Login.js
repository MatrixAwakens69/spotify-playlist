import React from "react";

const Login = () => {
  const handleLogin = () => {
    // Redirect to the backend /login route
    window.location.href = "http://localhost:8000/login";
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black">
      <h1 className="text-4xl font-bold text-white mb-10">
        Spotify Playlist Downloader
      </h1>
      <button
        onClick={handleLogin}
        className="bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
      >
        Login with Spotify
      </button>
    </div>
  );
};

export default Login;
