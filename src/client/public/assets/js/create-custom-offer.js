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

async function uploadOffer(file, title, desc, offeredPrice, offerNftCategory) {
    let fd = new FormData();
    fd.append('file', file);
    fd.append('title', title);
    fd.append('description', desc);
    fd.append('offeredPrice', offeredPrice);
    fd.append('offerNftCategory', offerNftCategory);

    return $.ajax({
        url: 'createCustomOffer',
        type: 'post',
        data: fd,
        contentType: false,
        processData: false,
        cache: false,
        enctype: 'multipart/form-data',
        success: function (response) {
            $("#popup-offer").text(response);
            $("#offer-popup-trigger").click();
        },
        error: function (xhr) {
            $("#popup-offer").text(xhr.responseText);
            $("#offer-popup-trigger").click();
        }
    });
}

$(".create-offer-button").on('click', async function () {

    const title = $("#offerTitleInput").val();
    const desc = $('#offerDesc').val();
    const offeredPrice = $('#offerPriceInput').val();
    let offerNftCategory;

    let offerNftCategories = document.getElementsByName('offer-pages-category');

    for (let category of offerNftCategories) {
        if (category.checked) {
            offerNftCategory = category.value;
        }
    }

    if (!title || !desc || !offeredPrice || isNaN(offeredPrice)) {
        $("#popup-offer").text("Some fields are empty or invalid");
        $("#offer-popup-trigger").click();
        return;
    }

    const files = $('#offer-upload-file').prop('files');

    if (files.length > 0) {
        await uploadOffer(files[0], title, desc, offeredPrice, offerNftCategory);
    } else {
        $("#popup-offer").text("No file uploaded");
        $("#offer-popup-trigger").click();
        return;
    }
})