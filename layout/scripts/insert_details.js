import {
    getGenre,
    equalsIgnoringCase,
    getCollectionName,
    normalizeText,
    set_genre_and_collection_name_from_link
} from "./modules/utility_methods.js";

const BASE_PATH_TO_GALLERY = "/images/demo/gallery/"
const BASE_PATH_TO_GALLERY_PAGES = "/pages/gallery/"

// access to details page is possible only from gallery page (with fragments)
// so by this time the arguments should be saved in localStorage
window.insert_details_page = function insert_details_page() {
    let genre = getGenre();
    let sourceName = getCollectionName();
    let newLineRegex = /\n/g;
    let startOfLineRegex = /^/;

    $.getJSON(BASE_PATH_TO_GALLERY + genre + "/" + sourceName + "/" + sourceName + ".json")
        .done(function (json) {
            // insert details info from painting json
            $('#title').text(normalizeText(sourceName));
            let author = $('#author').text(json.author);
            author.html(author.html().replace(startOfLineRegex, "<b style='color:#FFFF00'>Author: </b>"));

            let size = $('#size').text("Size (cm): " + json.size);
            size.html(size.html().replace(startOfLineRegex, "<b style='color:#FFFF00'>Size: </b>"));

            let materials = $('#materials').text("Materials: " + json.materials);
            materials.html(materials.html().replace(startOfLineRegex, "<b style='color:#FFFF00'>Materials: </b>"));

            let year = $('#year').text("Year: " + json.year);
            year.html(year.html().replace(startOfLineRegex, "<b style='color:#FFFF00'>Year: </b>"));

            let description = $('#description').text(json.description);
            let pathToContactsPage = "/pages/contacts.html";
            description.html(description.html()
                .replace(startOfLineRegex, "<b style='color:#FFFF00'>Description: </b>")
                .replace(newLineRegex,'<br/>')
                .replace("Pay attention:", "<span class='inline' style='color:#FFFF00'>Pay Attention: </span>")
                .replace("original physical Authentic Painting", "<span class='inline' style='color:#FFFF00'>original physical Authentic Painting</span>")
            ); // handle new lines
                //.replace(endOfLineRegex, `<p>If you have questions regarding the paintings or would like to make an order do not hesitate to </p><p><a class="yellow" href=${pathToContactsPage}>CONTACT US</a></p>`));
            description.append(
                $('<p>').text("If you have questions regarding the paintings or would like to make an order do not hesitate to ")
                    .append(
                        $('<a>').addClass("yellow").addClass("underlined").attr("href", pathToContactsPage).text("CONTACT US")
                    )
            );
        })
        .then(function () {
            let pathToSource = BASE_PATH_TO_GALLERY + getGenre() + "/" + getCollectionName() + "/homepage.jpeg";
            let pathToFragmentsPage = BASE_PATH_TO_GALLERY_PAGES + getGenre() + "/" + getCollectionName() + ".html";
            $('#title').after(
                $('<a>').attr('href', pathToFragmentsPage)
                    .click(function () {
                        const textBetweenLastSlashAndDotRegExp = new RegExp("([^\/]+$)");
                        window.location.href = window.location.pathname.replace(textBetweenLastSlashAndDotRegExp, "fragments_page.html"); //sourceName + ".html"
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
                    .append($("<img>").addClass("detailsPage").attr("src", pathToSource).attr("width", "240px"))
                    .click(function () {
                        set_genre_and_collection_name_from_link(this);
                        window.location.href = BASE_PATH_TO_GALLERY_PAGES + "fragments_page.html";
                        return false;
                    }));
            $('p.imgholder + p').text(normalizeText(randomSource));
            $('.readmore a')
                .attr("href", pathToFragmentsPage)
                .click(function () {
                    set_genre_and_collection_name_from_link(this);
                    window.location.href = BASE_PATH_TO_GALLERY_PAGES + "fragments_page.html";
                    return false;
                });
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