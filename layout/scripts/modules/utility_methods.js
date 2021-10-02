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

export {normalizeText};