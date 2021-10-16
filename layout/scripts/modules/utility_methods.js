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
    return text.localeCompare(textToComapre, undefined, {sensitivity: 'base'}) === 0;
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

function set_genre_and_collection_name_from_link(hrefObject) {
    let href = $(hrefObject).attr('href');
    let slashBehindGalleryWord = href.indexOf('y') + 2;
    let shortenedPathToSource = href.slice(slashBehindGalleryWord, href.lastIndexOf('.'));
    let targetGenre = shortenedPathToSource.split('/')[0];
    let targetSourceName = shortenedPathToSource.split('/')[1];
    setGenre(targetGenre);
    setCollectionName(targetSourceName);
}

export {
    normalizeText,
    equalsIgnoringCase,
    setTitle,
    setGenre,
    setCollectionName,
    getGenre,
    getCollectionName,
    set_genre_and_collection_name_from_link
};