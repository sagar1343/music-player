const dataUrl = "https://musicapi.x007.workers.dev/search";
const audioUrl = "https://musicapi.x007.workers.dev/fetch";
const songsContainer = document.querySelector(".songsContainer");
const playBtn = document.getElementById("togglePlay");
const playingTime = document.querySelector(".currentTime");
const endTime = document.querySelector(".endTime");
const range = document.getElementById("progress");
const thumbnailImage = document.querySelector(".imgThumbnail");
const previousBtn = document.getElementById("previous");
const nextBtn = document.getElementById("next");
const songsList = [];
async function getSongList() {
  const url = "https://youtube-music-api3.p.rapidapi.com/home?gl=IN";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "4a919c5ff0msh9dc17868ff43ce1p1e025ajsna7935e365d59",
      "X-RapidAPI-Host": "youtube-music-api3.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    data.results.quick_picks
      .slice(0, 18)
      .forEach((song) => songsList.push(song.title));
  } catch (error) {
    console.error(error);
  }
}

let audio = new Audio();
let playingSongId;

async function fetchMusicData(songName) {
  const params = `?q=${songName}&searchEngine=mtmusic`;
  const response = await fetch(`${dataUrl}${params}`);
  const results = await response.json();
  return results;
}

async function getSongAudio(id) {
  const results = await fetchMusicData(songsList[id]);
  const params = `?id=${results.response[0].id}`;

  if (audio && !audio.paused) {
    audio.pause();
  }

  audio.src = `${audioUrl}${params}`;
  return audio;
}

function createSongCard(data, index) {
  const div = document.createElement("div");
  div.classList.add("card");
  div.id = index;
  div.innerHTML = `
    <img src=${data.response[0].img} class="card-img-top" >
    <div class="card-body d-flex flex-column justify-content-between align-items-center ">
      <p class="card-text">${data.response[0].title}</p>
      <i class="bi bi-play-circle-fill "></i>
    </div>
  `;
  return div;
}

async function addSongCards() {
  await getSongList();
  for (let index = 0; index < songsList.length; index++) {
    const song = songsList[index];
    const data = await fetchMusicData(song);
    const card = createSongCard(data, index);
    card.addEventListener("click", (event) => handleCardClick(event));
    songsContainer.appendChild(card);
  }
}

async function playMusic(songID) {
  await getSongAudio(songID);
  const data = await fetchMusicData(songsList[songID]);
  range.addEventListener("input", () => handleProgress(audio));
  audio.addEventListener("timeupdate", () => {
    displayTime(audio);
    progressControl(audio);
  });
  audio.play();
  playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
  thumbnailImage.src = data.response[0].img;
}

playBtn.addEventListener("click", togglePlay);

function togglePlay() {
  if (audio.paused) {
    audio.play();
    playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
  } else {
    playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
    audio.pause();
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

function displayTime(audio) {
  endTime.innerHTML = formatTime(audio.duration);
  playingTime.innerHTML = formatTime(audio.currentTime);
}

function progressControl(audio) {
  range.value = (audio.currentTime / audio.duration) * 100;
}

function handleProgress(audio) {
  const seekTime = (range.value / 100) * audio.duration;
  audio.currentTime = seekTime;
}
function handleCardClick(event) {
  const card = event.currentTarget;
  const songID = card.id;
  playingSongId = songID;
  playMusic(songID);
}

previousBtn.addEventListener("click", () => {
  const prevId = --playingSongId;
  if (prevId >= 0) playMusic(prevId);
});
nextBtn.addEventListener("click", () => {
  const nextId = ++playingSongId;
  if (nextId < songsList.length) playMusic(nextId);
});

addSongCards();
