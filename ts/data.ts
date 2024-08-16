/* exported data */
interface SearchInputs {
  level: string;
  category: string;
  length: string;
  focus?: string;
}

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channel: string;
  channelId: string;
}

let favoritesArr: Video[] = [];
let videoArr: Video[] = [];

function writeVidJSON(): void {
  const videoJSONs = JSON.stringify(favoritesArr);
  localStorage.setItem('video-storage', videoJSONs);
}

function writeViewJSON(): void {
  const viewJSON = JSON.stringify(viewIndex);
  localStorage.setItem('view-index', viewJSON);
}

function writeSearchJSON(): void {
  const searchJSON = JSON.stringify(videoArr);
  localStorage.setItem('search-results', searchJSON);
}

function readSearchJSON(): Video[] {
  const readSearch = localStorage.getItem('search-results');
  if (readSearch) {
    videoArr = JSON.parse(readSearch);
    return videoArr;
  }
  return videoArr;
}

function readJSON(): Video[] {
  const returnJSON = localStorage.getItem('video-storage') as string;
  if (returnJSON) {
    favoritesArr = JSON.parse(returnJSON);
    return favoritesArr;
  }
  favoritesArr = [];
  return favoritesArr;
}

function readViewJSON(): number {
  const returnViewJSON = localStorage.getItem('view-index');
  if (returnViewJSON) {
    viewIndex = JSON.parse(returnViewJSON);
    return viewIndex;
  }
  return viewIndex;
}
