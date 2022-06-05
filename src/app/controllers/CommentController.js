const commentService = require("../services/CommentService");

exports.postComment = function (req, res) {
    commentService.save(req.body, req.session.profile.id)
        .then(comment => {
            res.status(200).send(comment);
        })
        .catch(error => {
            res.status(500).send(error);
        })
}