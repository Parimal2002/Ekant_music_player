# एकांत V3 — Static GitHub Pages Edition

This version is ONLY:

- HTML
- CSS
- JavaScript

No Node.js, PHP, Python, database or backend.

## 1. Add your YouTube API key

Open:

`script.js`

Find:

`const YOUTUBE_API_KEY = "PASTE_YOUR_YOUTUBE_DATA_API_KEY_HERE";`

Replace it with your YouTube Data API v3 key.

## 2. Google Cloud setup

Create a Google Cloud project, enable:

`YouTube Data API v3`

Create an API key.

For a public GitHub Pages site, restrict the key by:

- Website/referrer restriction to your GitHub Pages domain
- API restriction to YouTube Data API v3 only

Never use an unrestricted production key.

## 3. Run

You don't need a server.

You can open `index.html` directly for the UI, but browser/API restrictions are more reliable when deployed to GitHub Pages.

## 4. GitHub Pages

Upload these files to a GitHub repository:

index.html
style.css
script.js
assets/background.png

Then enable GitHub Pages from the repository settings.

## 5. Playlist

Paste a public YouTube playlist URL such as:

https://www.youtube.com/playlist?list=YOUR_PLAYLIST_ID

The JavaScript automatically loads all available playlist pages, so it is NOT limited to 20 songs.

The site uses the YouTube IFrame Player API for playback.

## Singer detection

YouTube does not provide a universal singer/artist field for every video.

The script first checks common title formats:

Song - Singer
Song | Singer
Song – Singer
Song — Singer
Song • Singer

If it cannot find a separator, it uses the YouTube channel/owner name as the artist.

This is intentionally lightweight and works without a backend.
