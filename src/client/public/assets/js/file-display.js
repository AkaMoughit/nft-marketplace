function getFileType(fileUrl) {
    return new Promise(async (resolve, reject) => {
        fileUrl = await (await fetch(fileUrl)).blob();
        const reader = new FileReader();
        reader.readAsDataURL(fileUrl);
        reader.onloadend = () => {
            let fileType = reader.result.split(";")[0].split(":")[1];
            resolve(fileType);
        };
    })
}

$(document).ready(async function () {
    let files = $(".file-data-container");
    for (let file of files) {
        let fileUrl = file.dataset.src;
        let fileType = await getFileType(fileUrl);
        let unknownUrl = ['application/octet-stream'];
        let imageValidUrl = ['image/png', 'image/jpeg', 'image/svg', 'image/webp'];
        let videoValidUrl = ['video/mp4', 'video/ogg', 'video/webm'];

        if(imageValidUrl.includes(fileType)) {
            let image = document.createElement("img");
            image.setAttribute("src", fileUrl);
            image.setAttribute("alt", file);
            file.appendChild(image);
        } else if(videoValidUrl.includes(fileType)) {
            let video = document.createElement("video");
            video.setAttribute("src", fileUrl);
            video.setAttribute("alt", file);
            video.setAttribute("controls", "")
            video.style.cssText += 'width: 100%;';
            video.style.cssText += 'height: 100%;';
            file.appendChild(video);
        } else if(unknownUrl.includes(fileType)){
            let object = document.createElement("object");
            object.setAttribute("data", fileUrl);
            file.appendChild(object);
        }
    }

})