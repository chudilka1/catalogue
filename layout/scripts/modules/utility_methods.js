function normalizeText(sourceName) {
    let i, titleWords = sourceName.split('_');
    for (i = 0; i < titleWords.length; i++) {
        titleWords[i] = titleWords[i].charAt(0).toUpperCase() + titleWords[i].slice(1);
    }
    return titleWords.join(' ');
}

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function setTitle(title) {
    sessionStorage.setItem("title", title)
}

function setGenre(genre) {
    sessionStorage.setItem("genre", genre)
}

function setCollectionName(collectionName) {
    sessionStorage.setItem("collectionName", collectionName)
}

function getTitle() {
    return sessionStorage.getItem("title");
}

function getGenre() {
    return sessionStorage.getItem("genre");
}

function getCollectionName() {
    return sessionStorage.getItem("collectionName");
}

export {normalizeText, setTitle, setGenre, setCollectionName, getTitle, getGenre, getCollectionName};