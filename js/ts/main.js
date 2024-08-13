"use strict";
const API_KEY = 'AIzaSyC1ooFAsCCpsb6kgDMct1kXJTtn0vp5AKc';
const $submitSearch = document.querySelector('#submit');
const $landing = document.querySelector('#landing');
const $formInputs = document.querySelectorAll('select');
const $main = document.querySelector('main');
const $iFrame = document.querySelector('iframe');
const $img = document.querySelectorAll('img');
const $dialog = document.querySelector('dialog');
const $body = document.querySelector('body');
const $form = document.querySelector('form');
if (!$submitSearch ||
    !$iFrame ||
    !$img ||
    !$dialog ||
    !$landing ||
    !$formInputs ||
    !$main ||
    !$form ||
    !$body ||
    !document.querySelector('.iconX'))
    throw new Error('HTML query failed');
const videoArr = [];
async function searchYouTube() {
    try {
        const inputs = {
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
        if (inputs.level)
            keywords.push(inputs.level);
        if (inputs.category)
            keywords.push(inputs.category);
        if (inputs.length)
            keywords.push(inputs.length);
        if (inputs.focus)
            keywords.push(inputs.focus);
        const query = keywords
            .map((keyword) => encodeURIComponent(keyword))
            .join('+');
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&type=video&q=${query}&maxResults=6&key=${API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const videos = await response.json();
        videos.items.forEach((item) => {
            const id = item.id.videoId;
            const title = item.snippet.title;
            const description = item.snippet.description;
            const thumbnail = item.snippet.thumbnails.high.url;
            const channel = item.snippet.channelTitle;
            const video = {
                id,
                title,
                description,
                thumbnail,
                channel,
            };
            videoArr.push(video);
        });
        renderVideos();
        $form?.reset();
    }
    catch (error) {
        console.error('Error:', error);
    }
}
function renderVideos() {
    const $resultsDiv = $main?.appendChild(document.createElement('div'));
    if (!$resultsDiv)
        throw new Error('H2 creation error');
    $resultsDiv.setAttribute('class', 'results-div container md:pt-14 pt-8 mx-auto md:flex flex-wrap max-w-screen-lg');
    const $resultsH2 = $resultsDiv?.appendChild(document.createElement('h2'));
    if (!$resultsH2)
        throw new Error('H2 creation error');
    $resultsH2.textContent = 'Results';
    $resultsH2.setAttribute('class', 'text-3xl font-medium md:pr-10 mb-9 w-full');
    const $videosDiv = $resultsDiv?.appendChild(document.createElement('div'));
    if (!$videosDiv)
        throw new Error('$videoDiv creation error');
    $videosDiv.setAttribute('class', 'px-4 pt-4 md:pl-0 md:pt-0 flex flex-wrap');
    for (let i = 0; i < videoArr.length; i++) {
        const $videoContainer = $videosDiv.appendChild(document.createElement('div'));
        if (!$videoContainer)
            throw new Error('$videoContainer creation error');
        if (i === 1 || i === 4) {
            $videoContainer.setAttribute('class', 'video-div basis-1/3 px-6 pb-8');
        }
        else {
            $videoContainer.setAttribute('class', 'video-div basis-1/3');
        }
        const $videoAnchor = $videoContainer.appendChild(document.createElement('a'));
        if (!$videoAnchor)
            throw new Error('$videoAnchor creation error');
        $videoAnchor.setAttribute('href', '#');
        $videoAnchor.setAttribute('class', 'video');
        const $thumbnail = $videoAnchor.appendChild(document.createElement('img'));
        if (!$thumbnail)
            throw new Error('$thumbnail creation error');
        $thumbnail.setAttribute('class', 'h-fit rounded-sm w-80 mb-2 thumbnail');
        $thumbnail.setAttribute('src', videoArr[i].thumbnail);
        $thumbnail.setAttribute('data-id', videoArr[i].id);
        const $videoText = $videoContainer.appendChild(document.createElement('div'));
        if (!$videoText)
            throw new Error('unable to create $videoText');
        $videoText.setAttribute('class', 'video-text w-80 pl-1');
        const $channelAnchor = $videoText.appendChild(document.createElement('a'));
        if (!$channelAnchor)
            throw new Error('unable to create $channelAnchor');
        $channelAnchor.setAttribute('href', '#');
        const $channel = $channelAnchor.appendChild(document.createElement('span'));
        if (!$channel)
            throw new Error('unable to create $channel');
        $channel.setAttribute('class', 'font-medium text-l');
        $channel.innerHTML = videoArr[i].channel;
        const $title = $videoText.appendChild(document.createElement('span'));
        if (!$title)
            throw new Error('unable to create title');
        $title.setAttribute('class', 'font-normal text-md pr-4 w-80 max-w-80');
        $title.innerHTML = ' - ' + videoArr[i].title;
    }
    return $resultsDiv;
}
$body.addEventListener('click', (event) => {
    const $thumbnail = document.querySelectorAll('.thumbnail');
    if (!$thumbnail)
        throw new Error('$thumbnail not created');
    const eventTarget = event.target;
    if (eventTarget === $submitSearch) {
        event.preventDefault();
        $landing.setAttribute('class', 'hidden md:hidden container md:pt-14 pt-8 mx-auto md:flex max-w-screen-lg');
        searchYouTube();
    }
    if (eventTarget === document.querySelector('.iconX')) {
        $dialog.close();
        $iFrame.setAttribute('src', '');
    }
    if (videoArr[0]) {
        for (let i = 0; i < $thumbnail.length; i++) {
            if (eventTarget === $thumbnail[i]) {
                $dialog.showModal();
                const videoId = eventTarget.dataset.id;
                const formattedStr = `https://www.youtube.com/embed/${videoId}`;
                $iFrame.setAttribute('src', formattedStr);
            }
        }
    }
});
$dialog.addEventListener('dblclick', (event) => {
    const eventTarget = event.target;
    if (eventTarget === $dialog) {
        $dialog.close();
        $iFrame.setAttribute('src', '');
    }
});
