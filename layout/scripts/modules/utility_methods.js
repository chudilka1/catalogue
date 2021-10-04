function normalizeText(sourceName) {
    return sourceName.split('_')
        .map(word =>
            word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function equalsIgnoringCase(text, textToComapre) {
    return text.localeCompare(textToComapre, undefined, { sensitivity: 'base' }) === 0;
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

function getGenre() {
    return sessionStorage.getItem("genre");
}

function getCollectionName() {
    return sessionStorage.getItem("collectionName");
}

export {normalizeText, equalsIgnoringCase, setTitle, setGenre, setCollectionName, getGenre, getCollectionName};