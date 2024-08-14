const API_KEY = 'AIzaSyC1ooFAsCCpsb6kgDMct1kXJTtn0vp5AKc';
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
const $xIcon = document.querySelector('.iconX');
const $results = document.querySelector('#results-container');
// const $solidHeart = document.querySelector('#solid-heart');
// const $outlineHeart = document.querySelector('#outline-heart');

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
  !$results
  // !$solidHeart ||
  // !$outlineHeart
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
    renderVideos();
    previousUrl = url;
  } catch (error) {
    console.error('Error:', error);
  }
}

function renderVideos(): HTMLDivElement {
  const $resultsDiv = $results?.appendChild(document.createElement('div'));
  if (!$resultsDiv) throw new Error('$resultsDiv creation error');
  $resultsDiv.setAttribute(
    'class',
    'results-div container md:pt-10 pt-8 mx-auto md:flex flex-wrap max-w-screen-lg',
  );

  const $resultsH2 = $resultsDiv?.appendChild(document.createElement('h2'));
  if (!$resultsH2) throw new Error('$resultsH2 creation error');
  $resultsH2.textContent = 'Results';
  $resultsH2.setAttribute(
    'class',
    'text-3xl font-medium md:pl-2 md:pr-10 md:mb-10 w-full pl-8',
  );

  const $videosDiv = $resultsDiv.appendChild(document.createElement('div'));
  if (!$videosDiv) throw new Error('$videoDiv creation error');
  $videosDiv.setAttribute(
    'class',
    'px-4 pt-4 md:px-0 md:pt-0 flex flex-wrap mx-auto',
  );

  for (let i = 0; i < videoArr.length; i++) {
    const $videoContainer = $videosDiv.appendChild(
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
    $heartSolid.setAttribute('id', 'solid-heart');
    $heartSolid.setAttribute(
      'class',
      'fa-solid fa-heart fa-lg float-right pr-2 pb-1 hidden md:hidden',
    );
    $heartSolid.setAttribute('style', 'color: #403768');

    const $heartOutline = $heartAnchor.appendChild(document.createElement('i'));
    if (!$heartSolid) throw new Error('$heart not created');
    $heartOutline.setAttribute('id', 'outline-heart');
    $heartOutline.setAttribute(
      'class',
      'fa-regular fa-heart fa-lg float-right pr-2 pb-1',
    );
    $heartOutline.setAttribute('style', 'color: #403768');

    const $channel = $channelAnchor.appendChild(document.createElement('span'));
    if (!$channel) throw new Error('unable to create $channel');
    $channel.setAttribute('class', 'font-medium text-lg underline channel');
    //  $channel.setAttribute('data', videoArr[i].channel);
    $channel.innerHTML = videoArr[i].channel;

    const $title = $videoText.appendChild(document.createElement('p'));
    if (!$title) throw new Error('unable to create $title');
    $title.setAttribute('class', 'font-normal text-md pr-4');
    $title.innerHTML = ' ' + videoArr[i].title;
  }
  return $resultsDiv;
}

$body.addEventListener('click', (event: Event): void => {
  const $thumbnail = document.querySelectorAll('.thumbnail');

  const eventTarget = event.target as HTMLElement;
  if (eventTarget === $submitSearch) {
    event.preventDefault();
    createUrl();
    if (url === previousUrl) {
      toggleView($results);
      return;
    }
    const $resultsDiv = document.querySelector('.results-div');
    if (url !== previousUrl && $resultsDiv !== null) {
      $resultsDiv.remove();
      videoArr = [];
      searchYouTube();
      toggleView($results);
    } else {
      videoArr = [];
      searchYouTube();
      toggleView($results);
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

  if (eventTarget === $search) {
    toggleView($landing);
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

function toggleView(element: Element): void {
  if (element === $landing) {
    $landing.setAttribute(
      'class',
      'container md:pt-14 px-4 md:px-0 pt-8 mx-auto flex flex-wrap md:flex-nowrap max-w-screen-lg',
    );
    $results?.setAttribute('class', 'hidden md:hidden');
  } else if (element === $results) {
    $results.setAttribute('class', 'results-container');
    $landing?.setAttribute(
      'class',
      'hidden md:hidden container md:pt-14 px-4 md:px-0 pt-8 mx-auto flex flex-wrap md:flex-nowrap max-w-screen-lg',
    );
  }
}
// $dialog.showModal();
