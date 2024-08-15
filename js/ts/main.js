"use strict";
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
const $favorites = document.querySelector('#favorites');
const $favoritesDiv = document.querySelector('#favorites-div');
const $favoriteVideos = document.querySelector('#favorite-videos');
const $xIcon = document.querySelector('.iconX');
const $results = document.querySelector('#results-container');
const $videosDiv = document.querySelector('.videos-div');
const $pNoFavorites = document.querySelector('.pfav');
if (!$submitSearch ||
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
    !$pNoFavorites)
    throw new Error('HTML query failed');
let previousUrl;
let url;
let videoArr = [];
function createUrl() {
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
    url = `https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&type=video&q=${query}&maxResults=6&key=${API_KEY}`;
}
async function searchYouTube() {
    try {
        createUrl();
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
        findMatches();
        previousUrl = url;
    }
    catch (error) {
        console.error('Error:', error);
    }
}
$body.addEventListener('click', (event) => {
    const $thumbnail = document.querySelectorAll('.thumbnail');
    const eventTarget = event.target;
    readJSON();
    if (eventTarget === $submitSearch) {
        const $vidContainer = document.querySelector('.vidContainer');
        event.preventDefault();
        createUrl();
        if (url === previousUrl) {
            findMatches();
            viewResults();
            return;
        }
        if (url !== previousUrl && $vidContainer) {
            $vidContainer?.remove();
            videoArr = [];
            searchYouTube();
            viewResults();
        }
        else {
            $vidContainer?.remove();
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
    const $solidHearts = document.querySelectorAll('.solid-heart');
    const $outlineHearts = document.querySelectorAll('.outline-heart');
    if (!$solidHearts || !$outlineHearts)
        throw new Error('$hearts query failed');
    if (eventTarget.matches('.outline-heart')) {
        const video = videoArr.find((video) => video.id === eventTarget.dataset.id);
        if (favoritesArr.indexOf(video) < 0) {
            favoritesArr.push(video);
            writeJSON();
        }
        for (let i = 0; i < $solidHearts.length; i++) {
            const elementSolidHeart = $solidHearts[i];
            const elementOutlineHeart = $outlineHearts[i];
            if (elementSolidHeart.dataset.id === eventTarget.dataset.id) {
                elementSolidHeart.setAttribute('class', 'fa-solid fa-heart fa-lg float-right pr-2 solid-heart ');
                elementOutlineHeart.setAttribute('class', 'fa-outline fa-heart fa-lg float-right pr-2 outline-heart hidden md:hidden');
            }
        }
    }
    if (eventTarget.matches('.solid-heart')) {
        const videoIndex = favoritesArr.findIndex((video) => video.id === eventTarget.dataset.id);
        favoritesArr.splice(videoIndex, 1);
        writeJSON();
        for (let i = 0; i < $solidHearts.length; i++) {
            const elementSolidHeart = $solidHearts[i];
            const elementOutlineHeart = $outlineHearts[i];
            if (elementSolidHeart.dataset.id === eventTarget.dataset.id) {
                elementSolidHeart.setAttribute('class', 'fa-solid fa-heart fa-lg float-right pr-2 solid-heart hidden md:hidden');
                elementOutlineHeart.setAttribute('class', 'fa-regular fa-heart fa-lg float-right pr-2 outline-heart');
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
$dialog.addEventListener('dblclick', (event) => {
    const eventTarget = event.target;
    if (eventTarget === $dialog) {
        $dialog.close();
        $iFrameLg.setAttribute('src', '');
        $iFrameMobile.setAttribute('src', '');
    }
});
document.addEventListener('DOMContentLoaded', () => {
    readJSON();
    renderFavorites(favoritesArr);
});
function viewLanding() {
    $landing?.setAttribute('class', 'container md:pt-14 px-4 md:px-0 pt-8 mx-auto flex flex-wrap md:flex-nowrap max-w-screen-lg');
    $favoritesDiv?.setAttribute('class', 'favorites-container hidden md:hidden');
    $results?.setAttribute('class', 'hidden md:hidden');
}
function viewResults() {
    $results?.setAttribute('class', 'results-container');
    $landing?.setAttribute('class', 'hidden md:hidden container md:pt-14 px-4 md:px-0 pt-8 mx-auto flex flex-wrap md:flex-nowrap max-w-screen-lg');
    $favoritesDiv?.setAttribute('class', 'favorites-container hidden md:hidden');
}
function viewFavorites() {
    $results?.setAttribute('class', 'results-container hidden md:hidden');
    $landing?.setAttribute('class', 'hidden md:hidden container md:pt-14 px-4 md:px-0 pt-8 mx-auto flex flex-wrap md:flex-nowrap max-w-screen-lg');
    $favoritesDiv?.setAttribute('class', 'favorites-container');
    const $favContainer = document.querySelector('.favContainer');
    if ($favContainer) {
        $favContainer.remove();
        renderFavorites(favoritesArr);
    }
    if (favoritesArr[0]) {
        $pNoFavorites?.setAttribute('class', 'hidden md:hidden text-lg text-center w-full mt-10');
    }
    else if (!favoritesArr[0]) {
        $pNoFavorites?.setAttribute('class', ' text-lg text-center w-full mt-10');
    }
}
function findMatches() {
    const matches = [];
    for (let i = 0; i < videoArr.length; i++) {
        const vidId = videoArr[i].id;
        for (let i = 0; i < favoritesArr.length; i++) {
            if (vidId === favoritesArr[i].id) {
                console.log('winnerwinner!');
                matches.push(favoritesArr[i]);
            }
        }
    }
    const $solidHearts = document.querySelectorAll('.solid-heart');
    console.log('solidhearts', $solidHearts);
    const $outlineHearts = document.querySelectorAll('.outline-heart');
    console.log('outline hearts', $outlineHearts);
    for (let i = 0; i < matches.length; i++) {
        console.log(matches);
        console.log(matches[i].id);
        const matchesId = matches[i].id;
        for (let i = 0; i < $solidHearts.length; i++) {
            const elementSolidHeart = $solidHearts[i];
            const elementOutlineHeart = $outlineHearts[i];
            console.log('element.id', elementSolidHeart.dataset.id);
            if (elementSolidHeart.dataset.id === matchesId) {
                console.log('finding hearts');
                elementSolidHeart.setAttribute('class', 'fa-solid fa-heart fa-lg float-right pr-2 solid-heart');
                elementOutlineHeart.setAttribute('class', 'fa-regular fa-heart fa-lg float-right pr-2 outline-heart hidden md:hidden');
            }
        }
    }
    console.log('matches', matches);
}
function renderFavorites(favoritesArr) {
    readJSON();
    const $favContainer = $favoriteVideos.appendChild(document.createElement('div'));
    $favContainer.setAttribute('class', 'favContainer mx-auto flex flex-wrap');
    for (let i = 0; i < favoritesArr.length; i++) {
        const $videoContainer = $favContainer?.appendChild(document.createElement('div'));
        if (!$videoContainer)
            throw new Error('$videoContainer creation error');
        $videoContainer.setAttribute('class', 'fav-video-div basis-1/3 px-2 mx-auto mb-8');
        const $videoAnchor = $videoContainer.appendChild(document.createElement('a'));
        if (!$videoAnchor)
            throw new Error('$videoAnchor creation error');
        $videoAnchor.setAttribute('href', '#');
        $videoAnchor.setAttribute('class', 'video');
        const $thumbnail = $videoAnchor.appendChild(document.createElement('img'));
        if (!$thumbnail)
            throw new Error('$thumbnail creation error');
        $thumbnail.setAttribute('class', 'h-fit rounded-sm w-80 thumbnail');
        $thumbnail.setAttribute('src', favoritesArr[i]?.thumbnail);
        $thumbnail.setAttribute('data-id', favoritesArr[i]?.id);
        const $videoText = $videoContainer.appendChild(document.createElement('div'));
        if (!$videoText)
            throw new Error('unable to create $videoText');
        $videoText.setAttribute('class', 'video-text w-80 pl-1 pt-1');
        const $channelHeartsDiv = $videoText.appendChild(document.createElement('p'));
        if (!$channelHeartsDiv)
            throw new Error('unable to create $hearts');
        $channelHeartsDiv.setAttribute('class', 'flex justify-between items-center');
        const $channelAnchor = $channelHeartsDiv.appendChild(document.createElement('a'));
        if (!$channelAnchor)
            throw new Error('unable to create $channelAnchor');
        $channelAnchor?.setAttribute('href', `https://www.youtube.com/channel/${favoritesArr[i].channelId}`);
        $channelAnchor.setAttribute('class', 'channelAnchor');
        $channelAnchor.setAttribute('target', '_blank');
        const $heartAnchor = $channelHeartsDiv.appendChild(document.createElement('a'));
        if (!$heartAnchor)
            throw new Error('$heartAnchor not present');
        $heartAnchor.setAttribute('href', '#');
        const $heartSolid = $heartAnchor.appendChild(document.createElement('i'));
        if (!$heartSolid)
            throw new Error('$heart not created');
        $heartSolid.setAttribute('class', 'fa-solid fa-heart fa-lg float-right pr-2  solid-heart');
        $heartSolid.setAttribute('style', 'color: #403768');
        $heartSolid.setAttribute('data-id', favoritesArr[i]?.id);
        const $heartOutline = $heartAnchor.appendChild(document.createElement('i'));
        if (!$heartOutline)
            throw new Error('$heart not created');
        $heartOutline.setAttribute('class', 'fa-regular fa-heart fa-lg float-right pr-2 outline-heart hidden md:hidden');
        $heartOutline.setAttribute('style', 'color: #403768');
        $heartOutline.setAttribute('data-id', favoritesArr[i].id);
        const $channel = $channelAnchor.appendChild(document.createElement('span'));
        if (!$channel)
            throw new Error('unable to create $channel');
        $channel.setAttribute('class', 'font-medium text-lg underline channel');
        $channel.innerHTML = favoritesArr[i]?.channel;
        const $title = $videoText.appendChild(document.createElement('p'));
        if (!$title)
            throw new Error('unable to create $title');
        $title.setAttribute('class', 'font-normal text-md pr-4');
        $title.innerHTML = ' ' + favoritesArr[i]?.title;
        if (!$favoriteVideos)
            throw new Error('$failed at render');
    }
}
function renderSearch() {
    const $vidContainer = $videosDiv.appendChild(document.createElement('div'));
    $vidContainer.setAttribute('class', 'vidContainer mx-auto flex flex-wrap');
    for (let i = 0; i < videoArr.length; i++) {
        const $videoContainer = $vidContainer.appendChild(document.createElement('div'));
        if (!$videoContainer)
            throw new Error('$videoContainer creation error');
        $videoContainer.setAttribute('class', 'video-div basis-1/3 mx-auto mb-8');
        const $videoAnchor = $videoContainer.appendChild(document.createElement('a'));
        if (!$videoAnchor)
            throw new Error('$videoAnchor creation error');
        $videoAnchor.setAttribute('href', '#');
        $videoAnchor.setAttribute('class', 'video');
        const $thumbnail = $videoAnchor.appendChild(document.createElement('img'));
        if (!$thumbnail)
            throw new Error('$thumbnail creation error');
        $thumbnail.setAttribute('class', 'h-fit rounded-sm w-80 thumbnail');
        $thumbnail.setAttribute('src', videoArr[i].thumbnail);
        $thumbnail.setAttribute('data-id', videoArr[i].id);
        const $videoText = $videoContainer.appendChild(document.createElement('div'));
        if (!$videoText)
            throw new Error('unable to create $videoText');
        $videoText.setAttribute('class', 'video-text w-80 pl-1 pt-1');
        const $channelHeartsDiv = $videoText.appendChild(document.createElement('p'));
        if (!$channelHeartsDiv)
            throw new Error('unable to create $hearts');
        $channelHeartsDiv.setAttribute('class', 'flex justify-between items-center');
        const $channelAnchor = $channelHeartsDiv.appendChild(document.createElement('a'));
        if (!$channelAnchor)
            throw new Error('unable to create $channelAnchor');
        $channelAnchor?.setAttribute('href', `https://www.youtube.com/channel/${videoArr[i].channelId}`);
        $channelAnchor.setAttribute('class', 'channelAnchor');
        $channelAnchor.setAttribute('target', '_blank');
        const $heartAnchor = $channelHeartsDiv.appendChild(document.createElement('a'));
        if (!$heartAnchor)
            throw new Error('$heartAnchor not present');
        $heartAnchor.setAttribute('href', '#');
        const $heartSolid = $heartAnchor.appendChild(document.createElement('i'));
        if (!$heartSolid)
            throw new Error('$heart not created');
        $heartSolid.setAttribute('class', 'fa-solid fa-heart fa-lg float-right pr-2 hidden md:hidden solid-heart');
        $heartSolid.setAttribute('style', 'color: #403768');
        $heartSolid.setAttribute('data-id', videoArr[i].id);
        const $heartOutline = $heartAnchor.appendChild(document.createElement('i'));
        if (!$heartOutline)
            throw new Error('$heart not created');
        $heartOutline.setAttribute('class', 'fa-regular fa-heart fa-lg float-right pr-2 outline-heart');
        $heartOutline.setAttribute('style', 'color: #403768');
        $heartOutline.setAttribute('data-id', videoArr[i].id);
        const $channel = $channelAnchor.appendChild(document.createElement('span'));
        if (!$channel)
            throw new Error('unable to create $channel');
        $channel.setAttribute('class', 'font-medium text-lg underline channel');
        $channel.innerHTML = videoArr[i].channel;
        const $title = $videoText.appendChild(document.createElement('p'));
        if (!$title)
            throw new Error('unable to create $title');
        $title.setAttribute('class', 'font-normal text-md pr-4');
        $title.innerHTML = ' ' + videoArr[i].title;
    }
    return $videosDiv;
}
