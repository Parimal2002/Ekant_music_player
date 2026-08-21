/* =========================================================
   एकांत — YouTube Playlist Music Player
   Pure HTML + CSS + JavaScript
   No API Key
   ========================================================= */


/* =========================================================
   YOUTUBE PLAYLIST
   ========================================================= */

const PLAYLIST_ID =
    "PL3pHzzJ_qh96fpA11KWFQ5h3nFfzGkIAR";


/* =========================================================
   PLAYER VARIABLES
   ========================================================= */

let player = null;

let playerReady = false;

let isPlaying = false;

let isMuted = false;

let playlist = [];

let currentIndex = 0;


/* =========================================================
   LOAD YOUTUBE IFRAME API
   ========================================================= */

const youtubeScript =
    document.createElement("script");

youtubeScript.src =
    "https://www.youtube.com/iframe_api";

document.head.appendChild(
    youtubeScript
);


/* =========================================================
   YOUTUBE API READY
   ========================================================= */

window.onYouTubeIframeAPIReady =
function () {

    console.log(
        "YouTube API loaded"
    );


    player =
        new YT.Player(
            "youtube-player",
            {

                width: "200",

                height: "200",

                playerVars: {

                    autoplay: 0,

                    controls: 0,

                    playsinline: 1,

                    rel: 0,

                    modestbranding: 1,

                    listType: "playlist",

                    list: PLAYLIST_ID,

                    origin:
                        window.location.origin

                },

                events: {

                    onReady:
                        onPlayerReady,

                    onStateChange:
                        onPlayerStateChange,

                    onError:
                        onPlayerError

                }

            }
        );

};


/* =========================================================
   PLAYER READY
   ========================================================= */

function onPlayerReady(event) {

    playerReady = true;


    player.setVolume(72);


    /*
       Explicitly load your playlist.
    */

    player.loadPlaylist({

        list:
            PLAYLIST_ID,

        listType:
            "playlist",

        index: 0,

        startSeconds: 0

    });


    /*
       Wait for YouTube to populate playlist.
    */

    setTimeout(
        updatePlaylistInfo,
        1500
    );


    showToast(
        "एकांत playlist ready ✦"
    );

}


/* =========================================================
   PLAYER ERROR
   ========================================================= */

function onPlayerError(event) {

    console.log(
        "YouTube error:",
        event.data
    );


    showToast(
        "This song cannot be played here."
    );

}


/* =========================================================
   PLAYER STATE
   ========================================================= */

function onPlayerStateChange(event) {

    console.log(
        "YouTube state:",
        event.data
    );


    if (
        event.data ===
        YT.PlayerState.PLAYING
    ) {

        isPlaying = true;

        updatePlayerUI();

        updateSongInfo();

        updatePlaylistInfo();

    }


    if (
        event.data ===
        YT.PlayerState.PAUSED
    ) {

        isPlaying = false;

        updatePlayerUI();

    }


    if (
        event.data ===
        YT.PlayerState.ENDED
    ) {

        isPlaying = false;

        updatePlayerUI();


        /*
           YouTube playlist normally
           moves to the next song itself.
        */

        setTimeout(
            updatePlaylistInfo,
            700
        );

    }


    if (
        event.data ===
        YT.PlayerState.CUED
    ) {

        setTimeout(
            updateSongInfo,
            500
        );

    }

}


/* =========================================================
   PLAY / PAUSE
   ========================================================= */

function togglePlay() {

    if (!playerReady) {

        showToast(
            "YouTube is still loading..."
        );

        return;

    }


    if (isPlaying) {

        player.pauseVideo();

    } else {

        player.playVideo();

    }

}


/* =========================================================
   NEXT
   ========================================================= */

function nextSong() {

    if (!playerReady) {

        showToast(
            "YouTube is still loading..."
        );

        return;

    }


    const list =
        player.getPlaylist();


    if (
        list &&
        list.length > 1
    ) {

        player.nextVideo();


        setTimeout(
            updateSongInfo,
            700
        );


    } else {

        showToast(
            "Playlist is not available."
        );

    }

}


/* =========================================================
   PREVIOUS
   ========================================================= */

function previousSong() {

    if (!playerReady) {

        showToast(
            "YouTube is still loading..."
        );

        return;

    }


    const list =
        player.getPlaylist();


    if (
        list &&
        list.length > 1
    ) {

        player.previousVideo();


        setTimeout(
            updateSongInfo,
            700
        );


    } else {

        showToast(
            "Playlist is not available."
        );

    }

}


/* =========================================================
   UPDATE PLAYLIST INFORMATION
   ========================================================= */

function updatePlaylistInfo() {

    if (!playerReady) return;


    try {

        playlist =
            player.getPlaylist() || [];


        currentIndex =
            player.getPlaylistIndex();


        if (
            currentIndex < 0
        ) {

            currentIndex = 0;

        }


        updateCount();

        updateSongInfo();


    } catch (error) {

        console.log(
            "Playlist information error:",
            error
        );

    }

}


/* =========================================================
   UPDATE CURRENT SONG
   ========================================================= */

function updateSongInfo() {

    if (!playerReady) return;


    try {

        const data =
            player.getVideoData();


        if (!data) return;


        const title =
            data.title ||
            "एकांत — Your Night";


        const channel =
            data.author ||
            "YouTube";


        const videoId =
            data.video_id ||
            "";


        /*
           Extract song / singer
           from YouTube title.
        */

        const song =
            parseSongTitle(title);


        const titleElement =
            document.getElementById(
                "trackTitle"
            );


        const artistElement =
            document.getElementById(
                "trackArtist"
            );


        const thumbnail =
            document.getElementById(
                "trackThumb"
            );


        if (titleElement) {

            titleElement.textContent =
                song.title;

        }


        if (artistElement) {

            artistElement.textContent =
                song.artist ||
                channel;

        }


        /*
           Automatically use
           YouTube thumbnail.
        */

        if (
            thumbnail &&
            videoId
        ) {

            thumbnail.src =
                `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

        }


        updateCount();


    } catch (error) {

        console.log(
            "Song info error:",
            error
        );

    }

}


/* =========================================================
   SONG TITLE PARSER
   ========================================================= */

function parseSongTitle(title) {

    let songTitle =
        title.trim();

    let artist =
        "";


    /*
       Example:

       Tum Hi Ho - Arijit Singh
    */

    if (
        songTitle.includes(" - ")
    ) {

        const parts =
            songTitle.split(" - ");


        songTitle =
            parts.shift().trim();


        artist =
            parts.join(" - ").trim();

    }


    /*
       Example:

       Tum Hi Ho | Arijit Singh
    */

    else if (
        songTitle.includes(" | ")
    ) {

        const parts =
            songTitle.split(" | ");


        songTitle =
            parts.shift().trim();


        artist =
            parts.join(" | ").trim();

    }


    /*
       Example:

       Tum Hi Ho • Arijit Singh
    */

    else if (
        songTitle.includes(" • ")
    ) {

        const parts =
            songTitle.split(" • ");


        songTitle =
            parts.shift().trim();


        artist =
            parts.join(" • ").trim();

    }


    return {

        title:
            songTitle ||
            "एकांत",

        artist:
            artist

    };

}


/* =========================================================
   COUNT
   ========================================================= */

function updateCount() {

    const count =
        document.getElementById(
            "count"
        );


    if (!count) return;


    const total =
        playlist.length;


    const current =
        currentIndex + 1;


    if (!total) {

        count.textContent =
            "00 / 00";

        return;

    }


    count.textContent =
        `${String(current).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

}


/* =========================================================
   PROGRESS
   ========================================================= */

function updateProgress() {

    if (!playerReady) return;


    try {

        const duration =
            player.getDuration();


        const current =
            player.getCurrentTime();


        if (
            !duration ||
            duration <= 0
        ) {

            return;

        }


        const percentage =
            (
                current /
                duration
            ) * 100;


        const progress =
            document.getElementById(
                "progress"
            );


        const currentTime =
            document.getElementById(
                "currentTime"
            );


        const durationElement =
            document.getElementById(
                "duration"
            );


        if (progress) {

            progress.value =
                percentage;

        }


        if (currentTime) {

            currentTime.textContent =
                formatTime(current);

        }


        if (durationElement) {

            durationElement.textContent =
                formatTime(duration);

        }


    } catch (error) {

        console.log(
            "Progress error:",
            error
        );

    }

}


/*
   Update progress every 500ms
*/

setInterval(
    updateProgress,
    500
);


/* =========================================================
   SEEK
   ========================================================= */

function seekSong(value) {

    if (!playerReady) return;


    const duration =
        player.getDuration();


    if (!duration) return;


    const position =
        (
            Number(value) /
            100
        ) * duration;


    player.seekTo(
        position,
        true
    );

}


/* =========================================================
   VOLUME
   ========================================================= */

function setVolume(value) {

    if (!playerReady) return;


    const volume =
        Number(value);


    player.setVolume(
        volume
    );


    if (
        volume === 0
    ) {

        isMuted = true;

    } else {

        isMuted = false;

        player.unMute();

    }


    updateMuteUI();

}


/* =========================================================
   MUTE
   ========================================================= */

function toggleMute() {

    if (!playerReady) return;


    if (isMuted) {

        player.unMute();

        player.setVolume(72);

        isMuted = false;


        const volume =
            document.getElementById(
                "volume"
            );


        if (volume) {

            volume.value = 72;

        }


    } else {

        player.mute();

        isMuted = true;


        const volume =
            document.getElementById(
                "volume"
            );


        if (volume) {

            volume.value = 0;

        }

    }


    updateMuteUI();

}


/* =========================================================
   MUTE UI
   ========================================================= */

function updateMuteUI() {

    const button =
        document.getElementById(
            "muteBtn"
        );


    if (!button) return;


    const span =
        button.querySelector(
            "span"
        );


    if (span) {

        span.textContent =
            isMuted
                ? "MUTED"
                : "VOLUME";

    }

}


/* =========================================================
   PLAY BUTTON / EQUALIZER
   ========================================================= */

function updatePlayerUI() {

    const playButton =
        document.getElementById(
            "playBtn"
        );


    const equalizer =
        document.getElementById(
            "equalizer"
        );


    if (playButton) {

        playButton.textContent =
            isPlaying
                ? "❚❚"
                : "▶";

    }


    if (equalizer) {

        equalizer.classList.toggle(
            "playing",
            isPlaying
        );

    }

}


/* =========================================================
   TIME FORMAT
   ========================================================= */

function formatTime(seconds) {

    if (
        !Number.isFinite(seconds)
    ) {

        return "0:00";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    const remaining =
        Math.floor(
            seconds % 60
        );


    return (
        minutes +
        ":" +
        String(remaining)
            .padStart(2, "0")
    );

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) return;


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        showToast.timer
    );


    showToast.timer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2200
        );

}


/* =========================================================
   BUTTON EVENTS
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const playButton =
            document.getElementById(
                "playBtn"
            );


        const nextButton =
            document.getElementById(
                "nextBtn"
            );


        const previousButton =
            document.getElementById(
                "prevBtn"
            );


        const muteButton =
            document.getElementById(
                "muteBtn"
            );


        const progress =
            document.getElementById(
                "progress"
            );


        const volume =
            document.getElementById(
                "volume"
            );


        if (playButton) {

            playButton.onclick =
                togglePlay;

        }


        if (nextButton) {

            nextButton.onclick =
                nextSong;

        }


        if (previousButton) {

            previousButton.onclick =
                previousSong;

        }


        if (muteButton) {

            muteButton.onclick =
                toggleMute;

        }


        if (progress) {

            progress.oninput =
                () => {

                    seekSong(
                        progress.value
                    );

                };

        }


        if (volume) {

            volume.oninput =
                () => {

                    setVolume(
                        volume.value
                    );

                };

        }

    }
);


/* =========================================================
   KEYBOARD CONTROLS
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.target.tagName ===
            "INPUT"
        ) {

            return;

        }


        if (
            event.code ===
            "Space"
        ) {

            event.preventDefault();

            togglePlay();

        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            nextSong();

        }


        if (
            event.key ===
            "ArrowLeft"
        ) {

            previousSong();

        }


        if (
            event.key.toLowerCase() ===
            "m"
        ) {

            toggleMute();

        }

    }
);