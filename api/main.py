from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
import httpx
from starlette.config import Config
from fastapi.middleware.cors import CORSMiddleware

config = Config(".env")
CLIENT_ID = config("SPOTIFY_CLIENT_ID", cast=str)
CLIENT_SECRET = config("SPOTIFY_CLIENT_SECRET", cast=str)
REDIRECT_URI = config("SPOTIFY_REDIRECT_URI", cast=str)

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/login")
def login():
    scope = "user-read-private user-read-email"
    auth_url = f"https://accounts.spotify.com/authorize?response_type=code&client_id={CLIENT_ID}&scope={scope}&redirect_uri={REDIRECT_URI}&show_dialog=true"
    return RedirectResponse(auth_url)

@app.get("/callback")
async def callback(code: str):
    token_url = "https://accounts.spotify.com/api/token"
    token_data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
    }
    async with httpx.AsyncClient() as client:
        token_response = await client.post(token_url, data=token_data)
    token_response_json = token_response.json()
    access_token = token_response_json.get("access_token")
    if not access_token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Spotify authentication failed.")
    frontend_redirect_uri = f"http://localhost:3000/handle-token?access_token={access_token}"
    return RedirectResponse(url=frontend_redirect_uri)

@app.get("/playlists")
async def get_playlists(access_token: str):
    url = "https://api.spotify.com/v1/me/playlists"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch playlists.")
    
    return response.json()