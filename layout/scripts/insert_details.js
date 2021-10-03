import {getGenre, getCollectionName, normalizeText} from "./modules/utility_methods.js";

const BASE_PATH_TO_GALLERY = "/images/demo/gallery/"

// access to details page is possible only from gallery page (with fragments)
// so by this time the arguments should be saved in localStorage
window.insert_details_page = function insert_details_page() {
    let genre = getGenre();
    let sourceName = getCollectionName();

    $.getJSON(BASE_PATH_TO_GALLERY + genre + "/" + sourceName + "/" + sourceName + ".json")
        .done(function (data) {
            $('#title').text(data.title);
            $('#author').text("Author: " + data.author);
            $('#size').text("Size (cm): " + data.size);
            $('#materials').text("Materials: " + data.materials);
            $('#year').text("Year: " + data.year);
            $('#description').text("Description: " + data.description);
        })
        .then(function () {
            let pathToSource = BASE_PATH_TO_GALLERY + getGenre() + "/" + getCollectionName() + "/homepage.jpeg";
            $('#title').after(
                $("<img>").addClass("detailsPage").attr("src", pathToSource));
        })
        .then(function () {
            insert_other_authentics()
        })
        .fail(function () {
            console.error("No description json was found for [" + sourceName + "]");
        });
}

function insert_other_authentics() {
    $.getJSON(BASE_PATH_TO_GALLERY + "sources.json")
        .done(function (data) {
            let totalSources = data.sources.length;
            let randomSourceIndex = Math.floor(Math.random() * totalSources);
            const sourceIndex = 0;
            const genreIndex = 1;
            let randomSource = data.sources[randomSourceIndex][sourceIndex];
            let randomGenre = data.sources[randomSourceIndex][genreIndex];
            let pathToSource = BASE_PATH_TO_GALLERY + randomGenre + "/" + randomSource + "/full.jpeg";
            $('p.imgholder').append(
                $("<img>").addClass("detailsPage").attr("src", pathToSource).attr("width", "240px")
            );
            $('p.imgholder + p').text(normalizeText(randomSource));
            $('.readmore a').attr("href", "/pages/gallery/" + randomGenre + "/" + randomSource + ".html");

        })
        .fail(function () {
            console.error("No source.json was found");
        })
}