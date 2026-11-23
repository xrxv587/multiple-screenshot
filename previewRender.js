function getQueryParam(key) {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  return params.get(key);
}
const img = document.querySelector("#preview");

const id = getQueryParam("id");
console.log(id)

const loadImg = async (id) => {
  const imgBuffer = await preview.getImage(id);
  const blob = new Blob([imgBuffer], { type: 'image/png' });
  const src = URL.createObjectURL(blob);
  img.src = src;
}

loadImg(id);
