"use strict";
const favoritesArr = [];
const searchArr = [];
let data = {
    searchArr,
    favoritesArr,
};
function writeJSON() {
    const dataJSON = JSON.stringify(data);
    localStorage.setItem('data', dataJSON);
}
function readJSON() {
    const readData = localStorage.getItem('data');
    if (readData) {
        data = JSON.parse(readData);
        return data;
    }
    return data;
}
