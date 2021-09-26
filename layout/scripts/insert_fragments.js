const BASE_PATH_TO_GALLERY = "../../../images/demo/gallery/"

function insert_header() {
    $(".wrapper.col1").load("/pages/header.html");
}

function insert_footer() {
    $(".wrapper.col5").load("/pages/footer.html");
}

function insert_gallery_thumbnails(title, pathToImages) {
    $(".wrapper.col4").load("/pages/gallery/gallery_thumbnails.html",
        function () {
            $(".wrapper.col4 h2").text(title); // change h2 of thumbnails collection
            prepend_gallery_hrefs_with_path_to_images(pathToImages)
            prepend_gallery_img_source_with_path_to_images(pathToImages)
            load_pretty_photo()
        });
}

function prepend_gallery_hrefs_with_path_to_images(pathToImages) {
    $('.wrapper.col4 a').attr('href', function (i, href) { // prepend path for images
        return BASE_PATH_TO_GALLERY + pathToImages + href;
    });
}

function prepend_gallery_img_source_with_path_to_images(pathToImages) {
    $('.wrapper.col4 img').attr('src', function (i, src) { // prepend path for images
        return BASE_PATH_TO_GALLERY + pathToImages + src;
    });
}

function load_pretty_photo() {
    $("a[rel^='prettyPhoto']").prettyPhoto({
        theme: 'dark_rounded',
        overlay_gallery: false,
        social_tools: false
    });
}