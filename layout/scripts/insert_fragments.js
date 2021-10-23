import {
    normalizeText,
    setTitle,
    setGenre,
    setCollectionName,
    set_genre_and_collection_name_from_link
} from "./modules/utility_methods.js";

const BASE_PATH_TO_GALLERY = "/images/demo/gallery/"
const BASE_PATH_TO_GALERY_PAGES = "/pages/gallery/"

window.insert_head_common = function insert_head_common() {
    $.get("/pages/head_common.html", function (data) {
        $('head').append(data);
    });
}

window.insert_head_pretty_photo = function insert_head_pretty_photo() {
    $.get("/pages/head_pretty_photo.html", function (data) {
        $('head').append(data);
    });
}

window.insert_header = function insert_header() {
    let genresSet = new Set();
    $.getJSON(BASE_PATH_TO_GALLERY + "sources.json")
        .done(function (data) {
            $(data.sources).each(
                function (index, value) {
                    let genre = value[1];
                    genresSet.add(genre);
                })
        })
        .fail(function () {
            console.error("No source.json was found");
        })

    $(".wrapper.col1").load("/pages/header.html",
        function () {
            const listOfCatalogueOptionsElement = $("#topnav .last ul");
            for (const genre of genresSet) {
                let normalizedGenre = normalizeText(genre);
                listOfCatalogueOptionsElement.append(
                    $('<li>').append(
                        $('<a>').attr('href', BASE_PATH_TO_GALERY_PAGES + genre + "/index.html").text(normalizedGenre)))
            }
        });
}

window.insert_footer = function insert_footer() {
    $(".wrapper.col5").load("/pages/footer.html");
}

window.insert_gallery_thumbnails = function insert_gallery_thumbnails(genre, collectionName) {
    if (genre === undefined || collectionName === undefined) {
        genre = "animalism";
        collectionName = "horse_and_cobra";
    }

    let title = normalizeText(collectionName);

    setTitle(title);
    setGenre(genre);
    setCollectionName(collectionName);

    $(".wrapper.col4").load("/pages/gallery/gallery_thumbnails.html",
        function () {
            $(".wrapper.col4 h2").text(title); // change h2 of thumbnails collection
            populate_gallery_table_for(genre, collectionName);
            prepend_gallery_hrefs_with_path_to_images(genre, collectionName);
            prepend_gallery_img_source_with_path_to_images(genre, collectionName);
            load_pretty_photo();
        });
}

function prepend_gallery_hrefs_with_path_to_images(genre, collectionName) {
    $('.wrapper.col4 li a').attr('href', function (i, href) { // prepend path for images
        return BASE_PATH_TO_GALLERY + genre + "/" + collectionName + href;
    });
}

function prepend_gallery_img_source_with_path_to_images(genre, collectionName) {
    $('.wrapper.col4 li a img').attr('src', function (i, src) { // prepend path for images
        return BASE_PATH_TO_GALLERY + genre + "/" + collectionName + src;
    });
}

function load_pretty_photo() {
    $("a[rel^='prettyPhoto']").prettyPhoto({
        theme: 'dark_rounded',
        overlay_gallery: false,
        social_tools: false
    });
}

function populate_gallery_table_for(genre, collectionName) {
    $.getJSON(BASE_PATH_TO_GALLERY + genre + "/" + collectionName + "/" + collectionName + ".json")
        .done(function (data) {
            let title = normalizeText(collectionName);
            $('#title').text(title);
            $('#author').text(data.author);
            $('#size').text(data.size);
            $('#materials').text(data.materials);
            $('#year').text(data.year);
        })
        .fail(function () {
            console.error("No description was found for [" + collectionName + "]");
        });
}

window.insert_genre_fragments_for = function insert_genre_fragments_for(genre) {
    let availableSourceNamesForGenre = null;
    $.getJSON(BASE_PATH_TO_GALLERY + "sources.json")
        .done(function (data) {
            // resolve sources.json to map (genre: [sources])
            let mappedSources = new Map();
            $(data.sources).each(
                function (index, value) {
                    let linkedGenre = value[1];
                    let linkedSourceName = value[0];
                    // add new sourceNames to already existing genres in map
                    let sourceNamesArr = mappedSources.get(linkedGenre);
                    if (sourceNamesArr !== undefined && !sourceNamesArr.includes(linkedSourceName)) {
                        sourceNamesArr.push(linkedSourceName);
                    } else {
                        mappedSources.set(linkedGenre, [linkedSourceName]);
                    }
                })
            availableSourceNamesForGenre = Array.from(mappedSources.get(genre));
            $(".wrapper.col4").load("/pages/genre_tiles.html",
                function () {
                    // set genre for catalogue page
                    $('.gallery h2').text(genre);
                    // set corresponding images and links to fragments page
                    for (const sourceName of availableSourceNamesForGenre) {
                        let pathToSource = BASE_PATH_TO_GALLERY + genre + "/" + sourceName;
                        $('.gallery ul').append(
                            $('<li>').append(
                                $('<a>')
                                    .attr('href',  window.location.pathname.replace("index.html", sourceName + ".html"))
                                    .attr('title', sourceName)
                                    .click(function () {
                                        set_genre_and_collection_name_from_link(this);
                                        let behindGalleryWord = window.location.href.indexOf('y') + 2;
                                        let pathToFragmentsPage = window.location.href.slice(0, behindGalleryWord);
                                        window.location.href = pathToFragmentsPage  + "fragments_page.html";
                                        return false;
                                    })
                                    .append(
                                        $('<img>').attr('src', pathToSource + "/full_174.jpeg")
                                            .attr('alt', sourceName))));
                    }
                });
        })
        .fail(function () {
            console.error("No source.json was found");
        })
}