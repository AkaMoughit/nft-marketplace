const CommentForm = document.getElementById('commentform');
const customOfferId = document.getElementById('customOfferId').innerText;
const commenstList = document.querySelector('.comment-list');

CommentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const commentBody = document.getElementById('commentBodyInput').value;

    let comment = {
        send_date: new Date(),
        body: commentBody,
        createdAt: new Date(),
        updatedAt: new Date(),
        CustomOfferId: customOfferId,
        ProfileId: null,
        commentId: null,
    }

    $.ajax({
        url: 'create-comment',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(comment),
        success: function (comment) {
            displayComment(comment);
            document.getElementById('commentBodyInput').value = '';
        },
        error: function (response) {
            console.log(response)
        }
    });
})

function displayComment(comment) {
    let li = document.createElement('li');
    li.classList.add('comment');
    li.setAttribute('id', 'li-comment-2');
    li.innerHTML = `
        <div class="com-image">
            <img alt="author" src="${comment.creator.picture_url}" class="avatar"
                height="70" width="70">
        </div>
        <div class="com-content">
            <div class="com-title">
                <div class="com-title-meta">
                    <h4><a href="author?profileId=${comment.creator.profile_id}"
                           rel="external nofollow" class="url">
                            ${comment.creator.name}
                        </a></h4>
                    <span> ${new Date()} </span>
                </div>
                <span class="reply">
                    <a rel="nofollow" class="comment-reply-link" href="#"><i
                            class="icofont-reply-all"></i>
                        Reply</a>
                </span>
            </div>
            <p>${comment.body}</p>
        </div>
    `;
    commenstList.appendChild(li);
}