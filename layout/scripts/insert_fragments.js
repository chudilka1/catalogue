const BASE_PATH_TO_GALLERY = "/images/demo/gallery/"

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

function insert_header() {
    $(".wrapper.col1").load("/pages/header.html");
}

function insert_footer() {
    $(".wrapper.col5").load("/pages/footer.html");
}

function insert_gallery_thumbnails(title, genre, collectionName) {
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
            $('#title').text(data.title);
            $('#author').text(data.author);
            $('#size').text(data.size);
            $('#materials').text(data.materials);
            $('#year').text(data.year);
        })
        .fail(function () {
            console.error("No description was found for [" + collectionName + "]");
        });
}

// access to details page is possible only from gallery page (with fragments)
// so by this time the arguments should be saved in localStorage
function populate_details_page(title, genre, collectionName) {
    $.getJSON(BASE_PATH_TO_GALLERY + genre + "/" + collectionName + "/" + collectionName + ".json")
        .done(function (data) {
            $('#title').text(data.title);
            $('#author').text("Author: " + data.author);
            $('#size').text("Size (cm): " + data.size);
            $('#materials').text("Materials: " + data.materials);
            $('#year').text("Year: " + data.year);
            $('#description').text("Description: " + data.description);
        })
        .fail(function () {
            console.error("No description was found for [" + collectionName + "]");
        });
}