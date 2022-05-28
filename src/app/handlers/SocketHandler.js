const messageRepository = require('../repositories/MessageRepository');

module.exports = handleSocket = (io) => {
    io.on('connection', socket => {
        socket.on('join', (conversationId) => {
            socket.join(conversationId);
        })

        socket.on('message', async (message) => {
            try {
                let msg = await messageRepository.save(message);
                socket.to(msg.dataValues.ConversationId).emit('message', msg.dataValues);
            } catch (e) {
                console.log("error saving message to DB")
                console.log(e);
            }
        })
    })
}