const songsList = [
  "Tum Hi Ho",
  "Channa Mereya",
  "Ae Watan",
  "Dil Diyan Gallan",
  "Gerua",
  "Tere Bina",
  "Tera Ban Jaunga",
  "Jeene Laga Hoon",
  "Dheere Dheere",
  "Raabta",
  "Tum Jo Aaye",
  "Tum Mile",
  "Tum Se Hi",
  "Sun Saathiya",
  "Muskurane Ki Wajah Tum Ho",
  "Janam Janam",
  "Agar Tum Saath Ho",
  "Zaalima",
  "Tum Hi Aana",
  "Hawayein",
  "Kabira",
  "Tum Jo Aaye ",
  "Tum Hi Ho Bandhu",
  "Tum Se Hi",
];
const songsDataURL = "https://jio-saavan-unofficial.p.rapidapi.com/getdata?q=";
const getSongURL = "https://jio-saavan-unofficial.p.rapidapi.com/getsong";

async function getMediaUrl(songName) {
  const params = "zaalima";
  const payloads = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "4a919c5ff0msh9dc17868ff43ce1p1e025ajsna7935e365d59",
      "X-RapidAPI-Host": "jio-saavan-unofficial.p.rapidapi.com",
    },
  };
  try {
    const resp = await fetch(songsDataURL + params, payloads);
    const data = await resp.json();
    const mediaURl = data.results[0].encrypted_media_url;
    console.log(mediaURl);
    return mediaURl;
  } catch (error) {
    console.log(error);
  }
}
async function getAudio() {
  const payloads = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "4a919c5ff0msh9dc17868ff43ce1p1e025ajsna7935e365d59",
      "X-RapidAPI-Host": "jio-saavan-unofficial.p.rapidapi.com",
    },
    body: JSON.stringify({
      encrypted_media_url: await getMediaUrl("zaalima"),
    }),
  };
  const resp = await fetch(getSongURL, payloads);
  const data = await resp.json();
  const audioLink = data.results[2]["320_kbps"];
  console.log(audioLink);
  return audioLink;
}

getAudio();
