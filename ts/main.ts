const API_KEY = 'AIzaSyDFMMKvQu9eI1apQkQDi__onjn2vhhV-hU';
const $submitSearch = document.querySelector('#submit');
const $landing = document.querySelector('#landing');
const $formInputs = document.querySelectorAll('select');
const $main = document.querySelector('main');
const $iFrameLg = document.querySelector('.lg-screen');
const $iFrameMobile = document.querySelector('.mobile');
const $img = document.querySelectorAll('img');
const $dialog = document.querySelector('dialog');
const $body = document.querySelector('body');
const $form = document.querySelector('form');
const $search = document.querySelector('#search');
const $favorites = document.querySelector('#favorites');
const $resultsNav = document.querySelector('#results');
const $xIcon = document.querySelector('.iconX');
const $results = document.querySelector('#results-container');
const $videosDiv = document.querySelector('.videos-div') as HTMLDivElement;
const $pNoFavorites = document.querySelector('.pfav');
const $subHeading = document.getElementById('subheading');

if (
  !$submitSearch ||
  !$iFrameLg ||
  !$iFrameMobile ||
  !$img ||
  !$dialog ||
  !$landing ||
  !$formInputs ||
  !$main ||
  !$form ||
  !$body ||
  !$xIcon ||
  !$search ||
  !$results ||
  !$favorites ||
  !$videosDiv ||
  !$pNoFavorites ||
  !$resultsNav ||
  !$subHeading
)
  throw new Error('HTML query failed');

let url: string;
let renderI: string;
const favorite = true || false;

function createUrl(): void {
  const inputs: SearchInputs = {
    level: $formInputs[0].value,
    category: $formInputs[1].value,
    length: $formInputs[2].value,
    focus: $formInputs[3].value,
  };
  const baseKeywords = [
    'yoga',
    'exercise',
    'sarah|adriene|charlie|annanas|madfit',
  ];
  const keywords = [...baseKeywords];
  if (inputs.level) keywords.push(inputs.level);
  if (inputs.category) keywords.push(inputs.category);
  if (inputs.length) keywords.push(inputs.length);
  if (inputs.focus) keywords.push(inputs.focus);
  const query = keywords
    .map((keyword) => encodeURIComponent(keyword))
    .join('+');
  url = `https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&type=video&q=${query}&maxResults=6&key=${API_KEY}`;
}

async function searchYouTube(): Promise<void> {
  try {
    createUrl();
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    data.searchArr.length = 0;
    const videos = await response.json();
    videos.items.forEach((item: any) => {
      const id = item.id.videoId;
      const title = item.snippet.title;
      const description = item.snippet.description;
      const thumbnail = item.snippet.thumbnails.high.url;
      const channel = item.snippet.channelTitle;
      const channelId = item.snippet.channelId;
      const video = {
        id,
        title,
        description,
        thumbnail,
        channel,
        channelId,
        favorite,
      };
      data.searchArr.push(video);
    });
    for (let i = 0; i < data.searchArr.length; i++) {
      const videoId = data.searchArr[i].id;
      const matched = data.favoritesArr.find(
        (element) => element.id === videoId,
      );
      if (matched) {
        data.searchArr[i].favorite = true;
      } else if (!matched) {
        data.searchArr[i].favorite = false;
      }
    }
    writeJSON();
    renderVideos(renderI);
    viewResults();
  } catch (error) {
    console.error('Error:', error);
  }
}

$body.addEventListener('click', (event: Event): void => {
  const $thumbnail = document.querySelectorAll('.thumbnail');
  const eventTarget = event.target as HTMLElement;
  readJSON();
  if (eventTarget === $submitSearch) {
    event.preventDefault();
    renderI = 'search';
    searchYouTube();
    $form?.reset();
  }

  if (eventTarget === $xIcon) {
    $dialog.close();
    $iFrameLg.setAttribute('src', '');
    $iFrameMobile.setAttribute('src', '');
  }

  if (data.searchArr[0]) {
    for (let i = 0; i < $thumbnail.length; i++) {
      if (eventTarget === $thumbnail[i]) {
        $dialog.showModal();
        const videoId = eventTarget.dataset.id;
        const formattedStr = `https://www.youtube.com/embed/${videoId}`;
        $iFrameLg.setAttribute('src', formattedStr);
        $iFrameMobile.setAttribute('src', formattedStr);
      }
    }
  }

  if (eventTarget.matches('.outline-heart')) {
    const video = data.searchArr.find(
      (video) => video.id === eventTarget.dataset.id,
    ) as Video;
    video.favorite = true;
    data.favoritesArr.push(video);
    writeJSON();
    toggleHeart(eventTarget);
  }

  if (eventTarget.matches('.solid-heart')) {
    const videoFromSearch = data.searchArr.find(
      (video) => video.id === eventTarget.dataset.id,
    ) as Video;
    const video = data.favoritesArr.find(
      (video) => video.id === eventTarget.dataset.id,
    ) as Video;
    toggleHeart(eventTarget);
    videoFromSearch.favorite = false;
    data.favoritesArr.splice(data.favoritesArr.indexOf(video), 1);
    writeJSON();
  }

  if (eventTarget === $favorites) {
    viewFavorites();
    renderI = 'favorites';
    renderVideos(renderI);
  }

  if (eventTarget === $search) {
    renderI = 'search';
    viewLanding();
  }

  if (eventTarget === $resultsNav) {
    renderI = 'search';
    renderVideos(renderI);
    viewResults();
  }
});

$dialog.addEventListener('dblclick', (event: Event): void => {
  const eventTarget = event.target as HTMLElement;
  if (eventTarget === $dialog) {
    $dialog.close();
    $iFrameLg.setAttribute('src', '');
    $iFrameMobile.setAttribute('src', '');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  readJSON();
  if (data.viewIndex === 2) {
    renderI = 'search';
  } else if (data.viewIndex === 3) {
    renderI = 'favorites';
  }
  renderVideos(renderI);
  if (data.viewIndex === 1) {
    viewLanding();
  } else if (data.viewIndex === 2) {
    viewResults();
  } else if (data.viewIndex === 3) {
    viewFavorites();
  }
});

function viewLanding(): void {
  $landing?.setAttribute(
    'class',
    'container md:pt-14 px-4 md:px-0 pt-8 mx-auto flex flex-wrap md:flex-nowrap max-w-screen-lg',
  );
  $results?.setAttribute('class', 'container hidden md:hidden');
  data.viewIndex = 1;
  writeJSON();
}

function viewResults(): void {
  $results?.setAttribute('class', 'results-container');
  $landing?.setAttribute(
    'class',
    'hidden md:hidden container md:pt-14 px-4 md:px-0 pt-8 mx-auto flex flex-wrap md:flex-nowrap max-w-screen-lg',
  );
  if (data.searchArr[0]) {
    $pNoFavorites?.setAttribute(
      'class',
      'hidden md:hidden text-lg text-center w-full mt-10',
    );
  } else if (!data.searchArr[0]) {
    $pNoFavorites?.setAttribute('class', 'text-lg text-center w-full mt-10');
  }
  if ($pNoFavorites) $pNoFavorites.innerHTML = 'No results found.';
  if ($subHeading) $subHeading.textContent = 'Results';

  data.viewIndex = 2;
  writeJSON();
}

function viewFavorites(): void {
  $results?.setAttribute('class', 'results-container');
  $landing?.setAttribute(
    'class',
    'hidden md:hidden container md:pt-14 px-4 md:px-0 pt-8 mx-auto flex flex-wrap md:flex-nowrap max-w-screen-lg',
  );
  if (data.favoritesArr[0]) {
    $pNoFavorites?.setAttribute(
      'class',
      'hidden md:hidden text-lg text-center w-full mt-10',
    );
  } else if (!data.favoritesArr[0]) {
    $pNoFavorites?.setAttribute('class', ' text-lg text-center w-full mt-10');
  }
  if ($subHeading) $subHeading.textContent = 'Favorites';
  data.viewIndex = 3;
  writeJSON();
}

function toggleHeart(eventTarget: HTMLElement): void {
  const $solidHearts = document.querySelectorAll('.solid-heart');
  const $outlineHearts = document.querySelectorAll('.outline-heart');
  if (!$solidHearts || !$outlineHearts) throw new Error('$hearts query failed');
  if (eventTarget.matches('.solid-heart')) {
    for (let i = 0; i < $solidHearts.length; i++) {
      const elementSolidHeart = $solidHearts[i] as HTMLElement;
      const elementOutlineHeart = $outlineHearts[i] as HTMLElement;
      if (elementSolidHeart.dataset.id === eventTarget.dataset.id) {
        elementSolidHeart.setAttribute(
          'class',
          'fa-solid fa-heart fa-lg float-right pr-2 solid-heart hidden md:hidden',
        );
        elementOutlineHeart.setAttribute(
          'class',
          'fa-regular fa-heart fa-lg float-right pr-2 outline-heart',
        );
      }
    }
  }
  if (eventTarget.matches('.outline-heart')) {
    for (let i = 0; i < $outlineHearts.length; i++) {
      const elementSolidHeart = $solidHearts[i] as HTMLElement;
      const elementOutlineHeart = $outlineHearts[i] as HTMLElement;
      if (elementOutlineHeart.dataset.id === eventTarget.dataset.id) {
        elementSolidHeart.setAttribute(
          'class',
          'fa-solid fa-heart fa-lg float-right pr-2 solid-heart ',
        );
        elementOutlineHeart.setAttribute(
          'class',
          'fa-regular fa-heart fa-lg float-right pr-2 outline-heart hidden md:hidden',
        );
      }
    }
  }
}

function renderVideos(renderI: string): HTMLElement {
  readJSON();
  const $videoCont = document.querySelector('.vidContainer');
  if ($videoCont) {
    $videoCont.remove();
  }
  let render: Video[] = [];
  if (renderI === 'search') {
    render = data.searchArr;
  } else if (renderI === 'favorites') {
    render = data.favoritesArr;
  }

  const $vidContainer = $videosDiv.appendChild(document.createElement('div'));
  $vidContainer.setAttribute(
    'class',
    'vidContainer mx-auto flex flex-wrap justify-between',
  );
  for (let i = 0; i < render.length; i++) {
    const $videoContainer = $vidContainer.appendChild(
      document.createElement('div'),
    );
    if (!$videoContainer) throw new Error('$videoContainer creation error');
    $videoContainer.setAttribute('class', 'video-div basis-1/3 mb-8');

    const $videoAnchor = $videoContainer.appendChild(
      document.createElement('a'),
    );
    if (!$videoAnchor) throw new Error('$videoAnchor creation error');
    $videoAnchor.setAttribute('href', '#');
    $videoAnchor.setAttribute('class', 'video');

    const $thumbnail = $videoAnchor.appendChild(document.createElement('img'));
    if (!$thumbnail) throw new Error('$thumbnail creation error');
    $thumbnail.setAttribute('class', 'h-fit rounded-sm w-80 thumbnail');
    $thumbnail.setAttribute('src', render[i].thumbnail);
    $thumbnail.setAttribute('data-id', render[i].id);

    const $videoText = $videoContainer.appendChild(
      document.createElement('div'),
    );
    if (!$videoText) throw new Error('unable to create $videoText');
    $videoText.setAttribute('class', 'video-text w-80 pl-1 pt-1');

    const $channelHeartsDiv = $videoText.appendChild(
      document.createElement('p'),
    );
    if (!$channelHeartsDiv) throw new Error('unable to create $hearts');
    $channelHeartsDiv.setAttribute(
      'class',
      'flex justify-between items-center',
    );

    const $channelAnchor = $channelHeartsDiv.appendChild(
      document.createElement('a'),
    );
    if (!$channelAnchor) throw new Error('unable to create $channelAnchor');
    $channelAnchor?.setAttribute(
      'href',
      `https://www.youtube.com/channel/${render[i].channelId}`,
    );
    $channelAnchor.setAttribute('class', 'channelAnchor');
    $channelAnchor.setAttribute('target', '_blank');

    const $heartAnchor = $channelHeartsDiv.appendChild(
      document.createElement('a'),
    );
    if (!$heartAnchor) throw new Error('$heartAnchor not present');
    $heartAnchor.setAttribute('href', '#');

    const $heartSolid = $heartAnchor.appendChild(document.createElement('i'));
    const $heartOutline = $heartAnchor.appendChild(document.createElement('i'));
    if (!$heartSolid || !$heartOutline) throw new Error('$heart not created');
    if (render[i].favorite) {
      $heartSolid.setAttribute(
        'class',
        'fa-solid fa-heart fa-lg float-right pr-2 solid-heart',
      );
      $heartOutline.setAttribute(
        'class',
        'fa-regular fa-heart fa-lg float-right pr-2 md:hidden hidden outline-heart',
      );
    } else if (!render[i].favorite) {
      $heartSolid.setAttribute(
        'class',
        'fa-solid fa-heart fa-lg float-right pr-2 solid-heart md:hidden hidden',
      );
      $heartOutline.setAttribute(
        'class',
        'fa-regular fa-heart fa-lg float-right pr-2 outline-heart',
      );
    }
    $heartSolid.setAttribute('style', 'color: #403768');
    $heartSolid.setAttribute('data-id', render[i].id);
    $heartOutline.setAttribute('style', 'color: #403768');
    $heartOutline.setAttribute('data-id', render[i].id);

    const $channel = $channelAnchor.appendChild(document.createElement('span'));
    if (!$channel) throw new Error('unable to create $channel');
    $channel.setAttribute('class', 'font-medium text-lg underline channel');
    $channel.innerHTML = render[i].channel;

    const $title = $videoText.appendChild(document.createElement('p'));
    if (!$title) throw new Error('unable to create $title');
    $title.setAttribute('class', 'font-normal text-md pr-4');
    $title.innerHTML = ' ' + render[i].title;
  }
  return $videosDiv;
}
