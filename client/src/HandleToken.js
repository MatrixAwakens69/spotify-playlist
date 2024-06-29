import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const HandleToken = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const accessToken = queryParams.get("access_token");
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      navigate("/playlists");
    }
  }, [location, navigate]);

  return <div>Handling token...</div>;
};

export default HandleToken;
