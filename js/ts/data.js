"use strict";
let favoritesArr = [];
let videoArr = [];
function writeVidJSON() {
    const videoJSONs = JSON.stringify(favoritesArr);
    localStorage.setItem('video-storage', videoJSONs);
}
function writeViewJSON() {
    const viewJSON = JSON.stringify(viewIndex);
    localStorage.setItem('view-index', viewJSON);
}
function writeSearchJSON() {
    const searchJSON = JSON.stringify(videoArr);
    localStorage.setItem('search-results', searchJSON);
}
function readSearchJSON() {
    const readSearch = localStorage.getItem('search-results');
    if (readSearch) {
        videoArr = JSON.parse(readSearch);
        return videoArr;
    }
    return videoArr;
}
function readJSON() {
    const returnJSON = localStorage.getItem('video-storage');
    if (returnJSON) {
        favoritesArr = JSON.parse(returnJSON);
        return favoritesArr;
    }
    favoritesArr = [];
    return favoritesArr;
}
function readViewJSON() {
    const returnViewJSON = localStorage.getItem('view-index');
    if (returnViewJSON) {
        viewIndex = JSON.parse(returnViewJSON);
        return viewIndex;
    }
    return viewIndex;
}
