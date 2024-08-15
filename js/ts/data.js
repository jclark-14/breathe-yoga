"use strict";
let favoritesArr = [];
function writeJSON() {
    const videoJSONs = JSON.stringify(favoritesArr);
    localStorage.setItem('video-storage', videoJSONs);
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
