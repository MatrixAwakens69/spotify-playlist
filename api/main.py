from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.responses import RedirectResponse, FileResponse
from zipfile import ZipFile
import httpx
import os
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

async def fetch_playlist_details(playlist_id: str, access_token: str):
    url = f"https://api.spotify.com/v1/playlists/{playlist_id}"
    headers = {"Authorization": f"Bearer {access_token}"}
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch playlist details.")
    return response.json()

async def create_zip_from_mp3_files(mp3_files):
    zip_file_path = "playlist.zip"
    with ZipFile(zip_file_path, 'w') as zipf:
        for file in mp3_files:
            zipf.write(file, os.path.basename(file))
    return zip_file_path

@app.get("/download_playlist/{playlist_id}")
async def download_playlist(playlist_id: str, access_token: str):
    playlist_details = await fetch_playlist_details(playlist_id, access_token)
    mp3_files = await download_tracks_as_mp3(playlist_details)
    zip_file_path = await create_zip_from_mp3_files(mp3_files)
    return FileResponse(path=zip_file_path, media_type='application/zip', filename="playlist.zip")