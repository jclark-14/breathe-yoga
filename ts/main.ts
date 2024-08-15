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
const $favoritesDiv = document.querySelector('#favorites-div');
const $favoriteVideos = document.querySelector(
  '#favorite-videos',
) as HTMLDivElement;
const $xIcon = document.querySelector('.iconX');
const $results = document.querySelector('#results-container');
const $videosDiv = document.querySelector('.videos-div') as HTMLDivElement;
const $pNoFavorites = document.querySelector('.pfav');
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
  !$favoritesDiv ||
  !$videosDiv ||
  !$favoriteVideos ||
  !$pNoFavorites
)
  throw new Error('HTML query failed');

let previousUrl: string;
let url: string;
let videoArr: Video[] = [];

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
      };
      videoArr.push(video);
    });
    renderSearch();
    previousUrl = url;
  } catch (error) {
    console.error('Error:', error);
  }
}

function renderFavorites(video: Video): HTMLDivElement {
  const $videoContainer = $favoriteVideos?.appendChild(
    document.createElement('div'),
  );
  if (!$videoContainer) throw new Error('$videoContainer creation error');
  $videoContainer.setAttribute(
    'class',
    'fav-video-div basis-1/3 px-2 mx-auto mb-8',
  );

  const $videoAnchor = $videoContainer.appendChild(document.createElement('a'));
  if (!$videoAnchor) throw new Error('$videoAnchor creation error');
  $videoAnchor.setAttribute('href', '#');
  $videoAnchor.setAttribute('class', 'video');

  const $thumbnail = $videoAnchor.appendChild(document.createElement('img'));
  if (!$thumbnail) throw new Error('$thumbnail creation error');
  $thumbnail.setAttribute('class', 'h-fit rounded-sm w-80 thumbnail');
  $thumbnail.setAttribute('src', video.thumbnail);
  $thumbnail.setAttribute('data-id', video.id);

  const $videoText = $videoContainer.appendChild(document.createElement('div'));
  if (!$videoText) throw new Error('unable to create $videoText');
  $videoText.setAttribute('class', 'video-text w-80 pl-1 pt-1');

  const $channelHeartsDiv = $videoText.appendChild(document.createElement('p'));
  if (!$channelHeartsDiv) throw new Error('unable to create $hearts');
  $channelHeartsDiv.setAttribute('class', 'flex justify-between items-center');

  const $channelAnchor = $channelHeartsDiv.appendChild(
    document.createElement('a'),
  );
  if (!$channelAnchor) throw new Error('unable to create $channelAnchor');
  $channelAnchor.setAttribute(
    'href',
    `https://www.youtube.com/channel/${video.channelId}`,
  );
  $channelAnchor.setAttribute('class', 'channelAnchor');
  $channelAnchor.setAttribute('target', '_blank');

  const $heartAnchor = $channelHeartsDiv.appendChild(
    document.createElement('a'),
  );
  if (!$heartAnchor) throw new Error('$heartAnchor not present');
  $heartAnchor.setAttribute('href', '#');

  const $heartSolid = $heartAnchor.appendChild(document.createElement('i'));
  if (!$heartSolid) throw new Error('$heart not created');

  $heartSolid.setAttribute(
    'class',
    'fa-solid fa-heart fa-lg float-right pr-2  solid-heart',
  );
  $heartSolid.setAttribute('style', 'color: #403768');
  $heartSolid.setAttribute('data-id', video.id);

  const $heartOutline = $heartAnchor.appendChild(document.createElement('i'));
  if (!$heartOutline) throw new Error('$heart not created');

  $heartOutline.setAttribute(
    'class',
    'fa-regular fa-heart fa-lg float-right pr-2 outline-heart hidden md:hidden',
  );
  $heartOutline.setAttribute('style', 'color: #403768');
  $heartOutline.setAttribute('data-id', video.id);

  const $channel = $channelAnchor.appendChild(document.createElement('span'));
  if (!$channel) throw new Error('unable to create $channel');
  $channel.setAttribute('class', 'font-medium text-lg underline channel');
  $channel.innerHTML = video.channel;

  const $title = $videoText.appendChild(document.createElement('p'));
  if (!$title) throw new Error('unable to create $title');
  $title.setAttribute('class', 'font-normal text-md pr-4');
  $title.innerHTML = ' ' + video.title;

  if (!$favoriteVideos) throw new Error('$failed at render');
  return $favoriteVideos;
}

$body.addEventListener('click', (event: Event): void => {
  const $thumbnail = document.querySelectorAll('.thumbnail');
  const eventTarget = event.target as HTMLElement;

  if (eventTarget === $submitSearch) {
    const $videos = document.querySelector('#video');
    event.preventDefault();
    createUrl();
    if (url === previousUrl) {
      viewResults();
      return;
    }
    if (url !== previousUrl && $videos) {
      $videos.remove();
      videoArr = [];
      searchYouTube();
      viewResults();
    } else {
      videoArr = [];
      searchYouTube();
      viewResults();
    }
    $form?.reset();
  }

  if (eventTarget === $xIcon) {
    $dialog.close();
    $iFrameLg.setAttribute('src', '');
    $iFrameMobile.setAttribute('src', '');
  }

  if (videoArr[0]) {
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
    const $solidHearts = document.querySelectorAll('.solid-heart');
    const $outlineHearts = document.querySelectorAll('.outline-heart');
    if ($solidHearts && $outlineHearts) {
      const video = videoArr.find(
        (video) => video.id === eventTarget.dataset.id,
      ) as Video;
      favoritesArr.push(video);
      writeJSON();
      renderFavorites(video);
      for (let i = 0; i < $solidHearts.length; i++) {
        const element = $solidHearts[i] as HTMLElement;
        if (element.dataset.id === eventTarget.dataset.id) {
          element.setAttribute(
            'class',
            'fa-solid fa-heart fa-lg float-right pr-2 solid-heard',
          );
        }
      }
    }
    for (let i = 0; i < $outlineHearts.length; i++) {
      const element = $outlineHearts[i] as HTMLElement;
      if (element.dataset.id === eventTarget.dataset.id) {
        element.setAttribute(
          'class',
          'fa-regular fa-heart fa-lg float-right pr-2 outline-heart hidden md:hidden',
        );
      }
    }
  }

  if (eventTarget === $favorites) {
    viewFavorites();
  }

  if (eventTarget === $search) {
    viewLanding();
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
  favoritesArr.forEach((video) => renderFavorites(video));
});

function viewLanding(): void {
  $landing?.setAttribute(
    'class',
    'container md:pt-14 px-4 md:px-0 pt-8 mx-auto flex flex-wrap md:flex-nowrap max-w-screen-lg',
  );
  $favoritesDiv?.setAttribute('class', 'favorites-container hidden md:hidden');
  $results?.setAttribute('class', 'hidden md:hidden');
}

function viewResults(): void {
  $results?.setAttribute('class', 'results-container');
  $landing?.setAttribute(
    'class',
    'hidden md:hidden container md:pt-14 px-4 md:px-0 pt-8 mx-auto flex flex-wrap md:flex-nowrap max-w-screen-lg',
  );
  $favoritesDiv?.setAttribute('class', 'favorites-container hidden md:hidden');
}

function viewFavorites(): void {
  $results?.setAttribute('class', 'results-container hidden md:hidden');
  $landing?.setAttribute(
    'class',
    'hidden md:hidden container md:pt-14 px-4 md:px-0 pt-8 mx-auto flex flex-wrap md:flex-nowrap max-w-screen-lg',
  );
  $favoritesDiv?.setAttribute('class', 'favorites-container');
  const $favVideo = document.querySelector('.fav-video-div');
  if ($favVideo) {
    $pNoFavorites?.setAttribute(
      'class',
      'hidden md:hidden text-lg text-center w-full mt-10',
    );
  }
}

function renderSearch(): HTMLDivElement {
  for (let i = 0; i < videoArr.length; i++) {
    const $videoContainer = $videosDiv?.appendChild(
      document.createElement('div'),
    );
    if (!$videoContainer) throw new Error('$videoContainer creation error');
    $videoContainer.setAttribute('class', 'video-div basis-1/3 mx-auto mb-8');

    const $videoAnchor = $videoContainer.appendChild(
      document.createElement('a'),
    );
    if (!$videoAnchor) throw new Error('$videoAnchor creation error');
    $videoAnchor.setAttribute('href', '#');
    $videoAnchor.setAttribute('class', 'video');

    const $thumbnail = $videoAnchor.appendChild(document.createElement('img'));
    if (!$thumbnail) throw new Error('$thumbnail creation error');
    $thumbnail.setAttribute('class', 'h-fit rounded-sm w-80 thumbnail');
    $thumbnail.setAttribute('src', videoArr[i].thumbnail);
    $thumbnail.setAttribute('data-id', videoArr[i].id);

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
    $channelAnchor.setAttribute(
      'href',
      `https://www.youtube.com/channel/${videoArr[i].channelId}`,
    );
    $channelAnchor.setAttribute('class', 'channelAnchor');
    $channelAnchor.setAttribute('target', '_blank');

    const $heartAnchor = $channelHeartsDiv.appendChild(
      document.createElement('a'),
    );
    if (!$heartAnchor) throw new Error('$heartAnchor not present');
    $heartAnchor.setAttribute('href', '#');

    const $heartSolid = $heartAnchor.appendChild(document.createElement('i'));
    if (!$heartSolid) throw new Error('$heart not created');

    $heartSolid.setAttribute(
      'class',
      'fa-solid fa-heart fa-lg float-right pr-2 hidden md:hidden solid-heart',
    );
    $heartSolid.setAttribute('style', 'color: #403768');
    $heartSolid.setAttribute('data-id', videoArr[i].id);

    const $heartOutline = $heartAnchor.appendChild(document.createElement('i'));
    if (!$heartOutline) throw new Error('$heart not created');

    $heartOutline.setAttribute(
      'class',
      'fa-regular fa-heart fa-lg float-right pr-2 outline-heart',
    );
    $heartOutline.setAttribute('style', 'color: #403768');
    $heartOutline.setAttribute('data-id', videoArr[i].id);

    const $channel = $channelAnchor.appendChild(document.createElement('span'));
    if (!$channel) throw new Error('unable to create $channel');
    $channel.setAttribute('class', 'font-medium text-lg underline channel');
    $channel.innerHTML = videoArr[i].channel;

    const $title = $videoText.appendChild(document.createElement('p'));
    if (!$title) throw new Error('unable to create $title');
    $title.setAttribute('class', 'font-normal text-md pr-4');
    $title.innerHTML = ' ' + videoArr[i].title;
  }
  return $videosDiv;
}
