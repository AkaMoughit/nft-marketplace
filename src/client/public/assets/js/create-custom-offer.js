$("#offer-upload-field").on("change", function() {
    const files = $('#offer-upload-file').prop('files');
    if (files.length > 0) {
        let preview = $("#offer-image-preview");
        if (preview.length) {
            preview.attr("src", URL.createObjectURL(files[0]));
            $("#offer-upload-field").append(preview);
        } else {
            preview = document.createElement("img");
            preview.setAttribute("id", "offer-image-preview");
            preview.setAttribute("src", URL.createObjectURL(files[0]));
            $("#offer-upload-field").append(preview);
        }
    }
});