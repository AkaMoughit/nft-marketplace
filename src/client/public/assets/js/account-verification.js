$(".resend-verification-button").on("click", function () {
    let email = $(this).data("email");
    return $.ajax({
        url: 'resendVerification',
        type: 'get',
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