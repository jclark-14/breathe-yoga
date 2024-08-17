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
  favorite: boolean;
}

interface Data {
  favoritesArr: Video[];
  searchArr: Video[];
  viewIndex?: number;
}

const favoritesArr: Video[] = [];
const searchArr: Video[] = [];

let data: Data = {
  searchArr,
  favoritesArr,
};

function writeJSON(): void {
  console.log('writeJSON called');
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('data', dataJSON);
}

function readJSON(): Data {
  const readData = localStorage.getItem('data');
  if (readData) {
    data = JSON.parse(readData);
    return data;
  }
  return data;
}
