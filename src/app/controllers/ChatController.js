const chatService = require('../services/ChatService')

exports.getConversation = (req, res) => {
    chatService.findOrCreateConversation(req.query.p1Id, req.query.p2Id, req.query.customOffer)
        .then(conversation => {
            res.status(200).redirect('/conversation?id=' + conversation.id)
        })
        .catch(error => {
            res.status(404).render('404', {
                error: error,
                sessionData: {isAuth: req.session.isAuth, profile: req.session.profile}
            });
        })
}

exports.conversationPage = (req, res) => {
    chatService.chatByConversationId(req.query.id, req.session.profile)
        .then( ([participantsAndConversationIds, otherParticipant, messages, conversation]) => {
            res.status(200).render('chat', {
                participantsAndConversationIds: participantsAndConversationIds,
                otherParticipant : otherParticipant,
                messages : messages,
                conversation : conversation,
                sessionData: { isAuth: req.session.isAuth, profile: req.session.profile }})
        }
        )
        .catch(error => {
            res.status(404).render('404', {
                error: error,
                sessionData: {isAuth: req.session.isAuth, profile: req.session.profile}
            });
        })
}

exports.deleteConversation = (req, res) => {
    chatService.deleteConversation(req.body.conversationId)
        .then( result => {
            res.status(200).redirect('/conversation');
        })
        .catch(error => {
            res.status(500).redirect('/conversation');
        })
}
