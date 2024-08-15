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

function writeJSON(): void {
  const videoJSONs = JSON.stringify(favoritesArr);
  localStorage.setItem('video-storage', videoJSONs);
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
