import {
    getGenre,
    equalsIgnoringCase,
    getCollectionName,
    normalizeText,
    setGenre,
    setCollectionName
} from "./modules/utility_methods.js";

const BASE_PATH_TO_GALLERY = "/images/demo/gallery/"
const BASE_PATH_TO_GALLERY_PAGES = "/pages/gallery/"

// access to details page is possible only from gallery page (with fragments)
// so by this time the arguments should be saved in localStorage
window.insert_details_page = function insert_details_page() {
    let genre = getGenre();
    let sourceName = getCollectionName();

    $.getJSON(BASE_PATH_TO_GALLERY + genre + "/" + sourceName + "/" + sourceName + ".json")
        .done(function (data) {
            $('#title').text(normalizeText(sourceName));
            $('#author').text("Author: " + data.author);
            $('#size').text("Size (cm): " + data.size);
            $('#materials').text("Materials: " + data.materials);
            $('#year').text("Year: " + data.year);
            $('#description').text("Description: " + data.description);
        })
        .then(function () {
            let pathToSource = BASE_PATH_TO_GALLERY + getGenre() + "/" + getCollectionName() + "/homepage.jpeg";
            let pathToFragmentsPage = BASE_PATH_TO_GALLERY_PAGES + getGenre() + "/" + getCollectionName() + ".html";
            $('#title').after(
                $('<a>').attr('href', pathToFragmentsPage)
                    .click(function () {
                        const afterLastSlashRegExp = new RegExp("([^\/]+$)");
                        window.location.href = window.location.pathname.replace(afterLastSlashRegExp, "fragments_page.html"); //sourceName + ".html"
                        return false;
                    })
                    .append(
                        $("<img>").addClass("detailsPage").attr("src", pathToSource))
            );
        })
        .then(function () {
            insert_other_authentics(sourceName)
        })
        .fail(function () {
            console.error("No description json was found for [" + sourceName + "]");
        });
}

function insert_other_authentics(sourceName) {
    $.getJSON(BASE_PATH_TO_GALLERY + "sources.json")
        .done(function (data) {
            let randomSourceIndex = getRandomSourceIndex(data);
            let randomSource = getRandomSource(data, randomSourceIndex);
            // get an image (source) that is different from the opened one
            while (equalsIgnoringCase(randomSource, sourceName)) {
                randomSourceIndex = getRandomSourceIndex(data);
                randomSource = getRandomSource(data, randomSourceIndex);
            }

            let randomGenre = getRandomGenre(data, randomSourceIndex);
            let pathToSource = BASE_PATH_TO_GALLERY + randomGenre + "/" + randomSource + "/full.jpeg";
            let pathToFragmentsPage = BASE_PATH_TO_GALLERY_PAGES + randomGenre + "/" + randomSource + ".html";
            $('p.imgholder').append(
                $('<a>')
                    .attr('href', pathToFragmentsPage)
                    .click(function () {
                        let href = $(this).attr('href');
                        let slashBehindGalleryWord = href.indexOf('y') + 2;
                        let shortenedPathToSource = href.slice(slashBehindGalleryWord, href.lastIndexOf('.'));
                        let targetGenre = shortenedPathToSource.split('/')[0];
                        let targetSourceName = shortenedPathToSource.split('/')[1];
                        setGenre(targetGenre);
                        setCollectionName(targetSourceName);
                        window.location.href = BASE_PATH_TO_GALLERY_PAGES + "fragments_page.html"; //sourceName + ".html"
                        return false;
                    })
                    .append(
                        $("<img>").addClass("detailsPage").attr("src", pathToSource).attr("width", "240px")));
            $('p.imgholder + p').text(normalizeText(randomSource));
            $('.readmore a').attr("href", pathToFragmentsPage);

        })
        .fail(function () {
            console.error("No source.json was found");
        })
}

function getRandomSourceIndex(jsonData) {
    let totalSources = jsonData.sources.length;
    return Math.floor(Math.random() * totalSources);
}

function getRandomSource(jsonData, randomSourceIndex) {
    const sourceIndex = 0;

    return jsonData.sources[randomSourceIndex][sourceIndex];
}

function getRandomGenre(jsonData, randomSourceIndex) {
    const genreIndex = 1;
    return jsonData.sources[randomSourceIndex][genreIndex];
}