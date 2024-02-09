const url = "https://api.spotify.com/v1/browse/new-releases?offset=0&limit=50";

async function getNewreleases() {
  const data = await fetch(url, {
    method: "GET",
    headers: {
      Authorization:
        "Bearer BQAt17jBkvUN60mrO50O_wj8yMZcs3fRb72VkgZjwMZY_8atfIOzWOlPWHRqR3Bsh9od9sEcyGyOLJ0Sa38wYyufyJJn2rNYUC2eHIPPcBcKQbWzZlo",
    },
  });
  const jsonData = await data.json();
  const albums = jsonData.albums;
  return albums;
}

getNewreleases().then((resp) => console.log(resp));

async function setAlbum() {
  const albumContianer = document.querySelector(".album-contianer");
  const albums = await getNewreleases();
  albums.items.forEach((album) => {
    const div = document.createElement("div");
    div.innerHTML = `<div class="card rounded-2 overflow-hidden border-0 shadow-lg " style="width: 15rem;">
        <img class="object-fit-cover" src=${album.images[2].url} class="card-img-top" >
        <div class="card-body">
          <h6 class=" card-title text-nowrap overflow-hidden">${album.name}</h6>
        </div>
      </div>`;
    albumContianer.appendChild(div);
  });
}
setAlbum();
