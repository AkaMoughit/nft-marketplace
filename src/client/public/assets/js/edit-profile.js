var profilePicFile = document.getElementById("profilePicInput");
var bannerPicFile = document.getElementById("bannerPicInput");

profilePicFile.addEventListener("change", function(event) {
    var image = $("#profilePicInput")[0].files[0];
    var formdata = new FormData();
    formdata.append('profilePic', image);
    $.ajax({
        url: '/edit-profile-pic/',
        data: formdata,
        contentType: false,
        processData: false,
        type: 'PUT',
        'success':function(data){
            document.getElementById('profilePic').setAttribute('src', data);
        },
        'error': function(data) {
            console.log(data);
            alert(data.responseText);
        }
    });
}, false);

bannerPicFile.addEventListener("change", function(event) {
    var image = $("#bannerPicInput")[0].files[0];
    var formdata = new FormData();
    formdata.append('bannerPic', image);
    $.ajax({
        url: '/edit-banner-pic/',
        data: formdata,
        contentType: false,
        processData: false,
        type: 'PUT',
        'success': function(data){
            document.getElementById('bannerPic').setAttribute('src', data);
        },
        'error': function(data) {
            console.log(data);
          alert(data.responseText);
        }
    });
}, false);

function toggleForm() {
    document.getElementById("popupForm").style.display =
        document.getElementById("popupForm").style.display === "none" ? "block" : "none";
}
