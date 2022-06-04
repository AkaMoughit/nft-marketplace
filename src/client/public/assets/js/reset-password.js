$('.reset-pass-button').on('click', function () {
    const email = $("#floatingInput").val();

    return $.ajax({
        url: 'resetPassword',
        type: 'post',
        data: {
            email: email
        },
        success: function (response) {
            $("#popup").text(response);
            $("#popup-trigger").click();
        },
        error: function (xhr) {
            $("#popup").text(xhr.responseText);
            $("#popup-trigger").click();
        }
    });
});