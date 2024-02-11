const dataUrl = "https://musicapi.x007.workers.dev/search";
const audioUrl = "https://musicapi.x007.workers.dev/fetch";
const songsContainer = document.querySelector(".songsContainer");
const playBtn = document.getElementById("togglePlay");
const playingTime = document.querySelector(".currentTime");
const endTime = document.querySelector(".endTime");
const range = document.getElementById("progress");
const songsList = [
  "param sundari",
  "Ranjha",
  "Lutt Putt Gaya",
  "sapna jahan",
  "besabriya",
  "Dosti",
  "tujh me rab dikhta hai",
  "Bandeya re",
  "khairiyat",
  "paniyo sa ",
  "pathaan",
  "Chaleya",
  "Ishq Jaisa Kuch",
  "kaise hua",
  "kal ho na ho",
];
let audio;

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

  audio = new Audio(`${audioUrl}${params}`);
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
  for (let index = 0; index < songsList.length; index++) {
    const song = songsList[index];
    const data = await fetchMusicData(song);
    const card = createSongCard(data, index);
    songsContainer.appendChild(card);
  }
}

async function playMusic(songID) {
  await getSongAudio(songID);
  range.addEventListener("input", () => handleProgress(audio));

  audio &&
    audio.addEventListener("timeupdate", () => {
      displayTime(audio);
      progressControl(audio);
    });
}

playBtn.addEventListener("click", async () => {
  if (audio.paused) {
    audio.play();
    playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
  } else {
    playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
    audio.pause();
  }
});

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

addSongCards();

playMusic(1);
